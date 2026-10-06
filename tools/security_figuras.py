"""Figuras SVG de la lección «Spring Security» (0032).

    python3 tools/security_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/security_figuras.py --inject      reemplaza cada bloque ```svg de content/lesson23.md
                                                    por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Colores por rol: solicitud teal, redirección rosa, Spring Security índigo, verificación ámbar,
sesión y cookie verde, controller violeta.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lesson23.md']
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
