"""Figuras SVG de la introducción a React (SEMANA 14): lecciones 0049, 0050, 0099, 0100 y 0051.

    python3 tools/react_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/react_figuras.py --inject      reemplaza cada bloque ```svg de la lección
                                                 por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Lo que se entiende tocando no va aquí: son los diagramas interactivos de
classnotesapp/src/components/interactive/reactSims.js.
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from security_figuras import FAM, box, head, tail  # noqa: E402
from rest_figuras import esc, pane, pill  # noqa: E402
from ia_figuras import folder, file_icon  # noqa: E402
from console_frame import frame  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lesson32.md', 'lesson33.md', 'lesson_node_bundler.md', 'lesson_react_setup.md', 'lesson34.md']
FIGS = {}


def arrow(fid, color):
    return f'class="ar-{color}"'


def js_modulos():
    fid, h = 'jsModulos', 330
    s = head(fid, h, 'Módulos: un archivo exporta, otro importa', 'Módulos: un archivo exporta, otro importa',
             'Cada archivo es un módulo. Lo que no se exporta queda privado dentro de su archivo.',
             'A la izquierda utils.js exporta la función doble con export y la función saludar con export default. '
             'A la derecha main.js las importa con import saludar, { doble } from ./utils.js y las usa con console.log.',
             colors=('violet',))
    left = ['export const doble = (n) => n * 2;', '',
            'export default function saludar(nombre) {', '  return `Hola, ${nombre}`;', '}']
    right = ["import saludar, { doble } from './utils.js';", '',
             'console.log(saludar("Ana"));', 'console.log(doble(4));']
    s += pane(48, 112, 400, 160, 'utils.js', left, marks=[(0, 0, 6, '#C9A6EE'), (2, 0, 14, '#C9A6EE')])
    s += pane(512, 112, 400, 160, 'main.js', right, marks=[(0, 0, 6, '#9FD68D')])
    s += '  <path class="ar-violet" d="M452,192 H506"/>\n'
    s += '  ' + pill(480, 172, 'export', 'violet', fs=10.5) + '\n'
    return s + tail(h, 'En React cada componente es un módulo: Header.jsx lo exporta y App.jsx lo importa.')


FIGS['jsModulos'] = js_modulos


def vanilla_flujo():
    fid, h = 'vanillaFlujo', 360
    s = head(fid, h, 'Cómo funciona una página con JavaScript puro', 'Cómo funciona una página con JavaScript puro',
             'El HTML carga el JS. El JS lee y cambia el DOM, y el navegador pinta lo que cambió.',
             'Cuatro bloques en fila. index.html carga app.js con una etiqueta script. app.js lee y modifica el DOM con '
             'getElementById, textContent y appendChild. El DOM es el árbol de nodos en memoria y el navegador lo pinta '
             'en la pantalla. Una flecha de vuelta va de la pantalla a app.js: cuando el usuario hace clic o escribe, '
             'el navegador dispara un evento y corre la función registrada con addEventListener.',
             colors=('indigo', 'amber'))
    xs, w, y, bh = [48, 280, 512, 744], 168, 136, 100
    items = [('slate', 'index.html', ['la estructura', '<script src="app.js">']),
             ('indigo', 'app.js', ['getElementById', 'addEventListener']),
             ('teal', 'DOM', ['árbol de nodos', 'en memoria']),
             ('green', 'Pantalla', ['lo que ve', 'el usuario'])]
    for x, (c, label, lines) in zip(xs, items):
        soft, border, strong = FAM[c]
        s += (f'  <rect x="{x}" y="{y}" width="{w}" height="{bh}" rx="12" fill="{soft}" stroke="{border}" stroke-width="1.75"/>'
              f'<text class="mono" x="{x + w/2:.0f}" y="{y+28}" dy="0.35em" text-anchor="middle" font-size="15" '
              f'font-weight="700" fill="{strong}">{label}</text>')
        for j, line in enumerate(lines):
            mono = ' class="mono"' if '<' in line or line[:1].islower() and ' ' not in line else ''
            s += (f'<text{mono} x="{x + w/2:.0f}" y="{y+58+j*20}" dy="0.35em" text-anchor="middle" font-size="12" '
                  f'fill="#454C61" data-fit="{w-16}">{esc(line)}</text>')
        s += '\n'
    for i, label in enumerate(['carga', 'cambia', 'pinta']):
        x1, x2 = xs[i] + w + 4, xs[i + 1] - 4
        s += f'  <path class="ar-indigo" d="M{x1},{y+bh/2} H{x2}"/>\n'
        s += f'  <text x="{(x1+x2)/2:.0f}" y="{y+bh/2-12}" text-anchor="middle" font-size="11.5" fill="#4453C9" font-weight="600">{label}</text>\n'
    by = y + bh
    s += (f'  <path class="ar-amber" d="M{xs[3]+w/2},{by+4} V{by+44} H{xs[1]+w/2} V{by+8}"/>\n'
          f'  <rect x="{(xs[1]+xs[3]+w)/2-150:.0f}" y="{by+32}" width="300" height="24" rx="12" fill="#FFF3DC" stroke="#F0C572" stroke-width="1.5"/>'
          f'<text x="{(xs[1]+xs[3]+w)/2:.0f}" y="{by+44}" dy="0.35em" text-anchor="middle" font-size="12" fill="#A96C05" '
          f'font-weight="700">evento: click, input… y corre tu función</text>\n')
    return s + tail(h, 'Mostrar datos y recibir al usuario pasa por el mismo lugar: tu JS tocando el DOM, nodo por nodo.')


FIGS['vanillaFlujo'] = vanilla_flujo


def tree(s, x0, top, rows, step=28, ind=22):
    last = {}
    for i, (d, name, kind, color, note) in enumerate(rows):
        y = top + i * step
        x = x0 + d * ind
        if d > 0:
            px = x0 + (d - 1) * ind + 10
            py = last.get(d - 1, y)
            s += f'  <path d="M{px},{py+9} V{y} H{x-4}" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>\n'
        last[d] = y
        for deeper in [k for k in last if k > d]:
            del last[deeper]
        strong = FAM[color][2]
        icon = folder(x, y, color) if kind == 'dir' else file_icon(x, y)
        weight = '700' if kind == 'dir' else '400'
        fill = strong if kind == 'dir' and color != 'slate' else ('#9AA3B5' if note == 'dim' else '#161A26')
        s += (f'  {icon}<text class="mono" x="{x+28}" y="{y}" dy="0.35em" font-size="13" font-weight="{weight}" '
              f'fill="{fill}">{esc(name)}</text>\n')
    return s


def node_dev_dist():
    fid, h = 'nodeDevDist', 560
    s = head(fid, h, 'Lo que escribes no es lo que se publica', 'Lo que escribes no es lo que se publica',
             'El proyecto de desarrollo es grande y ordenado. El bundler lo reduce a tres archivos que el navegador entiende.',
             'A la izquierda el proyecto de desarrollo: src con main.jsx, App.jsx, App.css y components/Header.jsx, '
             'node_modules con react, react-dom y cientos de paquetes más, package.json, index.html y vite.config.js. '
             'En el centro Vite, que corre con npm run build. A la derecha la carpeta dist con index.html y, en assets, '
             'un solo archivo JavaScript y un solo archivo CSS.',
             colors=('violet',))
    s += ('  <rect x="48" y="112" width="360" height="380" rx="14" fill="#EEF1FF" stroke="#A9B4F2" stroke-width="1.75"/>'
          '<text class="h" x="68" y="140" fill="#4453C9">DESARROLLO · LO QUE ESCRIBES</text>\n')
    rows = [(0, 'mi-app/', 'dir', 'slate', None),
            (1, 'src/', 'dir', 'indigo', None),
            (2, 'main.jsx', 'file', 'indigo', None),
            (2, 'App.jsx', 'file', 'indigo', None),
            (2, 'App.css', 'file', 'indigo', None),
            (2, 'components/', 'dir', 'indigo', None),
            (3, 'Header.jsx', 'file', 'indigo', None),
            (1, 'node_modules/', 'dir', 'amber', None),
            (2, 'react/', 'dir', 'amber', None),
            (2, 'react-dom/', 'dir', 'amber', None),
            (2, '… cientos más', 'file', 'amber', 'dim'),
            (1, 'package.json', 'file', 'slate', None)]
    s = tree(s, 72, 172, rows, step=24)
    s += ('  <text x="68" y="474" font-size="12" fill="#454C61" data-fit="320">JSX, módulos, librerías: el navegador no lo entiende así</text>\n')
    vs, vb, vstrong = FAM['violet']
    s += (f'  <rect x="436" y="232" width="120" height="104" rx="14" fill="{vstrong}"/>'
          f'<text x="496" y="268" dy="0.35em" text-anchor="middle" font-size="18" font-weight="700" fill="#FFFFFF">Vite</text>'
          f'<text x="496" y="290" dy="0.35em" text-anchor="middle" font-size="11.5" fill="#F4EBFF">bundler</text>'
          f'<text class="mono" x="496" y="356" dy="0.35em" text-anchor="middle" font-size="11.5" fill="{vstrong}" font-weight="700">npm run build</text>\n')
    s += '  <path class="ar-violet" d="M410,284 H430"/><path class="ar-violet" d="M558,284 H578"/>\n'
    s += ('  <rect x="584" y="112" width="328" height="380" rx="14" fill="#E8F6E3" stroke="#9FD68D" stroke-width="1.75"/>'
          '<text class="h" x="604" y="140" fill="#3A8235">PRODUCCIÓN · DIST/</text>\n')
    out = [(0, 'dist/', 'dir', 'green', None),
           (1, 'index.html', 'file', 'green', None),
           (1, 'assets/', 'dir', 'green', None),
           (2, 'index-B7xQ2k.js', 'file', 'green', None),
           (2, 'index-D4e5F6.css', 'file', 'green', None)]
    s = tree(s, 608, 172, out, step=24)
    for i, (label, c) in enumerate((('HTML', 'slate'), ('JS', 'indigo'), ('CSS', 'rose'))):
        soft, border, strong = FAM[c]
        x = 612 + i * 96
        s += (f'  <rect x="{x}" y="328" width="84" height="56" rx="10" fill="#FFFFFF" stroke="{border}" stroke-width="1.75"/>'
              f'<text x="{x+42}" y="356" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="{strong}">{label}</text>\n')
    s += '  <text x="604" y="410" font-size="12" fill="#454C61" data-fit="290">Archivos estáticos: cualquier navegador</text>\n'
    s += '  <text x="604" y="428" font-size="12" fill="#454C61" data-fit="290">los ejecuta tal cual, sin Node.</text>\n'
    return s + tail(h, 'Node y Vite solo existen en tu máquina. El usuario recibe dist/: nunca ve tu JSX ni node_modules.')


FIGS['nodeDevDist'] = node_dev_dist


def node_npm():
    fid, h = 'nodeNpm', 500
    s = head(fid, h, 'npm: las librerías se declaran y se descargan', 'npm: las librerías se declaran y se descargan',
             'package.json dice qué necesita el proyecto. npm install lo trae a node_modules.',
             'A la izquierda package.json con sus dependencias: react, react-dom, @mui/material y axios. Una flecha con '
             'el comando npm install lleva a node_modules, que tiene una carpeta por librería más las dependencias de '
             'cada una. Abajo, App.jsx importa useState desde react.',
             colors=('amber',))
    lines = ['{', '  "name": "mi-app",', '  "scripts": {', '    "dev": "vite",', '    "build": "vite build"', '  },',
             '  "dependencies": {', '    "react": "^19.2.0",', '    "react-dom": "^19.2.0",',
             '    "@mui/material": "^7.3.0",', '    "axios": "^1.13.0"', '  }', '}']
    s += pane(48, 112, 360, 48 + 12 * 19 + 16, 'package.json', lines, marks=[(c, None, 0, '#F0C572') for c in (7, 8, 9, 10)])
    s += '  <path class="ar-amber" d="M412,230 H548"/>\n  ' + pill(480, 212, 'npm install', 'amber', fs=11.5) + '\n'
    soft, border, strong = FAM['amber']
    s += (f'  <rect x="560" y="112" width="352" height="200" rx="14" fill="{soft}" stroke="{border}" stroke-width="1.75"/>'
          f'<text class="h" x="580" y="140" fill="{strong}">NODE_MODULES/</text>\n')
    for i, name in enumerate(['react', 'react-dom', '@mui/material', 'axios']):
        x, y = 580 + (i % 2) * 164, 158 + (i // 2) * 52
        s += (f'  <rect x="{x}" y="{y}" width="152" height="40" rx="9" fill="#FFFFFF" stroke="{border}" stroke-width="1.5"/>'
              + folder(x + 14, y + 20, 'amber') +
              f'<text class="mono" x="{x+42}" y="{y+20}" dy="0.35em" font-size="12.5" font-weight="700" fill="{strong}" data-fit="104">{esc(name)}</text>\n')
    s += '  <text x="580" y="290" font-size="12" fill="#454C61" data-fit="320">+ las librerías de las que dependen ellas</text>\n'
    code = esc("import { useState } from 'react';")
    s += (f'  <text x="48" y="{h-60}" font-size="13" fill="#454C61">Y en tu código:</text>'
          f'<text class="mono" x="156" y="{h-60}" font-size="13" fill="#161A26" font-weight="700">{code}</text>\n')
    return s + tail(h, 'node_modules no se sube a git: se vuelve a crear con npm install a partir de package.json.')


FIGS['nodeNpm'] = node_npm


def lane_box(x, y, w, h, color, label, sub, hero=False):
    soft, border, strong = FAM[color]
    fill, ink, subink = (strong, '#FFFFFF', '#FFFFFF') if hero else (soft, strong, '#454C61')
    return (f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{border}" stroke-width="1.75"/>'
            f'<text x="{x+w/2:.0f}" y="{y+26}" dy="0.35em" text-anchor="middle" font-size="14" font-weight="700" fill="{ink}" '
            f'data-fit="{w-16}">{esc(label)}</text>'
            f'<text class="mono" x="{x+w/2:.0f}" y="{y+50}" dy="0.35em" text-anchor="middle" font-size="11.5" fill="{subink}" '
            f'data-fit="{w-16}">{esc(sub)}</text>\n')


def chips(x, y, names, color, crossed=()):
    soft, border, strong = FAM[color]
    s = ''
    for name in names:
        w = len(name) * 7.2 + 20
        dead = name in crossed
        deco = ' text-decoration="line-through"' if dead else ''
        s += (f'  <rect x="{x:.0f}" y="{y}" width="{w:.0f}" height="22" rx="11" fill="{"#FFFFFF" if dead else soft}" '
              f'stroke="{"#C4CBD8" if dead else border}" stroke-width="1.25"/>'
              f'<text class="mono" x="{x + w/2:.0f}" y="{y+11}" dy="0.35em" text-anchor="middle" font-size="11.5" '
              f'fill="{"#9AA3B5" if dead else strong}" font-weight="700"'
              f'{deco}>{esc(name)}</text>\n')
        x += w + 8
    return s


def node_runtimes():
    fid, h = 'nodeRuntimes', 500
    s = head(fid, h, 'Dos runtimes para el mismo JavaScript', 'Dos runtimes para el mismo JavaScript',
             'Un runtime es el programa que ejecuta tu JS. El navegador es uno; Node es otro.',
             'Dos filas. Arriba, en el navegador: el proyecto React pasa por Vite con npm run build, sale la carpeta dist, '
             'se publica en un servidor web y el navegador del usuario la ejecuta con su motor V8; ahí existen document, '
             'window y localStorage. Abajo, en Node: el archivo server.js se ejecuta directo con node server.js, sin '
             'bundler, en el motor V8 de Node, que escucha en el puerto 3000 y responde peticiones HTTP; ahí existen fs, '
             'http y process, pero no document.',
             colors=('indigo', 'teal'))
    xs, w, bh = [48, 276, 504, 732], 180, 72
    y1 = 148
    s += '  <text class="h" x="48" y="132" fill="#4453C9">EN EL NAVEGADOR · EL FRONTEND</text>\n'
    lane1 = [('indigo', 'Proyecto React', 'src/ · JSX'), ('violet', 'Vite', 'npm run build'),
             ('green', 'dist/', 'HTML · JS · CSS'), ('indigo', 'Navegador', 'motor V8 de Chrome')]
    for i, (x, (c, label, sub)) in enumerate(zip(xs, lane1)):
        s += lane_box(x, y1, w, bh, c, label, sub, hero=(i == 3))
    for i in range(3):
        s += f'  <path class="ar-indigo" d="M{xs[i]+w+4},{y1+bh/2} H{xs[i+1]-4}"/>\n'
    s += f'  <text x="{xs[3]}" y="{y1+bh+24}" font-size="12" fill="#454C61">Tiene:</text>\n'
    s += chips(xs[3] + 44, y1 + bh + 12, ['document', 'window'], 'indigo')

    y2 = 324
    s += '  <text class="h" x="48" y="308" fill="#0F8478">EN NODE · EL BACKEND · SIN BUNDLER</text>\n'
    lane2 = [('teal', 'server.js', 'JavaScript'), ('slate', 'Terminal', 'node server.js'),
             ('teal', 'Node.js', 'motor V8, sin navegador'), ('amber', 'Responde HTTP', 'localhost:3000')]
    for i, (x, (c, label, sub)) in enumerate(zip(xs, lane2)):
        s += lane_box(x, y2, w, bh, c, label, sub, hero=(i == 2))
    for i in range(3):
        s += f'  <path class="ar-teal" d="M{xs[i]+w+4},{y2+bh/2} H{xs[i+1]-4}"/>\n'
    s += f'  <text x="{xs[2]}" y="{y2+bh+24}" font-size="12" fill="#454C61">Tiene:</text>\n'
    s += chips(xs[2] + 44, y2 + bh + 12, ['fs', 'http', 'process', 'document'], 'teal', crossed=('document',))
    return s + tail(h, 'Con Node, JavaScript también sirve para backends: lo mismo que hicieron con Spring, en otro lenguaje.')


FIGS['nodeRuntimes'] = node_runtimes


def setup_consola():
    return frame(dict(
        id='setupConsola',
        title='Del cero a la app corriendo',
        title_plain='Del cero a la app corriendo',
        desc='Terminal con la secuencia completa. node -v y npm -v muestran las versiones instaladas. '
             'npm create vite@latest mi-app con la plantilla react crea el proyecto. cd mi-app entra a la carpeta, '
             'npm install descarga las dependencias y npm run dev arranca el servidor en http://localhost:5173.',
        sub='Cuatro pasos: verificar Node, crear el proyecto, instalar dependencias y arrancar.',
        term_title='Terminal',
        lines=[('P', 'node -v', '~'), ('O', 'v24.11.1'), ('P', 'npm -v', '~'), ('O', '11.6.2'), ('B', ''),
               ('P', 'npm create vite@latest mi-app -- --template react', '~'),
               ('D', 'Scaffolding project in ~/mi-app...'), ('K', 'Done.'), ('B', ''),
               ('P', 'cd mi-app', '~'), ('P', 'npm install', 'mi-app'), ('D', 'added 152 packages in 9s'), ('B', ''),
               ('P', 'npm run dev', 'mi-app'), ('O', '  VITE v7.2.2  ready in 312 ms'),
               ('K', '  ➜  Local:   http://localhost:5173/')],
        rings=[(0, 3, 7, 1), (5, 3, 50, 2), (10, 8, 11, 3), (13, 8, 11, 4)],
        foot='El servidor sigue corriendo mientras programas: cada vez que guardas, la página se actualiza sola.',
    ))


FIGS['setupConsola'] = setup_consola


def setup_estructura():
    rows = [(0, 'mi-app/', 'dir', 'slate', None),
            (1, 'node_modules/', 'dir', 'amber', ('amber', 'Las librerías.', 'No se tocan ni se suben a git.')),
            (1, 'public/', 'dir', 'slate', ('slate', 'Estáticos.', 'Se copian tal cual a dist/.')),
            (1, 'src/', 'dir', 'indigo', ('indigo', 'Tu código.', 'Aquí trabajas casi siempre.')),
            (2, 'assets/', 'dir', 'indigo', None),
            (2, 'App.css', 'file', 'indigo', None),
            (2, 'App.jsx', 'file', 'indigo', ('violet', 'App.jsx:', 'el componente raíz.')),
            (2, 'index.css', 'file', 'indigo', None),
            (2, 'main.jsx', 'file', 'indigo', ('violet', 'main.jsx:', 'conecta React con el HTML.')),
            (1, 'index.html', 'file', 'slate', ('teal', 'index.html:', 'tiene <div id="root">.')),
            (1, 'package.json', 'file', 'slate', ('amber', 'package.json:', 'dependencias y scripts.')),
            (1, 'vite.config.js', 'file', 'slate', None),
            (1, '.gitignore', 'file', 'slate', None)]
    step, top, x0, ind = 30, 124, 64, 26
    h = top + len(rows) * step + 40
    fid = 'setupEstructura'
    s = head(fid, h, 'Lo que crea Vite', 'Lo que crea Vite',
             'Una carpeta por proyecto. Lo tuyo va en src/; lo demás es configuración.',
             'Árbol de carpetas de mi-app: node_modules con las librerías, public con archivos estáticos, src con assets, '
             'App.css, App.jsx que es el componente raíz, index.css y main.jsx que conecta React con el HTML. En la raíz '
             'index.html, que tiene el div con id root, package.json con dependencias y scripts, vite.config.js y .gitignore.')
    last = {}
    for i, (d, name, kind, color, call) in enumerate(rows):
        y = top + i * step
        x = x0 + d * ind
        if d > 0:
            px = x0 + (d - 1) * ind + 10
            py = last.get(d - 1, y)
            s += f'  <path d="M{px},{py+9} V{y} H{x-4}" fill="none" stroke="#C4CBD8" stroke-width="1.3"/>\n'
        last[d] = y
        for deeper in [k for k in last if k > d]:
            del last[deeper]
        strong = FAM[color][2]
        icon = folder(x, y, color) if kind == 'dir' else file_icon(x, y)
        weight = '700' if kind == 'dir' or call else '400'
        fill = strong if kind == 'dir' and color != 'slate' else '#161A26'
        s += (f'  {icon}<text class="mono" x="{x+28}" y="{y}" dy="0.35em" font-size="13.5" font-weight="{weight}" '
              f'fill="{fill}">{esc(name)}</text>\n')
        if call:
            c, bold, text = call
            soft, border, cs = FAM[c]
            tx = x + 28 + len(name) * 8.1 + 10
            s += f'  <path d="M{tx},{y} H520" fill="none" stroke="{border}" stroke-width="1.5" stroke-dasharray="4 4"/>\n'
            s += (f'  <rect x="520" y="{y-14}" width="392" height="28" rx="9" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
                  f'<text x="536" y="{y}" dy="0.35em" font-size="13" fill="#454C61" data-fit="360">'
                  f'<tspan font-weight="700" fill="{cs}">{esc(bold)}</tspan> {esc(text)}</text>\n')
    return s + tail(h, 'Al hacer npm run build aparece una carpeta más, dist/: la app empaquetada.')


FIGS['setupEstructura'] = setup_estructura


def setup_arranque():
    fid, h = 'setupArranque', 370
    s = head(fid, h, 'Por dónde arranca una app de React', 'Por dónde arranca una app de React',
             'index.html carga main.jsx; main.jsx monta App dentro del div con id root.',
             'Tres archivos en fila. index.html tiene un div vacío con id root y un script que carga /src/main.jsx. '
             'main.jsx busca ese div con document.getElementById y le dice a React que dibuje App ahí con createRoot y render. '
             'App.jsx define la función App, que devuelve el JSX que se ve en pantalla.',
             colors=('violet',))
    a = ['<body>', '  <div id="root"></div>', '  <script type="module"', '    src="/src/main.jsx">',
         '  </script>', '</body>']
    b = ["import { createRoot }", "  from 'react-dom/client';", "import App from './App.jsx';", '',
         'createRoot(', "  document.getElementById('root')", ').render(<App />);']
    c = ['function App() {', '  return (', '    <h1>Hola, React</h1>', '  );', '}', '', 'export default App;']
    ph = 48 + 7 * 19 + 14
    s += pane(48, 112, 264, ph, 'index.html', a, marks=[(1, 2, 21, '#86D3CA'), (3, 4, 20, '#C9A6EE')])
    s += pane(348, 112, 264, ph, 'src/main.jsx', b, marks=[(5, 2, 31, '#86D3CA'), (6, 9, 7, '#C9A6EE')])
    s += pane(648, 112, 264, ph, 'src/App.jsx', c, marks=[(0, 0, 14, '#C9A6EE')])
    s += '  <path class="ar-violet" d="M314,190 H344"/><path class="ar-violet" d="M614,190 H644"/>\n'
    return s + tail(h, 'Todo lo que construyas vive dentro de <App />, y App vive dentro de <div id="root">.'.replace('<', '&lt;').replace('>', '&gt;'))


FIGS['setupArranque'] = setup_arranque


def props_flujo():
    fid, h = 'propsFlujo', 470
    s = head(fid, h, 'Las props bajan del padre al hijo', 'Las props bajan del padre al hijo',
             'App decide qué mostrar y se lo pasa a Header como atributos. Header solo los lee.',
             'A la izquierda App.jsx usa Header con dos atributos, title y subtitle. Debajo, React los junta en un '
             'objeto props con title igual a Computación 2 y subtitle igual a Introducción a React. A la derecha '
             'Header.jsx recibe ese objeto, lo desestructura en sus parámetros y pone cada valor en su JSX.',
             colors=('amber',))
    a = ['function App() {', '  return (', '    <Header', '      title="Computación 2"',
         '      subtitle="Introducción a React"', '    />', '  );', '}']
    b = ['function Header({ title, subtitle }) {', '  return (', '    <header>', '      <h1>{title}</h1>',
         '      <p>{subtitle}</p>', '    </header>', '  );', '}']
    ph = 48 + 8 * 19 + 8
    s += pane(48, 112, 400, ph, 'App.jsx · el padre', a, marks=[(3, 6, 21, '#F0C572'), (4, 6, 31, '#F0C572')])
    s += pane(512, 112, 400, ph, 'Header.jsx · el hijo', b, marks=[(0, 16, 21, '#F0C572'), (3, 10, 7, '#F0C572'), (4, 9, 10, '#F0C572')])
    soft, border, strong = FAM['amber']
    oy = 112 + ph + 36
    props = esc('props = { title: "Computación 2", subtitle: "Introducción a React" }')
    s += (f'  <rect x="160" y="{oy}" width="640" height="44" rx="12" fill="{soft}" stroke="{border}" stroke-width="1.75"/>'
          f'<text class="mono" x="480" y="{oy+22}" dy="0.35em" text-anchor="middle" font-size="13" font-weight="700" fill="{strong}" data-fit="620">'
          f'{props}</text>\n')
    s += (f'  <path class="ar-amber" d="M248,{112+ph+4} V{oy-4}"/>'
          f'<path class="ar-amber" d="M712,{oy-2} V{112+ph+6}"/>\n')
    return s + tail(h, 'Mismo componente, datos distintos: <Header title="Semana 14" … /> dibuja otro encabezado sin tocar Header.'
                    .replace('<', '&lt;').replace('>', '&gt;'))


FIGS['propsFlujo'] = props_flujo


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--inject':
        done = set()
        for name in LESSONS:
            path = ROOT / 'content' / name
            text = path.read_text(encoding='utf-8')

            def swap(m):
                done.add(m.group(1))
                return '```svg\n' + FIGS[m.group(1)]() + '```'
            path.write_text(re.sub(r'```svg\n<svg id="(\w+)".*?```', swap, text, flags=re.S), encoding='utf-8')
        print('inyectadas:', len(done), '· sin usar:', sorted(set(FIGS) - done) or 'ninguna')
        return
    out = pathlib.Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    for fid, fn in FIGS.items():
        (out / f'{fid}.svg').write_text(fn(), encoding='utf-8')
    print(len(FIGS), 'figuras en', out)


if __name__ == '__main__':
    main()
