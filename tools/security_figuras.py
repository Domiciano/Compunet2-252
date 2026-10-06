"""Figuras SVG de «Introducción a Spring Security» (0032) y «Cargando usuario desde la DB» (0075).

    python3 tools/security_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/security_figuras.py --inject      reemplaza cada bloque ```svg de las dos lecciones
                                                    por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores por rol: solicitud teal, redirección rosa, Spring Security índigo, verificación ámbar,
sesión y cookie verde, controller violeta.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lesson23.md', 'lesson231.md']
SANS = "ui-sans-serif, -apple-system, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif"
MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"
FAM = {
    'indigo': ('#EEF1FF', '#A9B4F2', '#4453C9'),
    'violet': ('#F4EBFF', '#C9A6EE', '#7439B8'),
    'amber': ('#FFF3DC', '#F0C572', '#A96C05'),
    'green': ('#E8F6E3', '#9FD68D', '#3A8235'),
    'slate': ('#EFF1F5', '#C4CBD8', '#556074'),
    'rose': ('#FFEBEF', '#F3A3B2', '#C2354F'),
    'teal': ('#E3F6F3', '#86D3CA', '#0F8478'),
}


def head(fid, h, title, plain, sub, desc, colors=()):
    css = ''
    markers = ''
    for c in colors:
        strong = FAM[c][2]
        css += f'      #{fid} .ar-{c}{{fill:none;stroke:{strong};stroke-width:1.75;marker-end:url(#{fid}-ar-{c})}}\n'
        markers += (f'    <marker id="{fid}-ar-{c}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" '
                    f'markerUnits="strokeWidth" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.4,5 Z" fill="{strong}"/></marker>\n')
    return f'''<svg id="{fid}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 {h}" width="100%" style="max-width:960px;display:block;margin:0 auto" role="img" aria-labelledby="{fid}-ttl {fid}-dsc" font-family="{SANS}">
  <title id="{fid}-ttl">{plain}</title>
  <desc id="{fid}-dsc">{desc}</desc>
  <defs>
    <style>
      #{fid} .title{{fill:#161A26;font-size:22px;font-weight:700}}
      #{fid} .sub{{fill:#79809A;font-size:13.5px}}
      #{fid} .h{{font-size:12px;font-weight:700;letter-spacing:.08em;fill:#556074}}
      #{fid} .foot{{fill:#79809A;font-size:12px}}
      #{fid} .mono{{font-family:{MONO}}}
{css}    </style>
{markers}  </defs>
  <rect width="960" height="{h}" rx="16" fill="#FBFBFD"/>
  <text class="title" x="48" y="56">{title}</text>
  <text class="sub" x="48" y="80" data-fit="860">{sub}</text>
'''


def tail(h, foot):
    return f'  <text class="foot" x="48" y="{h-28}" data-fit="860">{foot}</text>\n</svg>\n'


def box(x, y, w, h, color, label, sub=None, hero=False, mono=True, fs=13.5):
    soft, border, strong = FAM[color]
    cls = 'class="mono" ' if mono else ''
    cy = y + h / 2 - (9 if sub else 0)
    s = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{soft}" stroke="{border}" stroke-width="{2.5 if hero else 1.5}"/>'
         f'<text {cls}x="{x + w/2:.0f}" y="{cy:.0f}" dy="0.35em" text-anchor="middle" font-size="{fs}" font-weight="700" fill="{strong}" data-fit="{w-16}">{label}</text>')
    if sub:
        s += (f'<text x="{x + w/2:.0f}" y="{cy + 19:.0f}" dy="0.35em" text-anchor="middle" font-size="12" fill="#454C61" '
              f'data-fit="{w-16}">{sub}</text>')
    return s + '\n'


def chip(x, y, n, color='amber'):
    soft, border, strong = FAM[color]
    return (f'<circle cx="{x}" cy="{y}" r="12" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
            f'<text x="{x}" y="{y}" dy="0.35em" text-anchor="middle" font-size="12.5" font-weight="700" fill="{strong}">{n}</text>\n')


def rows(x, y, w, names, color='violet', gap=38):
    soft, border, _ = FAM[color]
    s = ''
    for i, name in enumerate(names):
        s += (f'<rect x="{x}" y="{y + i*gap}" width="{w}" height="30" rx="7" fill="{soft}" stroke="{border}" stroke-width="1.25"/>'
              f'<text x="{x+12}" y="{y + i*gap + 15}" dy="0.35em" font-size="13" fill="#161A26" data-fit="{w-20}">{name}</text>')
    return s + '\n'


def pct(v):
    return f'{round(v, 2):g}'


def keyframes(name, spans):
    pts = {0: 0, 100: 0}
    for a, b in spans:
        pts.update({a: 0, a + 2: 1, b - 2: 1, b: 0})
    body = ' '.join(f'{pct(k)}%{{opacity:{v}}}' for k, v in sorted(pts.items()))
    return f'      @keyframes {name}{{{body}}}\n'


def travel(fid, name, t0, pts, t1):
    first, last = pts[0][1], pts[-1][1]
    body = f'0%,{pct(t0)}%{{opacity:0;transform:translate({first})}}'
    body += ''.join(f'{pct(t)}%{{opacity:1;transform:translate({xy})}}' for t, xy in pts)
    body += f'{pct(t1)}%,100%{{opacity:0;transform:translate({last})}}'
    return f'      #{fid} .{name}{{animation-name:{fid}-{name}}}\n      @keyframes {fid}-{name}{{{body}}}\n'


FIGS = {}
COURSES = ['Computación en Internet II', 'Aplicaciones Móviles', 'Ingeniería de Software']


def ss_sesion(freeze=None):
    """Animada: siete pasos de 3 s, del primer GET sin sesión al GET con cookie. Con freeze=1..7 sale el fotograma fijo de ese paso."""
    fid, h, n_steps, secs = 'ssSesion', 600, 7, 3
    w = 100 / n_steps
    s = head(fid, h, 'Autenticación basada en estado: la sesión y su cookie', 'Autenticación basada en estado: la sesión y su cookie',
             'El servidor recuerda quién inició sesión; el navegador solo guarda un identificador y lo envía en cada solicitud.',
             'Animación en siete pasos y dos columnas, navegador y servidor, con los mensajes HTTP en el medio. Uno: el navegador '
             'pide GET /courses/ y Spring Security intercepta la solicitud porque no hay sesión activa. Dos: Spring Security '
             'redirige a /login y el navegador muestra el formulario. Tres: el usuario envía sus credenciales con POST /login. '
             'Cuatro: Spring Security verifica las credenciales contra el usuario en memoria. Cinco: el servidor crea una sesión '
             'HTTP y genera un JSESSIONID. Seis: la respuesta trae Set-Cookie con el JSESSIONID y el navegador guarda la cookie. '
             'Siete: en cada solicitud siguiente el navegador envía la cookie y Spring Security deja pasar la petición al controller.',
             colors=('teal', 'rose', 'green', 'amber'))
    teal, rose, green, amber, ind, vio = (FAM[c][2] for c in ('teal', 'rose', 'green', 'amber', 'indigo', 'violet'))

    def span(a, b=None):
        return ((a - 1) * w, (b or a) * w)

    spans = {f'a{k}': [span(k)] for k in range(1, n_steps + 1)}
    spans.update({'a12': [span(1, 2)], 'a14': [span(1, 4)], 'a15': [span(1, 5)], 'a17': [span(1), span(7)], 'a26': [span(2, 6)],
                  'a36': [span(3, 6)], 'a57': [span(5, 7)], 'a67': [span(6, 7)], 'aB': [span(1), span(4), span(7)]})
    if freeze:
        on = {1: ['a1', 'a12', 'a14', 'a15', 'a17', 'aB', 'tk1'], 2: ['a2', 'a12', 'a14', 'a15', 'a26', 'tk2'],
              3: ['a3', 'a14', 'a15', 'a26', 'a36', 'tk3'], 4: ['a4', 'a14', 'a15', 'a26', 'a36', 'aB', 'tk4'],
              5: ['a5', 'a15', 'a26', 'a36', 'a57', 'tk5'], 6: ['a6', 'a26', 'a36', 'a57', 'a67', 'tk6'],
              7: ['a7', 'a17', 'a57', 'a67', 'aB', 'tk7']}[freeze]
        css = f'      #{fid} .an,#{fid} .st,#{fid} .ls{{opacity:0}}\n' + ''.join(f'      #{fid} .{c}{{opacity:1}}\n' for c in on)
        css += (f'      #{fid} .tk1,#{fid} .tk3{{transform:translate(348px,0)}}\n      #{fid} .tk2,#{fid} .tk6{{transform:translate(-348px,0)}}\n'
                f'      #{fid} .tk4,#{fid} .tk5{{transform:translate(32px,0)}}\n      #{fid} .tk7{{transform:translate(436px,0)}}\n')
    else:
        css = (f'      #{fid} .an,#{fid} .ls,#{fid} .st{{animation-duration:{n_steps * secs}s;animation-iteration-count:infinite;animation-timing-function:linear}}\n'
               f'      #{fid} .an{{opacity:0}}\n      #{fid} .st{{animation-name:{fid}-hide}}\n')
        for k, sp in spans.items():
            css += f'      #{fid} .{k}{{animation-name:{fid}-{k}}}\n' + keyframes(f'{fid}-{k}', sp)

        def token(name, step, legs):
            s0 = (step - 1) * w
            pts = [(s0 + f * w, xy) for f, xy in legs]
            return travel(fid, name, s0 + .08 * w, pts, s0 + .92 * w)
        css += token('tk1', 1, [(.2, '0,0'), (.75, '348px,0')])
        css += token('tk2', 2, [(.2, '0,0'), (.75, '-348px,0')])
        css += token('tk3', 3, [(.2, '0,0'), (.75, '348px,0')])
        css += token('tk4', 4, [(.2, '0,0'), (.6, '32px,0')])
        css += token('tk5', 5, [(.2, '0,0'), (.6, '32px,0')])
        css += token('tk6', 6, [(.2, '0,0'), (.75, '-348px,0')])
        css += token('tk7', 7, [(.2, '0,0'), (.6, '348px,0'), (.75, '436px,0')])
        css += (f'      @keyframes {fid}-hide{{from{{opacity:0}}to{{opacity:0}}}}\n'
                f'      @media (prefers-reduced-motion: reduce){{#{fid} .an,#{fid} .ls,#{fid} .st{{animation:none}}}}\n')
    s = s.replace('    </style>', css + '    </style>', 1)
    s = s.replace(f'<svg id="{fid}"', f'<svg id="{fid}" data-steps="{n_steps}" data-step-seconds="{secs}"', 1)

    for x, pw, label in ((48, 264, 'NAVEGADOR'), (648, 264, 'SERVIDOR · SPRING BOOT')):
        s += f'  <rect x="{x}" y="104" width="{pw}" height="364" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += f'  <text class="h" x="{x+16}" y="128" data-fit="{pw-32}">{label}</text>\n'
    s += '  <text class="h" x="480" y="128" text-anchor="middle">MENSAJES HTTP</text>\n'

    s += '  <rect x="60" y="144" width="240" height="220" rx="12" fill="#FFFFFF" stroke="#2A3040" stroke-width="2.5"/>\n'
    s += '  <path d="M61,180 H299" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    s += ''.join(f'  <circle cx="{76 + i*12}" cy="162" r="3.5" fill="#C4CBD8"/>\n' for i in range(3))
    s += '  <rect x="112" y="151" width="176" height="22" rx="11" fill="#EFF1F5"/>\n'
    for cls, url in (('ls a17', 'localhost:8080/courses/'), ('an a26', 'localhost:8080/login')):
        s += f'  <text class="mono {cls}" x="200" y="162" dy="0.35em" text-anchor="middle" font-size="11" fill="#454C61" data-fit="164">{url}</text>\n'
    s += '  <g class="an a1">' + ''.join(
        f'<rect x="76" y="{200 + i*26}" width="{bw}" height="10" rx="5" fill="#E3E7EE"/>' for i, bw in enumerate((120, 208, 176, 144)))
    s += '<text x="180" y="332" text-anchor="middle" font-size="12.5" font-weight="600" fill="#454C61">esperando la respuesta…</text></g>\n'
    s += '  <g class="an a26"><text x="76" y="206" font-size="14" font-weight="700" fill="#161A26">Please sign in</text>'
    for y in (218, 254):
        s += f'<rect x="76" y="{y}" width="208" height="28" rx="6" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>'
    s += (f'<rect x="76" y="294" width="208" height="30" rx="6" fill="{ind}"/>'
          '<text x="180" y="309" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">Sign in</text></g>\n')
    s += ('  <g class="an a2"><text x="88" y="232" dy="0.35em" font-size="12.5" fill="#9AA3B5">Username</text>'
          '<text x="88" y="268" dy="0.35em" font-size="12.5" fill="#9AA3B5">Password</text></g>\n')
    s += ('  <g class="an a36"><text class="mono" x="88" y="232" dy="0.35em" font-size="12.5" fill="#161A26">user</text>'
          '<text x="88" y="268" dy="0.35em" font-size="12.5" fill="#161A26">••••••••••••</text></g>\n')
    s += ('  <g class="ls a7"><text x="76" y="206" font-size="14" font-weight="700" fill="#161A26">Cursos</text>' +
          rows(76, 218, 208, COURSES, gap=36).strip() + '</g>\n')

    s += '  <g class="an a15">' + box(60, 390, 240, 52, 'slate', 'Cookies', sub='ninguna todavía', mono=False).strip() + '</g>\n'
    s += '  <g class="ls a67">' + box(60, 390, 240, 52, 'green', 'JSESSIONID=ABC123XYZ456', sub='cookie guardada', fs=12.5).strip() + '</g>\n'

    soft, border, _ = FAM['indigo']
    s += f'  <rect x="664" y="144" width="52" height="308" rx="10" fill="{soft}" stroke="{border}" stroke-width="2.5"/>\n'
    s += f'  <text x="683" y="298" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="{ind}" transform="rotate(-90 683 298)">Spring Security</text>\n'
    s += '  <text x="702" y="298" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#454C61" transform="rotate(-90 702 298)">intercepta cada solicitud</text>\n'
    s += '  <g class="an a12">' + box(752, 152, 148, 32, 'rose', 'sin sesión: no pasa', mono=False, fs=12.5).strip() + '</g>\n'
    s += '  ' + box(752, 236, 148, 52, 'amber', 'user', sub='usuario en memoria')
    s += '  <g class="an a14">' + box(752, 318, 148, 52, 'slate', 'Sesiones HTTP', sub='ninguna todavía', mono=False).strip() + '</g>\n'
    s += '  <g class="ls a57">' + box(752, 318, 148, 52, 'green', 'ABC123XYZ456', sub='sesión de user').strip() + '</g>\n'
    s += '  ' + box(752, 390, 148, 52, 'violet', 'CoursesController', sub='recurso protegido', fs=12)

    s += '  <path class="ar-teal" d="M314,168 H662"/><path class="ar-rose" d="M662,212 H314"/><path class="ar-teal" d="M314,262 H662"/>\n'
    s += '  <path class="ar-green" d="M662,344 H314"/><path class="ar-teal" d="M314,416 H662"/>\n'
    s += '  <path class="ar-amber" d="M718,262 H750"/><path class="ar-green" d="M718,344 H750"/><path class="ar-teal" d="M718,416 H750"/>\n'
    labels = [(160, teal, 'GET /courses/', 12.5), (204, rose, '302 · Location: /login', 12.5), (254, teal, 'POST /login', 12.5),
              (280, '#454C61', 'username=user&amp;password=0be98d58…', 11.5), (336, green, 'Set-Cookie: JSESSIONID=ABC123XYZ456', 12),
              (408, teal, 'GET /courses/', 12.5), (434, green, 'Cookie: JSESSIONID=ABC123XYZ456', 12)]
    for y, color, text, fs in labels:
        s += (f'  <text class="mono" x="488" y="{y}" text-anchor="middle" font-size="{fs}" font-weight="600" fill="{color}" '
              f'data-fit="270">{text}</text>\n')

    rings = [('aB', 658, 138, 64, 320, ind), ('a2', 54, 138, 252, 232, rose), ('a3', 54, 138, 252, 232, teal),
             ('a4', 746, 230, 160, 64, amber), ('a5', 746, 312, 160, 64, green), ('a6', 54, 384, 252, 64, green),
             ('a7', 746, 312, 160, 64, green), ('a7', 746, 384, 160, 64, vio)]
    for cls, x, y, rw, rh, color in rings:
        s += f'  <rect class="an {cls}" x="{x}" y="{y}" width="{rw}" height="{rh}" rx="14" fill="none" stroke="{color}" stroke-width="3"/>\n'
    for cls, cx, cy, color in (('tk1', 314, 168, teal), ('tk2', 662, 212, rose), ('tk3', 314, 262, teal), ('tk4', 718, 262, amber),
                               ('tk5', 718, 344, green), ('tk6', 662, 344, green), ('tk7', 314, 416, green)):
        s += f'  <circle class="an {cls}" cx="{cx}" cy="{cy}" r="8" fill="{color}" stroke="#FFFFFF" stroke-width="2"/>\n'

    for x, y, n, color in ((328, 168, 1, 'teal'), (640, 212, 2, 'rose'), (328, 262, 3, 'teal'), (900, 236, 4, 'amber'),
                           (900, 318, 5, 'green'), (640, 344, 6, 'green'), (328, 416, 7, 'teal')):
        s += '  ' + chip(x, y, n, color)

    s += '  <rect x="48" y="484" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    caps = [(1, 'teal', 'El navegador pide un recurso protegido: GET /courses/.', 'Spring Security intercepta la solicitud y detecta que no hay una sesión activa.'),
            (2, 'rose', 'Spring Security responde con una redirección a /login.', 'El navegador la sigue y muestra la página de inicio de sesión.'),
            (3, 'teal', 'El usuario escribe su usuario y su contraseña y presiona «Sign in».', 'El navegador envía un POST /login con las credenciales en el cuerpo.'),
            (4, 'amber', 'Spring Security verifica las credenciales.', 'Las compara con el usuario que conoce: por ahora, el usuario en memoria.'),
            (5, 'green', 'Son correctas: el servidor crea una sesión HTTP y genera un JSESSIONID único.', 'La sesión vive en el servidor: ese es el «estado» de este mecanismo.'),
            (6, 'green', 'La respuesta trae la cabecera Set-Cookie con el JSESSIONID.', 'El navegador guarda la cookie.'),
            (7, 'teal', 'Desde ahora el navegador envía la cookie en cada solicitud, automáticamente.', 'Spring Security encuentra la sesión y deja pasar la petición hasta el controller.')]
    for n, color, l1, l2 in caps:
        s += (f'  <g class="an a{n}">' + chip(76, 512, n, color).strip() +
              f'<text x="100" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="790">{l1}</text>'
              f'<text x="100" y="525" font-size="13" fill="#454C61" data-fit="790">{l2}</text></g>\n')
    s += ('  <g class="st"><text x="68" y="507" font-size="13" font-weight="600" fill="#161A26" data-fit="820">El servidor guarda la sesión; el navegador solo guarda el JSESSIONID y lo envía en cada solicitud.</text>'
          '<text x="68" y="525" font-size="13" fill="#454C61" data-fit="820">Los números marcan el orden de los siete pasos.</text></g>\n')
    return s + tail(h, 'La sesión expira en el servidor: el tiempo se ajusta con server.servlet.session.timeout.')


FIGS['ssSesion'] = ss_sesion


def anim_css(fid, n_steps, secs, spans, tokens, freeze, on):
    """CSS de la línea de tiempo. tokens: (clase, paso, [(fracción del paso, 'x,y'), ...]); en un fotograma fijo quedan en su destino."""
    w = 100 / n_steps
    if freeze:
        css = f'      #{fid} .an,#{fid} .st,#{fid} .ls{{opacity:0}}\n' + ''.join(f'      #{fid} .{c}{{opacity:1}}\n' for c in on[freeze])
        for name, step, legs in tokens:
            css += f'      #{fid} .{name}{{transform:translate({legs[-1][1]})' + (';opacity:1' if step == freeze else '') + '}\n'
        return css
    css = (f'      #{fid} .an,#{fid} .ls,#{fid} .st{{animation-duration:{n_steps * secs}s;animation-iteration-count:infinite;animation-timing-function:linear}}\n'
           f'      #{fid} .an{{opacity:0}}\n      #{fid} .st{{animation-name:{fid}-hide}}\n')
    for k, steps in spans.items():
        css += f'      #{fid} .{k}{{animation-name:{fid}-{k}}}\n' + keyframes(f'{fid}-{k}', [((a - 1) * w, b * w) for a, b in steps])
    for name, step, legs in tokens:
        s0 = (step - 1) * w
        css += travel(fid, name, s0 + max(legs[0][0] - .04, .02) * w, [(s0 + f * w, xy) for f, xy in legs], s0 + .92 * w)
    return css + (f'      @keyframes {fid}-hide{{from{{opacity:0}}to{{opacity:0}}}}\n'
                  f'      @media (prefers-reduced-motion: reduce){{#{fid} .an,#{fid} .ls,#{fid} .st{{animation:none}}}}\n')


HOP_SLOTS = {1: [(.12, .55)], 2: [(.1, .35), (.42, .67)], 3: [(.08, .27), (.31, .5), (.54, .73)], 4: [(.06, .21), (.24, .39), (.42, .57), (.6, .75)]}


def hop_tokens(hops):
    """Un token por salto (paso, x, y, (dx, dy), color, texto): los de un mismo paso salen uno tras otro y quedan visibles hasta el final."""
    tokens, seen = [], {}
    for n, (step, _, _, (dx, dy), _, _) in enumerate(hops):
        start, arrive = HOP_SLOTS[sum(1 for hp in hops if hp[0] == step)][seen.setdefault(step, 0)]
        seen[step] += 1
        tokens.append((f'hp{n}', step, [(start, '0,0'), (arrive, f'{dx}px,{dy}px'), (.88, f'{dx}px,{dy}px')]))
    return tokens


def hop_pills(hops):
    """La etiqueta que viaja con cada punto: lo que entra o sale del bloque."""
    s = ''
    for n, (_, x, y, _, color, text) in enumerate(hops):
        safe = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace(chr(34), '&quot;')
        s += (f'  <g class="an hp{n}"><rect x="{x-10}" y="{y-10}" width="{30 + len(text) * 6.6:.0f}" height="20" rx="10" fill="#FFFFFF" stroke="{color}" stroke-width="1.5"/>'
              f'<circle cx="{x}" cy="{y}" r="5" fill="{color}"/>'
              f'<text class="mono" x="{x+11}" y="{y}" dy="0.35em" font-size="11" font-weight="600" fill="#161A26">{safe}</text></g>\n')
    return s


def ss_carga_db(freeze=None):
    """Animada: siete pasos de 4 s, del POST /login al usuario cargado de la base de datos. Con freeze=1..7 sale el fotograma fijo de ese paso."""
    fid, h, n_steps, secs = 'ssCargaDb', 738, 7, 4
    s = head(fid, h, 'Del formulario a la base de datos: quién carga el usuario', 'Del formulario a la base de datos: quién carga el usuario',
             'Spring Security sabe autenticar, pero no sabe dónde están los usuarios: eso se lo dice su código.',
             'Animación en siete pasos y dos columnas: las piezas de Spring Security a la izquierda y el código propio a la derecha. '
             'En cada paso, un punto viaja de bloque en bloque con lo que entra o lo que sale. Uno: del navegador llega POST /login con el correo y la '
             'contraseña, y UsernamePasswordAuthenticationFilter arma una Authentication sin autenticar. Dos: el filtro se la pasa '
             'al AuthenticationManager, que se la entrega a DaoAuthenticationProvider. Tres: el provider llama a loadUserByUsername '
             'de CustomUserDetailsService con el correo. Cuatro: ese servicio llama a findByEmail de UserService, este al de '
             'UserRepository, y el repositorio hace un SELECT en la tabla users. Cinco: vuelve un User, que se envuelve en un '
             'SecurityUser, el UserDetails que sale de loadUserByUsername. Seis: el provider le entrega las dos contraseñas al '
             'PasswordEncoder, que responde true. Siete: sube una Authentication autenticada, se crea la sesión HTTP y la respuesta '
             'sale con Set-Cookie JSESSIONID.',
             colors=('teal', 'green'))
    teal, green, amber, ind = (FAM[c][2] for c in ('teal', 'green', 'amber', 'indigo'))
    spans = {f'a{k}': [(k, k)] for k in range(1, n_steps + 1)}
    spans.update({'a14': [(1, 4)], 'a35': [(3, 5)], 'a57': [(5, 7)], 'aD': [(2, 3), (6, 6)]})
    on = {1: ['a1', 'a14'], 2: ['a2', 'aD', 'a14'], 3: ['a3', 'aD', 'a35', 'a14'], 4: ['a4', 'a35', 'a14'],
          5: ['a5', 'a35', 'a57'], 6: ['a6', 'aD', 'a57'], 7: ['a7', 'a57']}
    down, up, near = (0, 20), (0, -20), (0, 24)
    hops = [(1, 72, 178, down, teal, 'POST /login · ana@icesi.edu.co · 123456'),
            (2, 72, 258, down, teal, 'Authentication sin autenticar'), (2, 72, 338, down, teal, 'Authentication sin autenticar'),
            (3, 352, 364, (46, 0), teal, 'loadUserByUsername("ana@icesi.edu.co")'),
            (4, 412, 418, down, teal, 'findByEmail("ana@icesi.edu.co")'), (4, 412, 498, down, teal, 'findByEmail("ana@icesi.edu.co")'),
            (4, 616, 552, (34, 0), teal, 'SELECT'),
            (5, 670, 566, (-48, 0), green, 'fila'), (5, 428, 538, up, green, 'User · ana@icesi.edu.co · 123456'),
            (5, 428, 458, up, green, 'User · ana@icesi.edu.co · 123456'), (5, 398, 364, (-46, 0), green, 'UserDetails: SecurityUser'),
            (6, 72, 426, near, teal, 'matches("123456", "123456")'), (6, 88, 450, (0, -24), green, 'true'),
            (7, 88, 378, up, green, 'Authentication autenticada'), (7, 88, 298, up, green, 'Authentication autenticada'),
            (7, 88, 218, up, green, 'Set-Cookie: JSESSIONID=ABC123…')]
    s = s.replace('    </style>', anim_css(fid, n_steps, secs, spans, hop_tokens(hops), freeze, on) + '    </style>', 1)
    s = s.replace(f'<svg id="{fid}"', f'<svg id="{fid}" data-steps="{n_steps}" data-step-seconds="{secs}"', 1)

    for x, pw, label in ((48, 316, 'SPRING SECURITY'), (388, 524, 'SU CÓDIGO')):
        s += f'  <rect x="{x}" y="104" width="{pw}" height="502" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += f'  <text class="h" x="{x+16}" y="128" data-fit="{pw-32}">{label}</text>\n'

    def hop(x, top):
        """Dos bloques apilados: flecha de ida y de vuelta en el hueco entre ellos."""
        return (f'  <path class="ar-teal" d="M{x},{top+2} V{top+42}"/><path class="ar-green" d="M{x+16},{top+42} V{top+2}"/>'
'\n')

    s += '  ' + box(64, 140, 284, 36, 'slate', 'Navegador', mono=False)
    s += '  ' + box(64, 220, 284, 36, 'indigo', 'UsernamePasswordAuthenticationFilter', fs=11.5)
    s += '  ' + box(64, 300, 284, 36, 'indigo', 'AuthenticationManager')
    s += '  ' + box(64, 380, 284, 36, 'indigo', 'DaoAuthenticationProvider', hero=True)
    s += '  ' + box(64, 460, 284, 36, 'amber', 'PasswordEncoder')
    s += hop(72, 176)
    s += hop(72, 256)
    s += hop(72, 336)
    s += hop(72, 416)

    s += '  <text class="h" x="404" y="148">USUARIO AUTENTICADO</text><text class="h" x="668" y="148">CÓMO LEER LOS PUNTOS</text>\n'
    s += ('  <g class="an a14"><rect x="404" y="162" width="240" height="96" rx="10" fill="none" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>'
          '<text x="524" y="210" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#79809A">todavía no hay un UserDetails</text></g>\n')
    soft, border, _ = FAM['green']
    s += (f'  <g class="ls a57"><rect x="404" y="162" width="240" height="96" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
          f'<text class="mono" x="416" y="183" font-size="13" font-weight="700" fill="{green}">SecurityUser</text>'
          '<text x="628" y="183" text-anchor="end" font-size="11.5" fill="#454C61">es un UserDetails</text>' +
          box(416, 194, 216, 52, 'slate', 'User', sub='ana@icesi.edu.co · 123456').strip() + '</g>\n')
    s += '  <rect x="668" y="162" width="228" height="96" rx="10" fill="#FBFBFD" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    s += f'  <circle cx="700" cy="194" r="7" fill="{teal}"/><circle cx="700" cy="228" r="7" fill="{green}"/>\n'
    s += f'  <text x="720" y="194" dy="0.35em" font-size="12.5" font-weight="600" fill="#161A26">lo que entra al bloque</text>\n'
    s += f'  <text x="720" y="228" dy="0.35em" font-size="12.5" font-weight="600" fill="#161A26">lo que sale del bloque</text>\n'

    s += '  ' + box(404, 380, 200, 36, 'amber', 'CustomUserDetailsService', fs=12)
    s += '  ' + box(404, 460, 200, 36, 'amber', 'UserService')
    s += '  ' + box(404, 540, 200, 36, 'amber', 'UserRepository')
    s += '  <path class="ar-teal" d="M350,391 H402"/><path class="ar-green" d="M402,405 H350"/>\n'
    s += hop(412, 416)
    s += hop(412, 496)

    s += '  <text class="h" x="716" y="514">TABLA USERS</text>\n'
    s += '  <rect x="716" y="522" width="180" height="72" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>\n'
    s += '  <path d="M716,546 H896 V530 A8,8 0 0 0 888,522 H724 A8,8 0 0 0 716,530 Z" fill="#EFF1F5"/>\n'
    s += '  <path d="M716,546 H896 M716,570 H896 M840,522 V594" stroke="#D9DEE8" stroke-width="1.25" fill="none"/>\n'
    for i, (email, pw) in enumerate((('email', 'pass'), ('ana@icesi.edu.co', '123456'), ('luis@icesi.edu.co', 'qwerty'))):
        weight, fill = ('700', '#556074') if i == 0 else ('400', '#161A26')
        s += (f'  <text class="mono" x="724" y="{534 + i*24}" dy="0.35em" font-size="10.5" font-weight="{weight}" fill="{fill}">{email}</text>'
              f'<text class="mono" x="848" y="{534 + i*24}" dy="0.35em" font-size="10.5" font-weight="{weight}" fill="{fill}">{pw}</text>\n')
    s += '  <path class="ar-teal" d="M606,552 H714"/><path class="ar-green" d="M714,566 H606"/>\n'

    rings = [('a1', 60, 136, 292, 44, teal), ('a1', 60, 216, 292, 44, ind), ('a2', 60, 296, 292, 44, ind), ('aD', 60, 376, 292, 44, ind),
             ('a35', 400, 376, 208, 44, amber), ('a4', 400, 456, 208, 44, amber), ('a4', 400, 536, 208, 44, amber),
             ('a5', 398, 156, 252, 108, green), ('a6', 60, 456, 292, 44, amber), ('a7', 60, 136, 292, 44, green)]
    for cls, x, y, rw, rh, color in rings:
        s += f'  <rect class="an {cls}" x="{x}" y="{y}" width="{rw}" height="{rh}" rx="12" fill="none" stroke="{color}" stroke-width="3"/>\n'
    s += f'  <rect class="an a4" x="716" y="546" width="180" height="24" fill="{teal}" fill-opacity=".12" stroke="{teal}" stroke-width="2"/>\n'
    for x, y, n, color in ((350, 238, 1, 'indigo'), (350, 318, 2, 'indigo'), (610, 398, 3, 'amber'), (610, 478, 4, 'amber'),
                           (644, 162, 5, 'green'), (350, 478, 6, 'amber'), (350, 158, 7, 'green')):
        s += '  ' + chip(x, y, n, color)
    s += hop_pills(hops)

    s += '  <rect x="48" y="622" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    caps = [(1, 'indigo', 'Llega el POST /login: UsernamePasswordAuthenticationFilter saca el usuario y la contraseña del formulario.', 'Con ellos arma un objeto Authentication, todavía sin autenticar.'),
            (2, 'indigo', 'El filtro le entrega esa Authentication al AuthenticationManager, que se la pasa a DaoAuthenticationProvider.', 'Este provider sabe autenticar, pero no sabe dónde están los usuarios.'),
            (3, 'amber', 'Por eso llama a loadUserByUsername con el nombre de usuario y espera de vuelta un UserDetails.', 'Aquí entra su código: CustomUserDetailsService implementa UserDetailsService.'),
            (4, 'amber', 'CustomUserDetailsService le pasa el correo a UserService, y este a UserRepository, que consulta la tabla users.', 'Son el servicio y el repositorio de usuarios, como los de cualquier otra entidad.'),
            (5, 'green', 'De vuelta sube un User; CustomUserDetailsService lo envuelve en un SecurityUser, que implementa UserDetails.', 'Eso es lo que sale de loadUserByUsername.'),
            (6, 'amber', 'DaoAuthenticationProvider le entrega al PasswordEncoder la contraseña del formulario y la de getPassword().', 'Si el usuario no existe o las contraseñas no coinciden, la autenticación falla.'),
            (7, 'green', 'Coinciden: sube una Authentication ya autenticada y se crea la sesión HTTP.', 'La respuesta sale con la cookie JSESSIONID, igual que con el usuario en memoria.')]
    for n, color, l1, l2 in caps:
        s += (f'  <g class="an a{n}">' + chip(76, 650, n, color).strip() +
              f'<text x="100" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="790">{l1}</text>'
              f'<text x="100" y="663" font-size="13" fill="#454C61" data-fit="790">{l2}</text></g>\n')
    s += ('  <g class="st"><text x="68" y="645" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Spring Security trae el filtro, el manager y el provider; usted escribe quién carga el usuario y qué lo representa.</text>'
          '<text x="68" y="663" font-size="13" fill="#454C61" data-fit="820">Los números marcan el orden de los siete pasos.</text></g>\n')
    return s + tail(h, 'Bloques índigo: los trae Spring Security. Bloques ámbar: los escribe usted.')


FIGS['ssCargaDb'] = ss_carga_db


IN_MEMORY_CODE = ['@Configuration', 'public class WebSecurityConfig {', '  @Bean', '  public UserDetailsService userDetailsService() {',
                  '    InMemoryUserDetailsManager userDetailsMngr =', '        new InMemoryUserDetailsManager();',
                  '    UserDetails user = User.withUsername("miUsuario")', '        .password("123456")', '        .authorities("read")',
                  '        .build();', '    userDetailsMngr.createUser(user);', '    return userDetailsMngr;', '  }', '  @Bean',
                  '  public PasswordEncoder passwordEncoder() {', '    return NoOpPasswordEncoder.getInstance();', '  }', '}']


def ss_in_memory(freeze=None):
    """Animada: seis pasos de 3 s, del usuario por defecto al usuario propio en memoria. Con freeze=1..6 sale el fotograma fijo de ese paso."""
    fid, h, n_steps, secs = 'ssInMemory', 668, 6, 3
    s = head(fid, h, 'Del usuario por defecto a su propio usuario en memoria', 'Del usuario por defecto a su propio usuario en memoria',
             'Dos @Bean en WebSecurityConfig: uno dice quiénes son los usuarios y el otro cómo se compara la contraseña.',
             'Animación en seis pasos y dos columnas: el código de WebSecurityConfig a la izquierda y lo que queda en memoria a la '
             'derecha. Uno: sin configuración, Spring Boot crea el usuario user con una contraseña generada. Dos: al declarar un Bean '
             'de tipo UserDetailsService ese usuario deja de crearse y el InMemoryUserDetailsManager arranca vacío. Tres: '
             'User.withUsername construye un UserDetails con nombre, contraseña y authorities. Cuatro: createUser lo agrega al '
             'manager. Cinco: el Bean de PasswordEncoder, con NoOpPasswordEncoder, compara la contraseña sin cifrar. Seis: al '
             'iniciar sesión entra miUsuario con 123456 y el usuario user ya no existe.')
    teal, green, amber, ind, slate = (FAM[c][2] for c in ('teal', 'green', 'amber', 'indigo', 'slate'))
    spans = {f'a{k}': [(k, k)] for k in range(1, n_steps + 1)}
    spans.update({'a13': [(1, 3)], 'a23': [(2, 3)], 'a26': [(2, 6)], 'a34': [(3, 4)], 'a46': [(4, 6)], 'a56': [(5, 6)], 'aM': [(2, 2), (6, 6)]})
    on = {1: ['a1', 'a13'], 2: ['a2', 'a23', 'a26', 'a13', 'aM'], 3: ['a3', 'a23', 'a26', 'a13', 'a34'], 4: ['a4', 'a26', 'a34', 'a46'],
          5: ['a5', 'a26', 'a46', 'a56'], 6: ['a6', 'a26', 'a46', 'a56', 'aM']}
    tokens = [('tk2', 2, [(.2, '0,0'), (.7, '52px,0')]), ('tk4', 4, [(.2, '0,0'), (.7, '0,-40px')]), ('tk6', 6, [(.2, '0,0'), (.75, '0,-120px')])]
    s = s.replace('    </style>', anim_css(fid, n_steps, secs, spans, tokens, freeze, on) + '    </style>', 1)
    s = s.replace(f'<svg id="{fid}"', f'<svg id="{fid}" data-steps="{n_steps}" data-step-seconds="{secs}"', 1)

    for x, pw, label in ((48, 432, 'EL CÓDIGO'), (504, 408, 'LO QUE QUEDA EN MEMORIA')):
        s += f'  <rect x="{x}" y="104" width="{pw}" height="432" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += f'  <text class="h" x="{x+16}" y="128" data-fit="{pw-32}">{label}</text>\n'

    s += '  <rect x="60" y="140" width="408" height="382" rx="10" fill="#1F2430"/>\n'
    s += '  <path d="M60,150 A10,10 0 0 1 70,140 H458 A10,10 0 0 1 468,150 V166 H60 Z" fill="#2A3040"/>\n'
    s += '  <text class="mono" x="72" y="153" dy="0.35em" font-size="12" fill="#9AA3B5">WebSecurityConfig.java</text>\n'
    for cls, first, last, color in (('a2', 2, 5, FAM['indigo'][1]), ('a3', 6, 9, FAM['teal'][1]), ('a4', 10, 10, FAM['green'][1]),
                                    ('a5', 13, 15, FAM['amber'][1]), ('a6', 11, 11, FAM['indigo'][1])):
        s += (f'  <rect class="an {cls}" x="64" y="{170 + first*19}" width="400" height="{(last - first + 1)*19 + 2}" rx="5" fill="{color}" '
              f'fill-opacity=".3" stroke="{color}" stroke-width="1.5"/>\n')
    for i, line in enumerate(IN_MEMORY_CODE):
        indent = len(line) - len(line.lstrip())
        text = line.strip()
        s += (f'  <text class="mono" x="{72 + indent*6.9:.1f}" y="{184 + i*19}" font-size="11.5" fill="#E6EAF2" textLength="{len(text)*6.9:.1f}" '
              f'lengthAdjust="spacingAndGlyphs">{text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace(chr(34), "&quot;")}</text>\n')
    s += ('  <g class="an a1"><path d="M60,166 H468 V512 A10,10 0 0 1 458,522 H70 A10,10 0 0 1 60,512 Z" fill="#1F2430" fill-opacity=".92"/>'
          '<text x="264" y="330" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Todavía no existe WebSecurityConfig</text>'
          '<text x="264" y="352" text-anchor="middle" font-size="12.5" fill="#9AA3B5">Solo está la dependencia de Spring Security</text></g>\n')

    soft, border, _ = FAM['indigo']
    s += f'  <rect x="520" y="150" width="376" height="138" rx="10" fill="{soft}" stroke="{border}" stroke-width="2.5"/>\n'
    s += f'  <text class="mono" x="536" y="174" font-size="13.5" font-weight="700" fill="{ind}">InMemoryUserDetailsManager</text>\n'
    s += '  <text class="an a1" x="536" y="194" font-size="12" fill="#454C61">lo configura Spring Boot por su cuenta</text>\n'
    s += '  <text class="ls a26" x="536" y="194" font-size="12" fill="#454C61">lo crea su método userDetailsService()</text>\n'
    s += '  <g class="an a1">' + box(536, 208, 344, 64, 'slate', 'user', sub='contraseña generada: 0be98d58-…').strip() + '</g>\n'
    s += ('  <g class="an a23"><rect x="536" y="208" width="344" height="64" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>'
          '<text x="708" y="240" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#79809A">sin usuarios</text></g>\n')
    s += '  <g class="ls a46">' + box(536, 208, 344, 64, 'green', 'miUsuario', sub='password 123456 · authorities read').strip() + '</g>\n'

    s += ('  <g class="an a1"><rect x="520" y="312" width="376" height="52" rx="10" fill="#1F2430"/>'
          '<text class="mono" x="534" y="333" font-size="11.5" fill="#E6EAF2">Using generated security password:</text>'
          f'<text class="mono" x="534" y="352" font-size="11.5" fill="{FAM["amber"][1]}">0be98d58-3edd-49c4-b73a-e0a3fdda1809</text></g>\n')
    s += '  <g class="an a2">' + box(520, 312, 376, 52, 'rose', 'El usuario por defecto ya no se crea', sub='Spring Boot cede ante su @Bean', mono=False).strip() + '</g>\n'
    s += '  <g class="an a34">' + box(520, 312, 376, 52, 'teal', 'UserDetails', sub='miUsuario · 123456 · read').strip() + '</g>\n'
    s += '  <g class="ls a56">' + box(520, 312, 376, 52, 'amber', 'NoOpPasswordEncoder', sub='compara la contraseña tal cual, sin cifrar').strip() + '</g>\n'

    s += '  <text class="h" x="520" y="398">QUIÉN PUEDE INICIAR SESIÓN</text>\n'
    s += '  ' + box(520, 408, 180, 52, 'slate', 'user', sub='la contraseña de la consola')
    s += '  ' + box(716, 408, 180, 52, 'slate', 'miUsuario', sub='contraseña 123456')
    for cls, x, color, text in (('an a1', 520, 'green', 'entra'), ('ls a26', 520, 'rose', 'ya no existe'), ('an a13', 716, 'rose', 'no existe'),
                                ('an a4', 716, 'amber', 'falta el PasswordEncoder'), ('ls a56', 716, 'green', 'entra')):
        s += f'  <g class="{cls}">' + box(x, 470, 180, 28, color, text, mono=False, fs=12).strip() + '</g>\n'

    rings = [('a1', 530, 202, 356, 76, slate), ('a1', 514, 402, 192, 64, green), ('aM', 514, 144, 388, 150, ind), ('a3', 514, 306, 388, 64, teal),
             ('a4', 530, 202, 356, 76, green), ('a5', 514, 306, 388, 64, amber), ('a6', 710, 402, 192, 64, green)]
    for cls, x, y, rw, rh, color in rings:
        s += f'  <rect class="an {cls}" x="{x}" y="{y}" width="{rw}" height="{rh}" rx="14" fill="none" stroke="{color}" stroke-width="3"/>\n'
    for cls, x, y, n, color in (('an a1', 880, 208, 1, 'slate'), ('', 896, 150, 2, 'indigo'), ('an a34', 896, 312, 3, 'teal'),
                                ('ls a46', 880, 208, 4, 'green'), ('ls a56', 896, 312, 5, 'amber'), ('', 896, 408, 6, 'green')):
        s += (f'  <g class="{cls}">' if cls else '  <g>') + chip(x, y, n, color).strip() + '</g>\n'
    for cls, cx, cy, color in (('tk2', 468, 218, ind), ('tk4', 708, 312, green), ('tk6', 806, 408, teal)):
        s += f'  <circle class="an {cls}" cx="{cx}" cy="{cy}" r="8" fill="{color}" stroke="#FFFFFF" stroke-width="2"/>\n'

    s += '  <rect x="48" y="552" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    caps = [(1, 'slate', 'Sin configuración, Spring Boot crea un usuario por defecto: user, con una contraseña que imprime en la consola.', 'Vive en memoria y la contraseña cambia cada vez que se reinicia la aplicación.'),
            (2, 'indigo', 'Al declarar un @Bean de tipo UserDetailsService, Spring Boot deja de crear ese usuario.', 'El InMemoryUserDetailsManager nuevo arranca vacío: es una lista de usuarios en memoria.'),
            (3, 'teal', 'User.withUsername(...) construye un UserDetails: nombre, contraseña y authorities.', 'Las authorities representan los roles o permisos del usuario.'),
            (4, 'green', 'createUser(user) lo agrega a la lista del manager.', 'El usuario ya existe, pero todavía no puede entrar: falta decir cómo se compara la contraseña.'),
            (5, 'amber', 'El segundo @Bean es el PasswordEncoder: NoOpPasswordEncoder compara la contraseña tal cual, sin cifrar.', 'Sirve para aprender; una aplicación real usa un encoder que sí la protege, como BCryptPasswordEncoder.'),
            (6, 'green', 'Al iniciar sesión, Spring Security le pide el usuario al manager y compara la contraseña con el encoder.', 'Ahora entra miUsuario con 123456; el usuario user ya no existe.')]
    for n, color, l1, l2 in caps:
        s += (f'  <g class="an a{n}">' + chip(76, 580, n, color).strip() +
              f'<text x="100" y="575" font-size="13" font-weight="600" fill="#161A26" data-fit="790">{l1}</text>'
              f'<text x="100" y="593" font-size="13" fill="#454C61" data-fit="790">{l2}</text></g>\n')
    s += ('  <g class="st"><text x="68" y="575" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Su @Bean de UserDetailsService reemplaza al usuario por defecto; el PasswordEncoder dice cómo comparar la contraseña.</text>'
          '<text x="68" y="593" font-size="13" fill="#454C61" data-fit="820">Los números marcan el orden de los seis pasos.</text></g>\n')
    return s + tail(h, 'Los usuarios en memoria se pierden al reiniciar: por eso el siguiente paso es cargarlos de la base de datos.')


FIGS['ssInMemory'] = ss_in_memory


def ss_autorizadas(freeze=None):
    """Animada: nueve pasos de 4 s. Del 1 al 3, un request sin sesión; del 4 al 9, el mismo request con sesión. Con freeze=1..9 sale el fotograma fijo."""
    fid, h, n_steps, secs = 'ssAutorizadas', 656, 9, 4
    s = head(fid, h, 'Un request, dos finales: sin sesión y con sesión', 'Un request, dos finales: sin sesión y con sesión',
             'Los filtros de seguridad deciden si el request llega a los beans o se devuelve al login.',
             'Animación en nueve pasos con los filtros de seguridad a la izquierda, las HTTP Sessions del servidor arriba a la derecha y, '
             'debajo, los beans del Application Context y la base de datos. Caso uno, sin sesión. Uno: llega GET /courses sin cookie. '
             'Dos: el SecurityContextHolder queda vacío y AuthorizationFilter lo consulta. Tres: AuthorizationFilter corta el request y '
             'responde 302 a /login; los beans y la base de datos no se tocan. Caso dos, con sesión. Cuatro: el mismo GET lleva la cookie '
             'JSESSIONID. Cinco: SecurityContextPersistenceFilter busca la sesión y carga su SecurityContext en el '
             'SecurityContextHolder. Seis: AuthorizationFilter verifica el acceso y deja pasar el request al controller. Siete: '
             'controller, service y repository consultan la base de datos. Ocho: los datos vuelven al controller. Nueve: la respuesta '
             'atraviesa los filtros y llega al navegador con 200 OK.',
             colors=('teal', 'green'))
    teal, green, amber, ind, rose = (FAM[c][2] for c in ('teal', 'green', 'amber', 'indigo', 'rose'))
    spans = {f'a{k}': [(k, k)] for k in range(1, n_steps + 1)}
    spans.update({'a13': [(1, 3)], 'a14': [(1, 4)], 'a49': [(4, 9)], 'a59': [(5, 9)], 'a23': [(2, 3)], 'a56': [(5, 6)],
                  'aN': [(1, 1), (4, 4)], 'aS': [(1, 1), (4, 5)], 'aC': [(6, 6), (8, 8)]})
    on = {1: ['a1', 'a13', 'a14', 'aN', 'aS'], 2: ['a2', 'a13', 'a14', 'a23'], 3: ['a3', 'a13', 'a14', 'a23'],
          4: ['a4', 'a14', 'a49', 'aN', 'aS'], 5: ['a5', 'a49', 'a59', 'aS', 'a56'], 6: ['a6', 'a49', 'a59', 'a56', 'aC'],
          7: ['a7', 'a49', 'a59'], 8: ['a8', 'a49', 'a59', 'aC'], 9: ['a9', 'a49', 'a59']}
    down, up = (0, 20), (0, -20)
    hops = [(1, 72, 178, down, teal, 'GET /courses · sin cookie'),
            (2, 72, 258, down, teal, 'request sin usuario'),
            (3, 88, 298, up, rose, '302 · Location: /login'), (3, 88, 218, up, rose, '302 · Location: /login'),
            (4, 72, 178, down, teal, 'GET /courses · JSESSIONID=ABC123…'),
            (5, 354, 228, (34, 0), teal, 'JSESSIONID=ABC123XYZ456'), (5, 392, 248, (-34, 0), green, 'SecurityContext de ana'),
            (6, 72, 258, down, teal, 'request de ana'), (6, 352, 283, (46, 0), teal, 'GET /courses'),
            (7, 412, 338, down, teal, 'findAll()'), (7, 412, 418, down, teal, 'findAll()'), (7, 616, 470, (34, 0), teal, 'SELECT'),
            (8, 676, 482, (-48, 0), green, 'filas'), (8, 428, 458, up, green, 'List<Course>'), (8, 428, 378, up, green, 'List<Course>'),
            (9, 398, 283, (-46, 0), green, 'vista courses (HTML)'), (9, 88, 298, up, green, '200 OK · HTML'), (9, 88, 218, up, green, '200 OK · HTML')]
    s = s.replace('    </style>', anim_css(fid, n_steps, secs, spans, hop_tokens(hops), freeze, on) + '    </style>', 1)
    s = s.replace(f'<svg id="{fid}"', f'<svg id="{fid}" data-steps="{n_steps}" data-step-seconds="{secs}"', 1)

    s += '  <g class="an a13">' + box(712, 36, 200, 28, 'rose', 'CASO 1 · SIN SESIÓN', mono=False, fs=12).strip() + '</g>\n'
    s += '  <g class="ls a49">' + box(712, 36, 200, 28, 'green', 'CASO 2 · CON SESIÓN', mono=False, fs=12).strip() + '</g>\n'

    panels = [(48, 104, 316, 420, 'FILTROS DE SEGURIDAD', 128), (388, 104, 524, 166, 'HTTP SESSIONS · EN EL SERVIDOR', 128),
              (388, 284, 304, 240, 'APPLICATION CONTEXT · BEANS', 515), (708, 284, 204, 240, 'BASE DE DATOS', 308)]
    for x, y, pw, ph, label, ty in panels:
        s += f'  <rect x="{x}" y="{y}" width="{pw}" height="{ph}" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
        s += f'  <text class="h" x="{x+16}" y="{ty}" data-fit="{pw-32}">{label}</text>\n'

    def pair(x, top):
        return f'  <path class="ar-teal" d="M{x},{top+2} V{top+42}"/><path class="ar-green" d="M{x+16},{top+42} V{top+2}"/>\n'

    s += '  <rect x="64" y="140" width="284" height="36" rx="10" fill="#EFF1F5" stroke="#C4CBD8" stroke-width="1.5"/>\n'
    for cls, text in (('an a13', 'Navegador · sin cookie'), ('ls a49', 'Navegador · JSESSIONID=ABC123…')):
        s += f'  <text class="{cls}" x="206" y="158" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="#556074">{text}</text>\n'
    s += '  ' + box(64, 220, 284, 36, 'indigo', 'SecurityContextPersistenceFilter', fs=11.5)
    s += '  ' + box(64, 300, 284, 36, 'indigo', 'AuthorizationFilter', hero=True)
    s += pair(72, 176) + pair(72, 256)
    s += '  <path d="M206,338 V390" stroke="#556074" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>\n'
    s += '  <text x="216" y="368" font-size="12" font-weight="600" fill="#556074">consulta</text>\n'
    soft, border, _ = FAM['indigo']
    s += f'  <rect x="64" y="392" width="284" height="88" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
    s += f'  <text class="mono" x="76" y="413" font-size="12.5" font-weight="700" fill="{ind}">SecurityContextHolder</text>\n'
    s += ('  <g class="an a14"><rect x="76" y="424" width="260" height="44" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>'
          '<text x="206" y="446" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#79809A">vacío: nadie autenticado</text></g>\n')
    s += '  <g class="ls a59">' + box(76, 424, 260, 44, 'green', 'ana@icesi.edu.co', sub='authorities: read', fs=12.5).strip() + '</g>\n'

    s += '  ' + box(404, 146, 240, 52, 'slate', 'ABC123XYZ456', sub='SecurityContext de ana')
    s += '  ' + box(656, 146, 240, 52, 'slate', 'QRS789LMN012', sub='SecurityContext de luis')
    s += '  <path class="ar-teal" d="M350,228 H386"/><path class="ar-green" d="M386,248 H350"/>\n'

    s += '  ' + box(404, 300, 200, 36, 'amber', 'CoursesController', fs=12.5)
    s += '  ' + box(404, 380, 200, 36, 'amber', 'CourseService', fs=12.5)
    s += '  ' + box(404, 460, 200, 36, 'amber', 'CourseRepository', fs=12.5)
    s += '  <path class="ar-teal" d="M350,311 H402"/><path class="ar-green" d="M402,325 H350"/>\n'
    s += pair(412, 336) + pair(412, 416)
    s += '  <text class="h" x="720" y="428">TABLA COURSES</text>\n'
    s += '  <rect x="720" y="438" width="180" height="72" rx="8" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>\n'
    s += '  <path d="M720,462 H900 V446 A8,8 0 0 0 892,438 H728 A8,8 0 0 0 720,446 Z" fill="#EFF1F5"/>\n'
    s += '  <path d="M720,462 H900 M720,486 H900 M760,438 V510" stroke="#D9DEE8" stroke-width="1.25" fill="none"/>\n'
    for i, (cid, name) in enumerate((('id', 'name'), ('1', 'Computación II'), ('2', 'Apps Móviles'))):
        weight, fill = ('700', '#556074') if i == 0 else ('400', '#161A26')
        s += (f'  <text class="mono" x="730" y="{450 + i*24}" dy="0.35em" font-size="10.5" font-weight="{weight}" fill="{fill}">{cid}</text>'
              f'<text class="mono" x="770" y="{450 + i*24}" dy="0.35em" font-size="10.5" font-weight="{weight}" fill="{fill}">{name}</text>\n')
    s += '  <path class="ar-teal" d="M606,470 H718"/><path class="ar-green" d="M718,482 H606"/>\n'
    s += ('  <g class="an a13"><rect x="389" y="285" width="302" height="238" rx="11" fill="#FBFBFD" fill-opacity=".82"/>'
          '<rect x="709" y="285" width="202" height="238" rx="11" fill="#FBFBFD" fill-opacity=".82"/>'
          f'<text x="540" y="358" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="{rose}">El request no llega hasta aquí</text>'
          f'<text x="810" y="358" dy="0.35em" text-anchor="middle" font-size="13.5" font-weight="700" fill="{rose}">No se consulta</text></g>\n')

    rings = [('aN', 60, 136, 292, 44, teal), ('a3', 60, 136, 292, 44, rose), ('a9', 60, 136, 292, 44, green), ('aS', 60, 216, 292, 44, ind),
             ('a23', 60, 296, 292, 44, rose), ('a6', 60, 296, 292, 44, ind), ('a2', 60, 388, 292, 96, rose), ('a56', 60, 388, 292, 96, green),
             ('a5', 400, 142, 248, 60, green), ('aC', 400, 296, 208, 44, amber), ('a7', 400, 376, 208, 44, amber), ('a7', 400, 456, 208, 44, amber)]
    for cls, x, y, rw, rh, color in rings:
        s += f'  <rect class="an {cls}" x="{x}" y="{y}" width="{rw}" height="{rh}" rx="12" fill="none" stroke="{color}" stroke-width="3"/>\n'
    s += f'  <rect class="an a7" x="720" y="462" width="180" height="48" fill="{teal}" fill-opacity=".12" stroke="{teal}" stroke-width="2"/>\n'
    s += hop_pills(hops)

    s += '  <rect x="48" y="540" width="864" height="56" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    caps = [(1, 'teal', 'Caso 1 · Llega GET /courses sin la cookie JSESSIONID.', 'SecurityContextPersistenceFilter no tiene con qué buscar una sesión.'),
            (2, 'rose', 'El SecurityContextHolder queda vacío: para Spring Security, este request no es de nadie.', 'AuthorizationFilter lo consulta para decidir si la ruta se puede atender.'),
            (3, 'rose', 'Como /courses exige un usuario autenticado, AuthorizationFilter corta el request.', 'El navegador recibe una redirección a /login; ni los beans ni la base de datos se enteran.'),
            (4, 'teal', 'Caso 2 · Después del login, el mismo GET /courses lleva la cookie JSESSIONID.', 'El navegador la envía automáticamente en cada request.'),
            (5, 'green', 'SecurityContextPersistenceFilter busca esa sesión entre las HTTP Sessions y recupera su SecurityContext.', 'Lo carga en el SecurityContextHolder: mientras dure este request, el usuario es ana.'),
            (6, 'indigo', 'AuthorizationFilter verifica que ana puede acceder a /courses y deja pasar el request.', 'Solo ahora llega al controller.'),
            (7, 'amber', 'El controller usa el service, y este el repository, que consulta la base de datos.', 'Son los beans del Application Context, como en cualquier request.'),
            (8, 'green', 'Los datos vuelven por el mismo camino hasta el controller.', 'Con ellos arma la vista.'),
            (9, 'green', 'La respuesta atraviesa los filtros de regreso y llega al navegador.', 'Al terminar se limpia el SecurityContextHolder: el siguiente request vuelve a empezar por la cookie.')]
    for n, color, l1, l2 in caps:
        s += (f'  <g class="an a{n}">' + chip(76, 568, n, color).strip() +
              f'<text x="100" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="790">{l1}</text>'
              f'<text x="100" y="581" font-size="13" fill="#454C61" data-fit="790">{l2}</text></g>\n')
    s += ('  <g class="st"><text x="68" y="563" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Sin sesión, el request muere en los filtros; con sesión, llega a los beans y a la base de datos.</text>'
          '<text x="68" y="581" font-size="13" fill="#454C61" data-fit="820">La animación recorre los dos casos.</text></g>\n')
    return s + tail(h, 'El SecurityContext vive en la sesión HTTP; el SecurityContextHolder solo lo sostiene mientras dura el request.')


FIGS['ssAutorizadas'] = ss_autorizadas


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--inject':
        done = set()
        for name in LESSONS:
            path = ROOT / 'content' / name
            text = path.read_text(encoding='utf-8')

            def swap(m):
                done.add(m.group(1))
                return '```svg\n' + FIGS[m.group(1)]() + '```'
            new = re.sub(r'```svg\n<svg id="(\w+)".*?```', swap, text, flags=re.S)
            path.write_text(new, encoding='utf-8')
        missing = set(FIGS) - done
        print('inyectadas:', len(done), '· sin usar:', sorted(missing) or 'ninguna')
        return
    out = pathlib.Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    for fid, fn in FIGS.items():
        (out / f'{fid}.svg').write_text(fn(), encoding='utf-8')
        if len(sys.argv) > 2 and sys.argv[2] == '--frames':
            steps = int(re.search(r'data-steps="(\d+)"', fn()).group(1))
            for k in range(1, steps + 1):
                (out / f'{fid}-{k}.svg').write_text(fn(freeze=k), encoding='utf-8')
    print(len(FIGS), 'figuras en', out)


if __name__ == '__main__':
    main()
