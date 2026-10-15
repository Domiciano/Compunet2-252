"""Figuras SVG de la Semana 11 · Rest: ¿Qué es REST? (0036), RestControllers (0037), Parámetros HTTP (0038),
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
LESSONS = ['lesson27.md', 'lesson271.md', 'lesson272.md', 'lesson28.md', 'lesson281.md']
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
