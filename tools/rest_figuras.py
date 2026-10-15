"""Figuras SVG de la Semana 11 · Rest: ¿Qué es REST? (0036), REST en movimiento (0092), RestControllers (0037), Parámetros HTTP (0038),
MapStruct (0040) y Lombok (0041).

    python3 tools/rest_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/rest_figuras.py --inject      reemplaza cada bloque ```svg de esas lecciones
                                                por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Usa los mismos tokens que tools/security_figuras.py. Colores por verbo: GET verde, POST ámbar,
PUT y PATCH violeta, DELETE rosa. Por parámetro: @PathVariable verde, @RequestParam teal,
@RequestBody violeta.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from security_figuras import FAM, anim_css, box, chip, head, hop_pills, hop_tokens, rows, tail  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lesson27.md', 'lesson270.md', 'lesson271.md', 'lesson272.md', 'lesson28.md', 'lesson281.md']
VERB = {'GET': 'green', 'POST': 'amber', 'PUT': 'violet', 'PATCH': 'violet', 'DELETE': 'rose'}
FIGS = {}


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def panel(x, y, w, h, label=None):
    s = f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="#FFFFFF" stroke="#D9DEE8" stroke-width="1.5"/>\n'
    if label:
        s += f'  <text class="h" x="{x+16}" y="{y+24}" data-fit="{w-32}">{label}</text>\n'
    return s


def pane_bg(x, y, w, h):
    return (f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#1F2430"/>\n'
            f'  <path d="M{x},{y+10} A10,10 0 0 1 {x+10},{y} H{x+w-10} A10,10 0 0 1 {x+w},{y+10} V{y+26} H{x} Z" fill="#2A3040"/>\n')


def pane_text(x, y, tab, lines, marks=(), fs=11.5, lh=19, cls=None, w=None, tab_fill='#9AA3B5', top=48):
    """Pestaña y líneas de un panel oscuro. marks: (línea, col, largo, color); col None resalta la línea entera."""
    cw = fs * 0.6
    s = f'<g class="{cls}">' if cls else ''
    s += f'<text class="mono" x="{x+12}" y="{y+13}" dy="0.35em" font-size="11.5" fill="{tab_fill}">{esc(tab)}</text>'
    for line, col, n, color in marks:
        yb = y + top + line * lh
        if col is None:
            rx, rw = x + 4, w - 8
        else:
            rx, rw = x + 12 + col * cw - 3, n * cw + 6
        s += (f'<rect x="{rx:.1f}" y="{yb - round(lh * .74)}" width="{rw:.1f}" height="{lh + 2}" rx="5" fill="{color}" '
              f'fill-opacity=".3" stroke="{color}" stroke-width="1.5"/>')
    for i, line in enumerate(lines):
        text = line.strip()
        if not text:
            continue
        indent = len(line) - len(line.lstrip())
        fill = '#8C95AA' if text.startswith('(') else '#E6EAF2'
        s += (f'<text class="mono" x="{x + 12 + indent * cw:.1f}" y="{y + top + i * lh}" font-size="{fs}" fill="{fill}" '
              f'textLength="{len(text) * cw:.1f}" lengthAdjust="spacingAndGlyphs">{esc(text)}</text>')
    return '  ' + s + ('</g>' if cls else '') + '\n'


def pane(x, y, w, h, tab, lines, marks=(), **kw):
    return pane_bg(x, y, w, h) + pane_text(x, y, tab, lines, marks, w=w, **kw)


def badge(x, y, verb, w=72):
    strong = FAM[VERB[verb]][2]
    return (f'<rect x="{x}" y="{y}" width="{w}" height="24" rx="6" fill="{strong}"/>'
            f'<text class="mono" x="{x + w/2}" y="{y+12}" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" '
            f'fill="#FFFFFF">{verb}</text>')


def pill(cx, cy, text, color, fs=11):
    soft, border, strong = FAM[color]
    w = len(text) * fs * .6 + 16
    return (f'<rect x="{cx - w/2:.1f}" y="{cy-10}" width="{w:.1f}" height="20" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
            f'<text class="mono" x="{cx}" y="{cy}" dy="0.35em" text-anchor="middle" font-size="{fs}" font-weight="700" '
            f'fill="{strong}">{esc(text)}</text>')


def rest_ciclo(freeze=None):
    """Animada: cuatro pasos de 4 s. Un GET que lee un usuario y un DELETE que lo borra sobre la misma URL."""
    fid, h, n_steps, secs = 'restCiclo', 572, 4, 4
    s = head(fid, h, 'Un request REST, de ida y vuelta', 'Un request REST, de ida y vuelta',
             'La URL nombra el recurso, el verbo HTTP dice qué hacer con él y la respuesta trae su representación en JSON.',
             'Animación en cuatro pasos con el cliente a la izquierda, los mensajes HTTP en el centro y el servidor REST a la '
             'derecha. Uno: el cliente envía GET /usuarios/7. Dos: el servidor ubica el recurso usuarios con id 7 y ejecuta la '
             'lectura sin consultar ninguna sesión. Tres: responde 200 OK con el usuario en JSON y el cliente lo muestra. '
             'Cuatro: sobre la misma URL, el cliente envía DELETE /usuarios/7 y el servidor responde 204 No Content.',
             colors=('teal', 'green'))
    teal, green, ind, rose = (FAM[c][2] for c in ('teal', 'green', 'indigo', 'rose'))
    spans = {f'a{k}': [(k, k)] for k in range(1, n_steps + 1)}
    spans['a12'] = [(1, 2)]
    on = {1: ['a1', 'a12'], 2: ['a2', 'a12'], 3: ['a3'], 4: ['a4']}
    hops = [(1, 316, 132, (200, 0), teal, 'GET /usuarios/7'), (3, 520, 156, (-196, 0), green, '200 OK · JSON'),
            (4, 316, 132, (200, 0), rose, 'DELETE /usuarios/7'), (4, 520, 156, (-196, 0), green, '204 No Content')]
    s = s.replace('    </style>', anim_css(fid, n_steps, secs, spans, hop_tokens(hops), freeze, on) + '    </style>', 1)
    s = s.replace(f'<svg id="{fid}"', f'<svg id="{fid}" data-steps="{n_steps}" data-step-seconds="{secs}"', 1)

    s += '  ' + box(48, 112, 248, 64, 'teal', 'Cliente', sub='navegador · app móvil · Postman', mono=False, fs=15)
    s += '  ' + box(664, 112, 248, 64, 'indigo', 'Servidor REST', sub='Spring Boot · @RestController', mono=False, fs=15, hero=True)
    s += '  <path class="ar-teal" d="M304,132 H654"/><path class="ar-green" d="M656,156 H306"/>\n'
    s += '  <text class="h" x="480" y="116" text-anchor="middle">REQUEST →</text>\n'
    s += '  <text class="h" x="480" y="180" text-anchor="middle">← RESPONSE</text>\n'

    s += panel(48, 192, 248, 260, 'LO QUE VE EL CLIENTE')
    s += '  <g class="an a12">' + ''.join(
        f'<rect x="64" y="{240 + i*26}" width="{bw}" height="10" rx="5" fill="#E3E7EE"/>' for i, bw in enumerate((180, 216, 150, 200)))
    s += '<text x="172" y="372" text-anchor="middle" font-size="12.5" font-weight="600" fill="#79809A">esperando la respuesta…</text></g>\n'
    soft, border, _ = FAM['teal']
    s += (f'  <g class="ls a3"><rect x="64" y="236" width="216" height="104" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>'
          f'<circle cx="104" cy="276" r="22" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
          f'<text x="104" y="276" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="{teal}">AG</text>'
          '<text x="136" y="270" font-size="14" font-weight="700" fill="#161A26">Ana Gómez</text>'
          '<text class="mono" x="136" y="290" font-size="11.5" fill="#454C61">ana@icesi.edu</text>'
          '<text x="80" y="326" font-size="12" fill="#79809A" data-fit="184">El cliente decide cómo pintarlo</text></g>\n')
    s += '  <g class="an a4">' + box(64, 236, 216, 64, 'rose', 'Usuario 7 eliminado', sub='la respuesta no trae body', mono=False).strip() + '</g>\n'

    s += pane_bg(312, 192, 336, 260)
    s += pane_text(312, 192, 'request', ['GET /usuarios/7 HTTP/1.1', 'Host: api.icesi.edu', 'Accept: application/json', '',
                                         '(sin body: GET solo lee)'], cls='an a12', w=336)
    s += pane_text(312, 192, '', [], marks=[(0, 0, 3, FAM['green'][1]), (0, 4, 11, FAM['indigo'][1])], cls='an a2', w=336)
    s += pane_text(312, 192, 'response', ['HTTP/1.1 200 OK', 'Content-Type: application/json', '', '{', '  "id": 7,',
                                          '  "nombre": "Ana Gómez",', '  "email": "ana@icesi.edu"', '}'],
                   marks=[(0, None, 0, FAM['green'][1])], cls='ls a3', w=336)
    s += pane_text(312, 192, 'request · response', ['DELETE /usuarios/7 HTTP/1.1', '', '', 'HTTP/1.1 204 No Content', '',
                                                    '(sin body: no hay nada que mostrar)'],
                   marks=[(0, 0, 6, FAM['rose'][1]), (3, None, 0, FAM['green'][1])], cls='an a4', w=336)

    s += panel(664, 192, 248, 260, 'RECURSOS DEL SERVIDOR')
    s += '  ' + rows(680, 232, 216, ['/usuarios', '/cursos', '/productos'], color='violet', gap=40).strip().replace(
        'font-size="13" fill="#161A26"', 'class="mono" font-size="13" fill="#161A26"') + '\n'
    s += f'  <text class="mono an a2" x="884" y="247" dy="0.35em" text-anchor="end" font-size="11.5" font-weight="700" fill="{ind}">findById(7)</text>\n'
    s += f'  <text class="mono an a4" x="884" y="247" dy="0.35em" text-anchor="end" font-size="11.5" font-weight="700" fill="{rose}">deleteById(7)</text>\n'
    s += '  ' + box(680, 364, 216, 64, 'slate', 'Stateless', sub='no recuerda requests anteriores', mono=False)

    for cls, x, y, rw, rh, color in (('a1', 42, 106, 260, 76, teal), ('a2', 658, 106, 260, 76, ind), ('a2', 674, 226, 228, 42, ind),
                                     ('a3', 58, 230, 228, 116, green), ('a4', 674, 226, 228, 42, rose)):
        s += f'  <rect class="an {cls}" x="{x}" y="{y}" width="{rw}" height="{rh}" rx="12" fill="none" stroke="{color}" stroke-width="3"/>\n'
    s += hop_pills(hops)

    s += panel(48, 468, 864, 56)
    caps = [(1, 'teal', 'El cliente pide un recurso: GET /usuarios/7.', 'La URL dice cuál recurso; el verbo GET dice qué hacer con él: leerlo.'),
            (2, 'indigo', 'El servidor ubica el recurso usuarios con id 7 y ejecuta la lectura.', 'No consulta ninguna sesión: todo lo que necesita viene en ese mismo request.'),
            (3, 'green', 'Responde 200 OK con la representación del recurso en JSON.', 'El cliente recibe datos, no una página HTML: él decide cómo mostrarlos.'),
            (4, 'rose', 'Mismo recurso, otro verbo: DELETE /usuarios/7 lo elimina.', '204 No Content confirma sin body. La URL no cambió; cambió el verbo.')]
    for n, color, l1, l2 in caps:
        s += (f'  <g class="an a{n}">' + chip(76, 496, n, color).strip() +
              f'<text x="100" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="790">{l1}</text>'
              f'<text x="100" y="509" font-size="13" fill="#454C61" data-fit="790">{l2}</text></g>\n')
    s += ('  <g class="st"><text x="68" y="491" font-size="13" font-weight="600" fill="#161A26" data-fit="820">Una URL por recurso; el verbo HTTP dice la acción y la respuesta trae JSON.</text>'
          '<text x="68" y="509" font-size="13" fill="#454C61" data-fit="820">La animación recorre una lectura y un borrado.</text></g>\n')
    return s + tail(h, 'Cada request es autocontenido: el servidor no guarda estado entre una petición y la siguiente.')


FIGS['restCiclo'] = rest_ciclo


def anim_head(fid, h, n_steps, secs, spans, on, hops, freeze, *args, **kw):
    s = head(fid, h, *args, **kw)
    s = s.replace('    </style>', anim_css(fid, n_steps, secs, spans, hop_tokens(hops), freeze, on) + '    </style>', 1)
    return s.replace(f'<svg id="{fid}"', f'<svg id="{fid}" data-steps="{n_steps}" data-step-seconds="{secs}"', 1)


def captions(y, caps, still):
    s = panel(48, y, 864, 56)
    for n, color, l1, l2 in caps:
        s += (f'  <g class="an a{n}">' + chip(76, y + 28, n, color).strip() +
              f'<text x="100" y="{y+23}" font-size="13" font-weight="600" fill="#161A26" data-fit="790">{l1}</text>'
              f'<text x="100" y="{y+41}" font-size="13" fill="#454C61" data-fit="790">{l2}</text></g>\n')
    return s + (f'  <g class="st"><text x="68" y="{y+23}" font-size="13" font-weight="600" fill="#161A26" data-fit="820">{still[0]}</text>'
                f'<text x="68" y="{y+41}" font-size="13" fill="#454C61" data-fit="820">{still[1]}</text></g>\n')


def ring(cls, x, y, w, h, color):
    return f'  <rect class="{cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="none" stroke="{FAM[color][2]}" stroke-width="3"/>\n'


def badge_case(cls, color, text):
    return f'  <g class="{cls}">' + box(692, 36, 220, 28, color, text, mono=False, fs=12).strip() + '</g>\n'


def rest_representacion(freeze=None):
    """Animada: cuatro pasos de 4 s. GET de una copia, cambio local de la copia y PUT que transfiere la representación."""
    fid, h, n, secs = 'restRepresentacion', 572, 4, 4
    teal, green, violet = (FAM[c][2] for c in ('teal', 'green', 'violet'))
    spans = {f'a{k}': [(k, k)] for k in range(1, n + 1)}
    spans.update({'a234': [(2, 4)], 'a34': [(3, 4)], 'a123': [(1, 3)]})
    on = {1: ['a1', 'a123'], 2: ['a2', 'a234', 'a123'], 3: ['a3', 'a234', 'a34', 'a123'], 4: ['a4', 'a234', 'a34']}
    hops = [(1, 316, 132, (200, 0), teal, 'GET /usuarios/7'), (2, 520, 156, (-196, 0), green, '200 OK · JSON'),
            (4, 316, 132, (200, 0), violet, 'PUT /usuarios/7'), (4, 520, 156, (-196, 0), green, '200 OK')]
    s = anim_head(fid, h, n, secs, spans, on, hops, freeze,
                  'Lo que viaja es una representación', 'Lo que viaja es una representación',
                  'Representational State Transfer: el recurso se queda en el servidor; por la red va una copia de su estado.',
                  'Animación en cuatro pasos. Uno: el cliente pide GET /usuarios/7; el recurso es una fila de la tabla usuarios '
                  'en el servidor. Dos: el servidor responde 200 con una copia de la fila en JSON. Tres: el cliente cambia el '
                  'email en su copia y el recurso del servidor sigue igual. Cuatro: el cliente envía su representación con '
                  'PUT /usuarios/7 y el servidor actualiza la fila.', colors=('teal', 'green'))
    s += '  ' + box(48, 112, 248, 64, 'teal', 'Cliente', sub='navegador · app móvil · Postman', mono=False, fs=15)
    s += '  ' + box(664, 112, 248, 64, 'indigo', 'Servidor REST', sub='Spring Boot · base de datos', mono=False, fs=15, hero=True)
    s += '  <path class="ar-teal" d="M304,132 H654"/><path class="ar-green" d="M656,156 H306"/>\n'
    s += '  <text class="h" x="480" y="116" text-anchor="middle">REQUEST →</text>\n'
    s += '  <text class="h" x="480" y="180" text-anchor="middle">← RESPONSE</text>\n'

    s += panel(48, 192, 248, 260, 'LA COPIA DEL CLIENTE')
    s += ('  <g class="an a1"><rect x="64" y="232" width="216" height="124" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>'
          '<text x="172" y="294" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#79809A">todavía no tiene nada</text></g>\n')
    s += '  <g class="ls a234"><rect x="64" y="232" width="216" height="124" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5"/>'
    for i, line in enumerate(['{', '  "id": 7,', '  "nombre": "Ana Gómez",']):
        s += f'<text class="mono" x="{76 + (len(line) - len(line.lstrip())) * 6.9:.1f}" y="{258 + i*20}" font-size="11.5" fill="#161A26">{esc(line.strip())}</text>'
    s += '<text class="mono" x="76" y="338" font-size="11.5" fill="#161A26">}</text></g>\n'
    s += '  <text class="mono an a2" x="89.8" y="318" font-size="11.5" fill="#161A26">"email": "ana@icesi.edu"</text>\n'
    asoft, aborder, astrong = FAM['amber']
    s += (f'  <g class="ls a34"><rect x="84" y="304" width="190" height="20" rx="5" fill="{asoft}" stroke="{aborder}" stroke-width="1.5"/>'
          f'<text class="mono" x="89.8" y="318" font-size="11.5" fill="#161A26" textLength="179.4" lengthAdjust="spacingAndGlyphs">"email": "ana.g@icesi.edu"</text></g>\n')
    s += f'  <text class="an a3" x="172" y="384" text-anchor="middle" font-size="12.5" font-weight="700" fill="{astrong}">editada solo aquí</text>\n'
    s += f'  <text class="ls a4" x="172" y="384" text-anchor="middle" font-size="12.5" font-weight="700" fill="{violet}">enviada de vuelta con PUT</text>\n'

    s += pane_bg(312, 192, 336, 260)
    s += pane_text(312, 192, 'request', ['GET /usuarios/7 HTTP/1.1', 'Accept: application/json'], cls='an a1', w=336)
    s += pane_text(312, 192, 'response', ['HTTP/1.1 200 OK', 'Content-Type: application/json', '', '{"id": 7,',
                                          ' "nombre": "Ana Gómez",', ' "email": "ana@icesi.edu"}'],
                   marks=[(0, None, 0, FAM['green'][1])], cls='an a2', w=336)
    s += pane_text(312, 192, '', ['(no viaja nada: el cambio es local)'], cls='an a3', w=336)
    s += pane_text(312, 192, 'request · response', ['PUT /usuarios/7 HTTP/1.1', 'Content-Type: application/json', '', '{"id": 7,',
                                                    ' "nombre": "Ana Gómez",', ' "email": "ana.g@icesi.edu"}', '', 'HTTP/1.1 200 OK'],
                   marks=[(0, 0, 3, FAM['violet'][1]), (5, None, 0, aborder), (7, None, 0, FAM['green'][1])], cls='ls a4', w=336)

    s += panel(664, 192, 248, 260, 'EL RECURSO · TABLA usuarios')
    ssoft, sborder, _ = FAM['slate']
    for i, (k, v) in enumerate((('id', '7'), ('nombre', 'Ana Gómez'), ('email', None))):
        y = 232 + i * 40
        s += (f'  <rect x="680" y="{y}" width="216" height="32" rx="7" fill="{ssoft}" stroke="{sborder}" stroke-width="1.25"/>'
              f'<text x="692" y="{y+16}" dy="0.35em" font-size="11.5" font-weight="600" fill="#79809A">{k}</text>')
        if v:
            s += f'<text class="mono" x="752" y="{y+16}" dy="0.35em" font-size="12" fill="#161A26">{v}</text>'
        s += '\n'
    s += '  <text class="mono an a123" x="752" y="328" dy="0.35em" font-size="12" fill="#161A26">ana@icesi.edu</text>\n'
    s += (f'  <g class="ls a4"><rect x="746" y="318" width="144" height="20" rx="5" fill="{asoft}" stroke="{aborder}" stroke-width="1.5"/>'
          '<text class="mono" x="752" y="328" dy="0.35em" font-size="12" fill="#161A26">ana.g@icesi.edu</text></g>\n')
    s += '  <g class="an a2">' + box(680, 368, 216, 64, 'indigo', 'Serializa la fila', sub='a JSON para enviarla', mono=False).strip() + '</g>\n'
    s += '  <g class="an a3">' + box(680, 368, 216, 64, 'slate', 'Sin cambios', sub='el servidor no se enteró', mono=False).strip() + '</g>\n'
    s += '  <g class="ls a4">' + box(680, 368, 216, 64, 'green', 'Fila actualizada', sub='por el PUT, no por la copia', mono=False).strip() + '</g>\n'

    s += ring('an a1', 674, 226, 228, 124, 'teal')
    s += ring('an a2', 58, 226, 228, 136, 'green')
    s += ring('an a3', 58, 226, 228, 136, 'amber')
    s += ring('an a4', 674, 226, 228, 124, 'violet')
    s += hop_pills(hops)
    s += captions(468, [
        (1, 'teal', 'El cliente pide el recurso: GET /usuarios/7.', 'El recurso vive en el servidor, como una fila de la tabla usuarios.'),
        (2, 'green', 'El servidor responde con una representación: una copia de la fila en JSON.', 'Eso es lo que viaja. El recurso se queda donde estaba.'),
        (3, 'amber', 'El cliente cambia el email en su copia.', 'En el servidor nada cambió: la copia y el recurso ya no coinciden.'),
        (4, 'violet', 'Para cambiar el recurso, el cliente transfiere su representación con PUT.', 'El servidor la aplica a la fila: se transfiere el estado como representación.')],
        ('Representational State Transfer: lo que viaja es una representación del estado del recurso.',
         'La animación recorre una lectura, un cambio local y un PUT.'))
    return s + tail(h, 'La misma fila podría representarse en XML o en HTML; JSON es solo la representación más común.')


FIGS['restRepresentacion'] = rest_representacion


def rest_idempotencia(freeze=None):
    """Animada: siete pasos de 4 s. El mismo POST, PUT y DELETE enviados varias veces, contra el estado de la tabla."""
    fid, h, n, secs = 'restIdempotencia', 592, 7, 4
    spans = {f'a{k}': [(k, k)] for k in range(1, n + 1)}
    spans.update({'a13': [(1, 3)], 'a23': [(2, 3)], 'a15': [(1, 5)], 'a45': [(4, 5)], 'a67': [(6, 7)],
                  'a1246': [(1, 2), (4, 4), (6, 6)]})
    on = {1: ['a1', 'a13', 'a15', 'a1246'], 2: ['a2', 'a13', 'a23', 'a15', 'a1246'], 3: ['a3', 'a13', 'a23', 'a15'],
          4: ['a4', 'a45', 'a15', 'a1246'], 5: ['a5', 'a45', 'a15'], 6: ['a6', 'a67', 'a1246'], 7: ['a7', 'a67']}
    s = anim_head(fid, h, n, secs, spans, on, [], freeze,
                  'Idempotencia: repetir sin cambiar el resultado', 'Idempotencia: repetir sin cambiar el resultado',
                  'Un request es idempotente si enviarlo una vez o tres deja el servidor en el mismo estado.',
                  'Animación en siete pasos con el request a la izquierda y la tabla usuarios a la derecha. Caso POST: tres envíos '
                  'del mismo POST /usuarios crean tres usuarios Juan, 8, 9 y 10; no es idempotente. Caso PUT: PUT /usuarios/7 '
                  'cambia el email una vez y los envíos siguientes dejan la fila igual; es idempotente. Caso DELETE: el primer '
                  'DELETE /usuarios/7 borra la fila con 204 y el segundo responde 404, pero el estado no cambia; es idempotente.')
    s += badge_case('an a13', 'amber', 'CASO 1 · POST')
    s += badge_case('an a45', 'violet', 'CASO 2 · PUT')
    s += badge_case('ls a67', 'rose', 'CASO 3 · DELETE')

    s += panel(48, 104, 360, 360, 'EL MISMO REQUEST, OTRA VEZ')
    s += pane_bg(64, 136, 328, 148)
    s += pane_text(64, 136, 'request', ['POST /usuarios', 'Content-Type: application/json', '', '{"nombre": "Juan",',
                                        ' "email": "juan@icesi.edu"}'], marks=[(0, 0, 4, FAM['amber'][1])], cls='an a13', w=328)
    s += pane_text(64, 136, 'request', ['PUT /usuarios/7', 'Content-Type: application/json', '', '{"nombre": "Ana Gómez",',
                                        ' "email": "ana.g@icesi.edu"}'], marks=[(0, 0, 3, FAM['violet'][1])], cls='an a45', w=328)
    s += pane_text(64, 136, 'request', ['DELETE /usuarios/7', '', '(sin body)'], marks=[(0, 0, 6, FAM['rose'][1])], cls='ls a67', w=328)
    s += '  <text class="h" x="64" y="326">ENVÍOS</text>\n'
    ssoft, sborder, _ = FAM['slate']
    for k, sent in enumerate((1, 2, 3, 1, 3, 1, 2), start=1):
        cls = 'ls' if k == 7 else 'an'
        s += f'  <g class="{cls} a{k}">'
        for j in range(3):
            fill, stroke = (FAM['indigo'][2], FAM['indigo'][2]) if j < sent else ('#FFFFFF', sborder)
            s += f'<circle cx="{148 + j*28}" cy="322" r="9" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/>'
        s += f'<text x="236" y="322" dy="0.35em" font-size="12.5" fill="#454C61">{sent} de 3</text></g>\n'
    resp = [(1, 'green', '201 Created', 'creó el usuario 8'), (2, 'green', '201 Created', 'creó el usuario 9'),
            (3, 'green', '201 Created', 'creó el usuario 10'), (4, 'green', '200 OK', 'actualizó el usuario 7'),
            (5, 'green', '200 OK', 'la fila ya tenía esos valores'), (6, 'green', '204 No Content', 'borró el usuario 7'),
            (7, 'rose', '404 Not Found', 'el usuario 7 ya no existe')]
    s += '  <text class="h" x="64" y="364">RESPUESTA</text>\n'
    for k, color, code, sub in resp:
        s += f'  <g class="{"ls" if k == 7 else "an"} a{k}">' + box(64, 376, 328, 72, color, code, sub=sub, fs=15).strip() + '</g>\n'

    s += panel(432, 104, 480, 360, 'TABLA usuarios')
    for x, label in ((462, 'id'), (504, 'nombre'), (664, 'email')):
        s += f'  <text x="{x}" y="152" font-size="11" font-weight="700" fill="#9AA3B5">{label}</text>\n'

    def row(y, rid, name, email, color='slate', cls=None, email_cls=None):
        soft, border, _ = FAM[color]
        fill = '#FFFFFF' if color == 'slate' else soft
        r = (f'<rect x="448" y="{y}" width="448" height="36" rx="8" fill="{fill}" stroke="{border}" stroke-width="1.25"/>'
             f'<text class="mono" x="462" y="{y+18}" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26">{rid}</text>'
             f'<text x="504" y="{y+18}" dy="0.35em" font-size="13" fill="#161A26">{name}</text>')
        if email:
            r += f'<text class="mono" x="664" y="{y+18}" dy="0.35em" font-size="12" fill="#454C61">{email}</text>'
        return f'  <g class="{cls}">{r}</g>\n' if cls else f'  {r}\n'
    s += row(164, 6, 'Luis Pérez', 'luis@icesi.edu')
    s += row(208, 7, 'Ana Gómez', None, cls='an a15')
    s += '  <text class="mono an a13" x="664" y="226" dy="0.35em" font-size="12" fill="#454C61">ana@icesi.edu</text>\n'
    asoft, aborder, _ = FAM['amber']
    s += (f'  <g class="an a45"><rect x="656" y="214" width="132" height="24" rx="6" fill="{asoft}" stroke="{aborder}" stroke-width="1.5"/>'
          '<text class="mono" x="664" y="226" dy="0.35em" font-size="12" fill="#161A26">ana.g@icesi.edu</text></g>\n')
    rsoft, rborder, rstrong = FAM['rose']
    s += (f'  <g class="ls a67"><rect x="448" y="208" width="448" height="36" rx="8" fill="#FFFFFF" stroke="{rborder}" stroke-width="1.5" stroke-dasharray="5 5"/>'
          f'<text class="mono" x="462" y="226" dy="0.35em" font-size="12.5" fill="#9AA3B5" text-decoration="line-through">7  Ana Gómez</text>'
          f'<text x="880" y="226" dy="0.35em" text-anchor="end" font-size="12" font-weight="700" fill="{rstrong}">eliminado</text></g>\n')
    s += row(252, 8, 'Juan', 'juan@icesi.edu', 'green', 'an a13')
    s += row(296, 9, 'Juan', 'juan@icesi.edu', 'rose', 'an a23')
    s += row(340, 10, 'Juan', 'juan@icesi.edu', 'rose', 'an a3')
    for cls, y in (('a2', 296), ('a3', 340)):
        s += f'  <text class="an {cls}" x="880" y="{y+18}" dy="0.35em" text-anchor="end" font-size="12" font-weight="700" fill="{rstrong}">duplicado</text>\n'
    s += ring('an a1', 442, 246, 460, 48, 'green')
    s += ring('an a2', 442, 290, 460, 48, 'rose')
    s += ring('an a3', 442, 334, 460, 48, 'rose')
    s += ring('an a4', 442, 202, 460, 48, 'amber')
    s += ring('an a5', 442, 202, 460, 48, 'green')
    s += ring('an a6', 442, 202, 460, 48, 'rose')
    s += ring('an a7', 442, 202, 460, 48, 'green')

    s += ('  <g class="an a1246"><rect x="448" y="396" width="448" height="52" rx="10" fill="#FFFFFF" stroke="#C4CBD8" stroke-width="1.5" stroke-dasharray="5 5"/>'
          '<text x="672" y="422" dy="0.35em" text-anchor="middle" font-size="13" fill="#79809A">¿Repetirlo cambia el estado?</text></g>\n')
    s += '  <g class="an a3">' + box(448, 396, 448, 52, 'rose', 'POST no es idempotente', sub='tres envíos, tres usuarios', mono=False).strip() + '</g>\n'
    s += '  <g class="an a5">' + box(448, 396, 448, 52, 'green', 'PUT es idempotente', sub='uno o tres envíos: el mismo estado', mono=False).strip() + '</g>\n'
    s += '  <g class="ls a7">' + box(448, 396, 448, 52, 'green', 'DELETE es idempotente', sub='la respuesta cambió; el estado no', mono=False).strip() + '</g>\n'

    s += captions(480, [
        (1, 'amber', 'Caso 1 · El cliente envía POST /usuarios con los datos de Juan.', 'El servidor crea el usuario 8 y responde 201 Created.'),
        (2, 'rose', 'La red falla antes de que llegue la respuesta y el cliente reintenta.', 'El mismo POST crea otro usuario, el 9: un duplicado.'),
        (3, 'rose', 'Un tercer intento crea un tercer Juan.', 'POST no es idempotente: cada envío vuelve a cambiar el estado.'),
        (4, 'violet', 'Caso 2 · PUT /usuarios/7 reemplaza al usuario 7 con un email nuevo.', 'El estado cambia una vez: 200 OK.'),
        (5, 'green', 'Se envía el mismo PUT dos veces más.', 'La fila ya tiene esos valores y queda idéntica. PUT es idempotente.'),
        (6, 'rose', 'Caso 3 · DELETE /usuarios/7 elimina al usuario.', 'Responde 204 No Content.'),
        (7, 'green', 'El mismo DELETE otra vez responde 404: ya no existe.', 'La respuesta cambió, pero el estado no. Idempotencia habla del estado, no de la respuesta.')],
        ('Idempotente: repetir el request deja el servidor en el mismo estado que enviarlo una vez.',
         'GET, PUT y DELETE lo son; POST no.'))
    return s + tail(h, 'Por eso un cliente puede reintentar un PUT o un DELETE sin miedo; un POST repetido puede duplicar datos.')


FIGS['restIdempotencia'] = rest_idempotencia


def rest_stateless(freeze=None):
    """Animada: cuatro pasos de 4 s. Dos instancias detrás de un balanceador: la sesión se pierde, el token no."""
    fid, h, n, secs = 'restStateless', 560, 4, 4
    teal, green = FAM['teal'][2], FAM['green'][2]
    spans = {f'a{k}': [(k, k)] for k in range(1, n + 1)}
    spans.update({'a12': [(1, 2)], 'a34': [(3, 4)]})
    on = {1: ['a1', 'a12'], 2: ['a2', 'a12'], 3: ['a3', 'a34'], 4: ['a4', 'a34']}
    hops = [(1, 228, 264, (60, 0), teal, 'ABC123'), (1, 544, 256, (72, -92), teal, 'ABC123'),
            (2, 228, 264, (60, 0), teal, 'ABC123'), (2, 544, 272, (72, 64), teal, 'ABC123'),
            (3, 228, 264, (60, 0), green, 'eyJ…'), (3, 544, 256, (72, -92), green, 'eyJ…'),
            (4, 228, 264, (60, 0), green, 'eyJ…'), (4, 544, 272, (72, 64), green, 'eyJ…')]
    s = anim_head(fid, h, n, secs, spans, on, hops, freeze,
                  'Stateless: cualquier servidor puede responder', 'Stateless: cualquier servidor puede responder',
                  'Si el request trae todo lo que hace falta, no importa a cuál instancia de la aplicación le toque.',
                  'Animación en cuatro pasos con un cliente, un balanceador y dos instancias de la misma aplicación. Caso con '
                  'sesión: el primer request con la cookie ABC123 llega a A, que guarda esa sesión, y responde 200; el siguiente '
                  'cae en B, que no conoce la sesión, y responde 401. Caso stateless: el request trae un token firmado; A lo '
                  'verifica y responde 200, y cuando el siguiente cae en B, B también lo verifica y responde 200.',
                  colors=('teal', 'slate'))
    s += badge_case('an a12', 'rose', 'CASO 1 · CON SESIÓN')
    s += badge_case('ls a34', 'green', 'CASO 2 · STATELESS')
    s += pane_bg(48, 104, 312, 104)
    s += pane_text(48, 104, 'request', ['GET /cursos HTTP/1.1', 'Cookie: JSESSIONID=ABC123'],
                   marks=[(1, None, 0, FAM['teal'][1])], cls='an a12', w=312)
    s += pane_text(48, 104, 'request', ['GET /cursos HTTP/1.1', 'Authorization: Bearer eyJhbGci…'],
                   marks=[(1, None, 0, FAM['green'][1])], cls='ls a34', w=312)
    s += '  ' + box(48, 232, 168, 64, 'teal', 'Cliente', mono=False, fs=15)
    s += '  ' + box(360, 232, 168, 64, 'slate', 'Balanceador', sub='reparte los requests', mono=False)
    s += '  <text class="h" x="704" y="104">DOS INSTANCIAS DE LA APP</text>\n'
    s += '  ' + box(704, 120, 208, 56, 'indigo', 'Servidor A', sub='instancia 1', mono=False, fs=14)
    s += '  ' + box(704, 312, 208, 56, 'indigo', 'Servidor B', sub='instancia 2', mono=False, fs=14)
    s += '  <path class="ar-teal" d="M216,264 H356"/>\n'
    s += '  <path class="ar-slate" d="M528,256 C616,256 616,148 700,148"/><path class="ar-slate" d="M528,272 C616,272 616,340 700,340"/>\n'
    s += '  <g class="an a12">' + box(704, 184, 208, 48, 'green', 'ABC123 → ana', sub='sesión en memoria', fs=12.5).strip() + '</g>\n'
    s += '  <g class="an a12">' + box(704, 376, 208, 48, 'slate', 'ninguna sesión', sub='memoria vacía', mono=False, fs=12.5).strip() + '</g>\n'
    for y in (184, 376):
        s += '  <g class="ls a34">' + box(704, y, 208, 48, 'slate', 'clave de firma', sub='ninguna sesión', mono=False, fs=12.5).strip() + '</g>\n'
    res = [(1, 'green', '200 OK', 'A tenía la sesión'), (2, 'rose', '401', 'B no conoce ABC123'),
           (3, 'green', '200 OK', 'A verificó el token'), (4, 'green', '200 OK', 'B verificó el token')]
    for k, color, code, sub in res:
        s += f'  <g class="{"ls" if k == 4 else "an"} a{k}">' + box(48, 312, 168, 60, color, code, sub=sub, fs=15).strip() + '</g>\n'
    s += ring('an a1', 698, 114, 220, 124, 'green')
    s += ring('an a2', 698, 306, 220, 124, 'rose')
    s += ring('an a3', 698, 114, 220, 124, 'green')
    s += ring('an a4', 698, 306, 220, 124, 'green')
    s += hop_pills(hops)
    s += captions(448, [
        (1, 'teal', 'Caso 1 · Con sesión. El cliente envía su cookie y el balanceador lo manda a A.', 'A guardó la sesión ABC123 en su memoria al hacer login: responde 200.'),
        (2, 'rose', 'El siguiente request cae en B, con la misma cookie.', 'La sesión vive en la memoria de A; B no la conoce y responde 401.'),
        (3, 'green', 'Caso 2 · Stateless. El request trae un token firmado en Authorization.', 'A verifica la firma con su clave: no necesita recordar nada.'),
        (4, 'green', 'El siguiente request cae en B, y B también lo acepta.', 'Cualquier instancia puede responder, porque el request trae todo lo que hace falta.')],
        ('Stateless: el servidor no guarda nada entre requests; cada uno trae todo lo que necesita.',
         'Por eso una API REST escala agregando instancias.'))
    return s + tail(h, 'El token firmado (JWT) se ve en detalle en «Auth en REST», la semana 12.')


FIGS['restStateless'] = rest_stateless


def rest_vs_restful():
    fid, h = 'restVsRestful', 396
    s = head(fid, h, 'REST es la regla; RESTful es la API que la cumple', 'REST es la regla; RESTful es la API que la cumple',
             'Cada principio del estilo REST se nota en algo concreto del request.',
             'Dos columnas. A la izquierda, cinco principios de REST; a la derecha, cómo se ve cada uno en una API RESTful. '
             'Recursos con URL: /usuarios/7. El verbo dice la acción: DELETE /usuarios/7. Stateless: el request trae su propio '
             'token en Authorization. Representación uniforme: Content-Type application/json. Idempotencia: tres PUT iguales '
             'dejan el mismo estado.', colors=('slate',))
    s += panel(48, 104, 400, 244, 'REST · ESTILO ARQUITECTÓNICO')
    s += panel(512, 104, 400, 244, 'RESTFUL · UNA API QUE LO CUMPLE')
    pairs = [('Todo es un recurso con su URL', '/usuarios/7'),
             ('El verbo HTTP dice la acción', 'DELETE /usuarios/7'),
             ('Stateless: cada request es completo', 'Authorization: Bearer eyJ…'),
             ('Representación uniforme', 'Content-Type: application/json'),
             ('Idempotencia en GET, PUT, DELETE', 'PUT /usuarios/7  ×3 = mismo estado')]
    isoft, iborder, istrong = FAM['indigo']
    gsoft, gborder, gstrong = FAM['green']
    for i, (rule, ex) in enumerate(pairs):
        y = 140 + i * 40
        s += (f'  <rect x="64" y="{y}" width="368" height="30" rx="7" fill="{isoft}" stroke="{iborder}" stroke-width="1.25"/>'
              f'<text x="78" y="{y+15}" dy="0.35em" font-size="13" font-weight="600" fill="{istrong}" data-fit="340">{rule}</text>\n')
        s += (f'  <rect x="528" y="{y}" width="368" height="30" rx="7" fill="{gsoft}" stroke="{gborder}" stroke-width="1.25"/>'
              f'<text class="mono" x="542" y="{y+15}" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="320">{esc(ex)}</text>'
              f'<text x="880" y="{y+15}" dy="0.35em" text-anchor="end" font-size="14" font-weight="700" fill="{gstrong}">✓</text>\n')
        s += f'  <path class="ar-slate" d="M440,{y+15} H520"/>\n'
    return s + tail(h, 'Una API que usa HTTP pero pone verbos en la URL o guarda sesión en el servidor no es RESTful.')


FIGS['restVsRestful'] = rest_vs_restful


def rest_semantica():
    fid, h = 'restSemantica', 524
    s = head(fid, h, 'Dos URLs, seis acciones', 'Dos URLs, seis acciones',
             'El sustantivo va en la URL y la acción la pone el verbo. Sin id se habla de la colección; con id, de un elemento.',
             'A la izquierda la colección /usuarios con GET para obtener todos y POST para crear. A la derecha el elemento '
             '/usuarios/{id} con GET para obtener uno, PUT para reemplazarlo completo, PATCH para actualizar parte y DELETE '
             'para eliminarlo. Abajo, un recurso anidado: GET /cursos/{id}/estudiantes son los estudiantes de un curso.')
    s += panel(48, 104, 420, 244, 'LA COLECCIÓN')
    s += panel(492, 104, 420, 244, 'UN ELEMENTO')
    left = [('GET', '/usuarios', 'Obtener todos'), ('POST', '/usuarios', 'Crear uno nuevo')]
    right = [('GET', '/usuarios/{id}', 'Obtener uno'), ('PUT', '/usuarios/{id}', 'Reemplazarlo completo'),
             ('PATCH', '/usuarios/{id}', 'Actualizar una parte'), ('DELETE', '/usuarios/{id}', 'Eliminarlo')]
    for x0, items in ((64, left), (508, right)):
        for i, (verb, url, action) in enumerate(items):
            y = 144 + i * 44
            soft, border, _ = FAM[VERB[verb]]
            s += (f'  <rect x="{x0}" y="{y}" width="388" height="36" rx="8" fill="{soft}" stroke="{border}" stroke-width="1.25"/>'
                  + badge(x0 + 6, y + 6, verb) +
                  f'<text class="mono" x="{x0 + 90}" y="{y+18}" dy="0.35em" font-size="13" font-weight="700" fill="#161A26">{url}</text>'
                  f'<text x="{x0 + 376}" y="{y+18}" dy="0.35em" text-anchor="end" font-size="13" fill="#454C61" data-fit="150">{action}</text>\n')
    s += pane(64, 236, 388, 72, 'GET /usuarios → 200 OK', ['[ {"id": 1, …}, {"id": 2, …}, {"id": 7, …} ]'], top=52)
    s += '  <text x="64" y="328" font-size="12.5" fill="#79809A" data-fit="388">Sin {id}: la acción es sobre el conjunto.</text>\n'
    s += '  <text x="508" y="328" font-size="12.5" fill="#79809A" data-fit="388">Con {id}: la acción es sobre ese usuario.</text>\n'

    s += panel(48, 364, 864, 108, 'RECURSOS ANIDADOS')
    cw, x = 10.8, 72.0
    segs = [('GET ', None, None), ('/cursos', 'indigo', 'la colección'), ('/{id}', 'amber', 'un curso'),
            ('/estudiantes', 'violet', 'sus estudiantes')]
    for text, color, label in segs:
        w = len(text) * cw
        if color:
            soft, border, strong = FAM[color]
            s += (f'  <rect x="{x-2:.1f}" y="{398}" width="{w+4:.1f}" height="30" rx="6" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
                  f'<text x="{x + w/2:.1f}" y="448" dy="0.35em" text-anchor="middle" font-size="12" font-weight="700" fill="{strong}">{label}</text>\n')
            fill = '#161A26'
        else:
            fill = FAM['green'][2]
        s += (f'  <text class="mono" x="{x:.1f}" y="413" dy="0.35em" font-size="18" font-weight="700" fill="{fill}" '
              f'textLength="{len(text.rstrip()) * cw:.1f}" lengthAdjust="spacingAndGlyphs">{text.rstrip()}</text>\n')
        x += w + 8
    s += '  <text x="440" y="407" font-size="13.5" font-weight="600" fill="#161A26">Se lee de izquierda a derecha:</text>\n'
    s += '  <text x="440" y="427" font-size="13.5" fill="#454C61">«los estudiantes del curso {id}».</text>\n'
    return s + tail(h, 'Nunca un verbo en la URL: /getUsuarios o /deleteUsuario repiten lo que ya dice el método HTTP.')


FIGS['restSemantica'] = rest_semantica


def rest_response_entity():
    fid, h = 'restResponseEntity', 400
    s = head(fid, h, 'ResponseEntity arma la respuesta completa', 'ResponseEntity arma la respuesta completa',
             'Cada llamada del builder llena una parte del mensaje HTTP que recibe el cliente.',
             'A la izquierda, el return de un controller que encadena status de HttpStatus.CREATED, un header Location y '
             'body con el DTO. A la derecha, la respuesta HTTP que produce: la línea de estado 201 Created, los headers y '
             'el body en JSON. Cada llamada está unida con su parte por el mismo color.', colors=('green', 'amber', 'violet'))
    lines = ['return ResponseEntity', '    .status(HttpStatus.CREATED)', '    .header("Location", "/usuarios/7")',
             '    .body(dto);']
    s += pane(48, 112, 416, 232, 'UsuarioController.java', lines, fs=12.5, lh=30, top=88,
              marks=[(1, 4, 27, FAM['green'][1]), (2, 4, 34, FAM['amber'][1]), (3, 4, 11, FAM['violet'][1])])
    s += panel(512, 104, 400, 244, 'LA RESPUESTA HTTP QUE SALE')
    bands = [(136, 44, 'green', 'STATUS', ['HTTP/1.1 201 Created']),
             (188, 52, 'amber', 'HEADERS', ['Location: /usuarios/7', 'Content-Type: application/json']),
             (248, 84, 'violet', 'BODY', ['{ "id": 7,', '  "nombre": "Ana Gómez",', '  "email": "ana@icesi.edu" }'])]
    for y, bh, color, label, txt in bands:
        soft, border, strong = FAM[color]
        s += f'  <rect x="528" y="{y}" width="368" height="{bh}" rx="8" fill="{soft}" stroke="{border}" stroke-width="1.5"/>\n'
        s += f'  <text x="884" y="{y+16}" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="{strong}">{label}</text>\n'
        n = len(txt)
        for i, t in enumerate(txt):
            ty = y + bh / 2 + (i - (n - 1) / 2) * 20
            s += f'  <text class="mono" x="544" y="{ty:.0f}" dy="0.35em" font-size="12.5" fill="#161A26" data-fit="330">{esc(t)}</text>\n'
    for ly, by, color in ((226, 158, 'green'), (256, 214, 'amber'), (286, 290, 'violet')):
        strong = FAM[color][2]
        s += (f'  <path class="ar-{color}" d="M470,{ly} C492,{ly} 498,{by} 520,{by}"/>'
              f'<circle cx="470" cy="{ly}" r="3.5" fill="{strong}"/>\n')
    return s + tail(h, 'Con .build() en lugar de .body(…) la respuesta sale sin body, como en 204 No Content.')


FIGS['restResponseEntity'] = rest_response_entity


def rest_status():
    fid, h = 'restStatus', 500
    s = head(fid, h, 'Los códigos de estado se leen por familia', 'Los códigos de estado se leen por familia',
             'El primer dígito ya dice quién tuvo el problema; HttpStatus trae una constante para cada código.',
             'Tres familias. 2xx, todo salió bien: 200 OK para GET, PUT y PATCH exitosos, 201 CREATED para un POST que crea, '
             '204 NO_CONTENT para un DELETE sin body. 4xx, el cliente se equivocó: 400 BAD_REQUEST datos inválidos, 401 '
             'UNAUTHORIZED no autenticado, 403 FORBIDDEN sin permisos, 404 NOT_FOUND el recurso no existe. 5xx, falló el '
             'servidor: 500 INTERNAL_SERVER_ERROR por una excepción no controlada.')
    s += panel(48, 104, 420, 336)
    s += panel(492, 104, 420, 336)

    def group(x, y, color, label):
        strong = FAM[color][2]
        return f'  <text x="{x}" y="{y}" font-size="12" font-weight="700" letter-spacing=".08em" fill="{strong}">{label}</text>\n'

    def card(x, y, color, code, const, when):
        soft, border, strong = FAM[color]
        return (f'  <rect x="{x}" y="{y}" width="388" height="52" rx="10" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
                f'<text x="{x+18}" y="{y+26}" dy="0.35em" font-size="24" font-weight="800" fill="{strong}">{code}</text>'
                f'<text class="mono" x="{x+86}" y="{y+19}" dy="0.35em" font-size="12.5" font-weight="700" fill="#161A26" data-fit="290">{const}</text>'
                f'<text x="{x+86}" y="{y+37}" dy="0.35em" font-size="12.5" fill="#454C61" data-fit="290">{when}</text>\n')
    s += group(64, 132, 'green', '2XX · TODO SALIÓ BIEN')
    for i, (c, k, w) in enumerate([('200', 'OK', 'GET, PUT o PATCH exitosos'), ('201', 'CREATED', 'POST que crea un recurso'),
                                   ('204', 'NO_CONTENT', 'DELETE exitoso, sin body')]):
        s += card(64, 144 + i * 64, 'green', c, k, w)
    s += group(64, 356, 'slate', '5XX · FALLÓ EL SERVIDOR')
    s += card(64, 368, 'slate', '500', 'INTERNAL_SERVER_ERROR', 'Una excepción que nadie controló')
    s += group(508, 132, 'rose', '4XX · EL CLIENTE SE EQUIVOCÓ')
    for i, (c, k, w, color) in enumerate([('400', 'BAD_REQUEST', 'Datos inválidos en el request', 'amber'),
                                          ('401', 'UNAUTHORIZED', 'No se autenticó', 'amber'),
                                          ('403', 'FORBIDDEN', 'Autenticado, pero sin permisos', 'rose'),
                                          ('404', 'NOT_FOUND', 'El recurso no existe', 'rose')]):
        s += card(508, 144 + i * 64, color, c, k, w)
    return s + tail(h, '401 pregunta «¿quién es usted?»; 403 dice «sé quién es, pero no puede». Se usan como HttpStatus.NOT_FOUND.')


FIGS['restStatus'] = rest_status


def rest_anatomia():
    fid, h = 'restAnatomia', 572
    s = head(fid, h, 'Cada parte del request llega a un parámetro', 'Cada parte del request llega a un parámetro',
             'Spring lee el mensaje HTTP y entrega cada dato al parámetro con la anotación que lo pide.',
             'Arriba, un request POST /cursos/42/estudiantes?notify=true con headers y un body JSON. El segmento 42 está '
             'marcado como @PathVariable, notify=true como @RequestParam y el body como @RequestBody. Abajo, el método del '
             'controller recibe esos mismos tres datos en los parámetros cursoId, notify y dto, con los mismos colores.',
             colors=('slate',))
    g, t, v = FAM['green'][1], FAM['teal'][1], FAM['violet'][1]
    cw, fs = 8.4, 14
    s += pane_bg(48, 104, 864, 188)
    req = 'POST /cursos/42/estudiantes?notify=true HTTP/1.1'
    s += pane_text(48, 104, 'HTTP request', [req], fs=fs, top=52,
                   marks=[(0, 13, 2, g), (0, 28, 11, t)], w=864)
    s += pane_text(48, 104, '', ['', '', 'Authorization: Bearer eyJhbGc…', 'Content-Type: application/json', '',
                                 '{"nombre": "Juan", "email": "juan@uni.edu"}'], fs=fs, lh=22, top=64,
                   marks=[(5, 0, 44, v)], w=864)
    for y, label in ((156, 'REQUEST LINE'), (212, 'HEADERS'), (274, 'BODY')):
        s += f'  <text x="896" y="{y}" text-anchor="end" font-size="10.5" font-weight="700" letter-spacing=".08em" fill="#8C95AA">{label}</text>\n'
    s += '  ' + pill(60 + 14.5 * cw, 178, '@PathVariable', 'green') + pill(60 + 33.5 * cw, 178, '@RequestParam', 'teal') + '\n'
    s += '  ' + pill(60 + 44 * cw + 76, 168 + 5 * 22 - 5, '@RequestBody', 'violet') + '\n'

    s += '  <path class="ar-slate" d="M480,300 V334"/>\n'
    s += '  <text x="496" y="321" font-size="13" fill="#454C61">Spring convierte cada parte y la inyecta en el método</text>\n'
    java = ['@PostMapping("/{cursoId}/estudiantes")', 'public ResponseEntity<EstudianteDTO> inscribir(',
            '    @PathVariable Long cursoId,', '    @RequestParam boolean notify,', '    @RequestBody EstudianteDTO dto) {',
            '    …', '}']
    s += pane(48, 340, 864, 188, 'CursoController.java', java, fs=13, lh=20, top=48,
              marks=[(2, 4, 26, g), (3, 4, 28, t), (4, 4, 30, v)])
    s += f'  <text class="mono" x="560" y="424" dy="0.35em" font-size="12.5" fill="{FAM["green"][1]}">← cursoId = 42</text>\n'
    s += f'  <text class="mono" x="560" y="444" dy="0.35em" font-size="12.5" fill="{FAM["teal"][1]}">← notify = true</text>\n'
    s += f'  <text class="mono" x="560" y="464" dy="0.35em" font-size="12.5" fill="{FAM["violet"][1]}">← dto.getNombre() = "Juan"</text>\n'
    return s + tail(h, 'Los headers también llegan, pero Authorization lo procesa Spring Security antes de entrar al controller.')


FIGS['restAnatomia'] = rest_anatomia


def rest_parametros():
    fid, h = 'restParametros', 380
    s = head(fid, h, '¿De dónde viene el dato?', '¿De dónde viene el dato?',
             'La pregunta que decide la anotación: ¿el dato identifica el recurso, lo filtra o es el recurso mismo?',
             'Tres tarjetas. @PathVariable toma un segmento de la ruta, como 42 en /cursos/42, y sirve para identificar un '
             'recurso. @RequestParam toma la query string, como page=0&amp;size=10, y sirve para filtrar, paginar u ordenar. '
             '@RequestBody toma el cuerpo JSON y sirve para crear o actualizar con POST, PUT o PATCH.')
    cards = [(48, 'green', '@PathVariable', 'un segmento de la ruta', '/cursos/42', 8, 2,
              'identificar UN recurso', 'Obligatorio: sin él la URL es otra.'),
             (344, 'teal', '@RequestParam', 'la query string', '/cursos?page=0&size=10', 8, 14,
              'filtrar, paginar, ordenar', 'Opcional con required = false.'),
             (640, 'violet', '@RequestBody', 'el body en JSON', '{"nombre": "Ana"}', 0, 17,
              'crear o actualizar', 'POST, PUT, PATCH · Jackson → DTO.')]
    cw = 7.5
    for x, color, ann, src, ex, col, n, use, note in cards:
        soft, border, strong = FAM[color]
        s += f'  <rect x="{x}" y="104" width="272" height="220" rx="12" fill="#FFFFFF" stroke="{border}" stroke-width="1.5"/>\n'
        s += (f'  <path d="M{x},116 A12,12 0 0 1 {x+12},104 H{x+260} A12,12 0 0 1 {x+272},116 V148 H{x} Z" fill="{soft}"/>'
              f'<path d="M{x},148 H{x+272}" stroke="{border}" stroke-width="1.5"/>'
              f'<text class="mono" x="{x+136}" y="126" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="{strong}">{ann}</text>\n')
        s += f'  <text class="h" x="{x+16}" y="174">VIENE DE</text><text x="{x+16}" y="194" font-size="14" font-weight="600" fill="#161A26" data-fit="240">{src}</text>\n'
        s += (f'  <rect x="{x+16}" y="206" width="240" height="32" rx="7" fill="#1F2430"/>'
              f'<rect x="{x + 26 + col*cw - 2:.1f}" y="212" width="{n*cw + 4:.1f}" height="20" rx="4" fill="{border}" fill-opacity=".35" stroke="{border}" stroke-width="1.25"/>'
              f'<text class="mono" x="{x+26}" y="222" dy="0.35em" font-size="12.5" fill="#E6EAF2" textLength="{len(ex)*cw:.1f}" lengthAdjust="spacingAndGlyphs">{esc(ex)}</text>\n')
        s += f'  <text class="h" x="{x+16}" y="266">ÚSELO PARA</text><text x="{x+16}" y="286" font-size="14" font-weight="600" fill="{strong}" data-fit="240">{use}</text>\n'
        s += f'  <text x="{x+16}" y="308" font-size="12.5" fill="#79809A" data-fit="240">{esc(note)}</text>\n'
    return s + tail(h, 'Se pueden combinar en un mismo método: el id en la ruta, los filtros en la query y los datos en el body.')


FIGS['restParametros'] = rest_parametros


def rest_dto():
    fid, h = 'restDto', 408
    s = head(fid, h, 'La entidad se queda adentro; los DTOs cruzan la frontera', 'La entidad se queda adentro; los DTOs cruzan la frontera',
             'El cliente nunca ve la entidad: manda un DTO de entrada y recibe uno de salida, cada uno con solo los campos que necesita.',
             'Tres columnas. UsuarioRequestDTO entra con POST /usuarios y trae nombre, email y password, pero no id, que lo '
             'genera la base de datos. En el centro la entidad Usuario, con id, nombre, email y password, vive en el servidor. '
             'UsuarioResponseDTO sale con GET /usuarios/7 y trae id, nombre y email, pero nunca el password.',
             colors=('slate',))
    cols = [(48, 'teal', 'ENTRA · POST /usuarios', 'UsuarioRequestDTO', [('id', False, 'lo genera la BD'), ('nombre', True, ''),
                                                                          ('email', True, ''), ('password', True, '')]),
            (356, 'amber', 'ADENTRO · @Entity', 'Usuario', [('id', True, ''), ('nombre', True, ''), ('email', True, ''),
                                                           ('password', True, '')]),
            (664, 'green', 'SALE · GET /usuarios/7', 'UsuarioResponseDTO', [('id', True, ''), ('nombre', True, ''),
                                                                            ('email', True, ''), ('password', False, 'nunca sale')])]
    rsoft, rborder, rstrong = FAM['rose']
    for x, color, label, cls, fields in cols:
        soft, border, strong = FAM[color]
        s += panel(x, 104, 248, 248, label)
        s += '  ' + box(x + 16, 136, 216, 40, color, cls, hero=(color == 'amber'), fs=13.5)
        for i, (f, present, why) in enumerate(fields):
            y = 192 + i * 38
            if present:
                s += (f'  <rect x="{x+16}" y="{y}" width="216" height="30" rx="7" fill="#FFFFFF" stroke="{border}" stroke-width="1.25"/>'
                      f'<text class="mono" x="{x+30}" y="{y+15}" dy="0.35em" font-size="13" fill="#161A26">{f}</text>\n')
            else:
                s += (f'  <rect x="{x+16}" y="{y}" width="216" height="30" rx="7" fill="#FFFFFF" stroke="{rborder}" stroke-width="1.25" stroke-dasharray="4 4"/>'
                      f'<text class="mono" x="{x+30}" y="{y+15}" dy="0.35em" font-size="13" fill="#9AA3B5" text-decoration="line-through">{f}</text>'
                      f'<text x="{x+218}" y="{y+15}" dy="0.35em" text-anchor="end" font-size="11.5" font-weight="600" fill="{rstrong}">{why}</text>\n')
    s += '  <path class="ar-slate" d="M300,228 H352"/><path class="ar-slate" d="M608,228 H660"/>\n'
    s += '  <text x="326" y="216" text-anchor="middle" font-size="11.5" fill="#79809A">se copia</text>\n'
    s += '  <text x="634" y="216" text-anchor="middle" font-size="11.5" fill="#79809A">se copia</text>\n'
    return s + tail(h, 'Si el controller devolviera la entidad, el password viajaría en el JSON de la respuesta.')


FIGS['restDto'] = rest_dto


def rest_mapstruct():
    fid, h = 'restMapstruct', 568
    s = head(fid, h, 'Usted declara la interfaz; MapStruct escribe la clase', 'Usted declara la interfaz; MapStruct escribe la clase',
             'Al compilar, MapStruct lee las firmas y los @Mapping y genera el código de copia campo por campo.',
             'A la izquierda, la interfaz CursoMapper con @Mapper y un método toDTO con @Mapping de profesor.id a profesorId. '
             'Al compilar con Maven, MapStruct genera CursoMapperImpl, una clase @Component que crea el CursoDTO y copia id, '
             'nombre y el id del profesor. Abajo, en ejecución, el bean CursoMapper convierte un Curso en CursoDTO con toDTO '
             'y de vuelta con toEntity.', colors=('slate', 'amber', 'green'))
    a = FAM['amber'][1]
    left = ['@Mapper(componentModel = "spring")', 'public interface CursoMapper {', '',
            '  @Mapping(source = "profesor.id",', '           target = "profesorId")', '  CursoDTO toDTO(Curso curso);', '',
            '  Curso toEntity(CursoDTO dto);', '}']
    right = ['@Component', 'public class CursoMapperImpl', '    implements CursoMapper {', '',
             '  public CursoDTO toDTO(Curso curso) {', '    CursoDTO dto = new CursoDTO();', '    dto.setId(curso.getId());',
             '    dto.setNombre(curso.getNombre());', '    dto.setProfesorId(', '        curso.getProfesor().getId());',
             '    return dto;', '  }  // … y toEntity']
    s += f'  <text class="h" x="48" y="116">USTED ESCRIBE</text><text class="h" x="520" y="116">MAPSTRUCT GENERA</text>\n'
    s += pane(48, 128, 392, 272, 'CursoMapper.java', left, marks=[(3, None, 0, a), (4, None, 0, a)])
    s += pane(520, 128, 392, 272, 'target/…/CursoMapperImpl.java', right, marks=[(8, None, 0, a), (9, None, 0, a)])
    s += '  <path class="ar-slate" d="M446,264 H514"/>\n'
    s += '  ' + pill(480, 240, 'mvn compile', 'slate', fs=10.5) + '\n'
    s += '  <text x="480" y="290" text-anchor="middle" font-size="11" fill="#79809A">annotation</text><text x="480" y="304" text-anchor="middle" font-size="11" fill="#79809A">processor</text>\n'

    s += panel(48, 416, 864, 96, 'EN EJECUCIÓN')
    s += '  ' + box(72, 444, 200, 52, 'amber', 'Curso', sub='@Entity')
    s += '  ' + box(380, 444, 200, 52, 'indigo', 'CursoMapper', sub='bean inyectado en el Service', hero=True)
    s += '  ' + box(688, 444, 200, 52, 'green', 'CursoDTO', sub='lo que ve el cliente')
    for x1, x2 in ((272, 380), (580, 688)):
        s += f'  <path class="ar-green" d="M{x1+4},{458} H{x2-4}"/><path class="ar-amber" d="M{x2-4},{482} H{x1+4}"/>\n'
    s += f'  <text class="mono" x="326" y="452" text-anchor="middle" font-size="11" fill="{FAM["green"][2]}">toDTO</text>'
    s += f'<text class="mono" x="326" y="500" text-anchor="middle" font-size="11" fill="{FAM["amber"][2]}">toEntity</text>\n'
    s += f'  <text class="mono" x="634" y="452" text-anchor="middle" font-size="11" fill="{FAM["green"][2]}">toDTO</text>'
    s += f'<text class="mono" x="634" y="500" text-anchor="middle" font-size="11" fill="{FAM["amber"][2]}">toEntity</text>\n'
    return s + tail(h, 'Si cambia un campo de la entidad y el mapper no lo cubre, el error aparece al compilar, no en producción.')


FIGS['restMapstruct'] = rest_mapstruct


def rest_lombok():
    fid, h = 'restLombok', 448
    s = head(fid, h, 'Una anotación, el código que ya no escribe', 'Una anotación, el código que ya no escribe',
             'Lombok genera ese código al compilar: no aparece en su archivo, pero sí en la clase que usa Spring.',
             'Seis tarjetas. @Data genera getters, setters, equals, hashCode y toString. @NoArgsConstructor genera new Usuario(). '
             '@AllArgsConstructor genera el constructor con todos los campos. @RequiredArgsConstructor genera el constructor '
             'con los campos final, que Spring usa para inyectar. @Builder permite construir con ProfesorDTO.builder(). '
             '@Slf4j agrega un campo log listo para usar.')
    cards = [('@Data', ['getNombre()  setNombre(…)', 'equals()  hashCode()', 'toString()'], True),
             ('@NoArgsConstructor', ['new CursoDTO()'], False),
             ('@AllArgsConstructor', ['new CursoDTO(id, nombre,', '            profesor)'], False),
             ('@RequiredArgsConstructor', ['CursoServiceImpl(', '    CursoRepository repo,', '    CursoMapper mapper)'], False),
             ('@Builder', ['ProfesorDTO.builder()', '    .nombre("Carlos")', '    .build()'], False),
             ('@Slf4j', ['log.info("Curso creado")'], False)]
    soft, border, strong = FAM['indigo']
    cw = 7.2
    for i, (ann, code, hero) in enumerate(cards):
        x, y = 48 + (i % 3) * 296, 104 + (i // 3) * 152
        s += f'  <rect x="{x}" y="{y}" width="272" height="136" rx="12" fill="#FFFFFF" stroke="{border if hero else "#D9DEE8"}" stroke-width="{2.5 if hero else 1.5}"/>\n'
        s += f'  <text class="mono" x="{x+16}" y="{y+28}" font-size="15" font-weight="700" fill="{strong}" data-fit="240">{ann}</text>\n'
        s += f'  <text class="h" x="{x+16}" y="{y+50}">GENERA</text>\n'
        s += f'  <rect x="{x+16}" y="{y+60}" width="240" height="62" rx="8" fill="{soft}"/>\n'
        n = len(code)
        for j, line in enumerate(code):
            text = line.strip()
            indent = len(line) - len(line.lstrip())
            ty = y + 91 + (j - (n - 1) / 2) * 18
            s += (f'  <text class="mono" x="{x + 28 + indent*cw:.1f}" y="{ty:.0f}" dy="0.35em" font-size="12" fill="#161A26" '
                  f'textLength="{len(text)*cw:.1f}" lengthAdjust="spacingAndGlyphs">{esc(text)}</text>\n')
    return s + tail(h, 'En entidades JPA evite @Data: su equals y hashCode recorren las relaciones y pueden entrar en ciclo.')


FIGS['restLombok'] = rest_lombok


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
            m = re.search(r'data-steps="(\d+)"', fn())
            for k in range(1, int(m.group(1)) + 1 if m else 0):
                (out / f'{fid}-{k}.svg').write_text(fn(freeze=k), encoding='utf-8')
    print(len(FIGS), 'figuras en', out)


if __name__ == '__main__':
    main()
