"""Figuras SVG de «LLMs, Agentes y MCP Servers» (0046).

    python3 tools/ia_figuras.py <carpeta>     escribe un .svg por figura, para revisarlas
    python3 tools/ia_figuras.py --inject      reemplaza cada bloque ```svg de la lección
                                              por la figura con el mismo id

No editar los SVG dentro del Markdown: se cambia este script y se vuelve a inyectar.
Usa los mismos tokens que tools/security_figuras.py. Lo que suman skills y MCP no va aquí:
es el diagrama interactivo agent-stack (classnotesapp/src/components/interactive/agentSims.js).
"""

import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from security_figuras import FAM, box, head, tail  # noqa: E402
from rest_figuras import pill  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
LESSONS = ['lessonIA0.md']
FIGS = {}


def ia_agente():
    fid, h = 'iaAgente', 400
    s = head(fid, h, 'Un agente en consola es un LLM con un tool system', 'Un agente en consola es un LLM con un tool system',
             'El LLM solo produce texto. El tool system es el que lee, busca, edita y ejecuta en tu proyecto.',
             'A la izquierda el LLM, que predice texto. En el centro, en un recuadro punteado, el tool system con cuatro '
             'tools: read para leer archivos, grep para buscar en el código, edit para editar archivos y bash para ejecutar '
             'comandos. A la derecha tu proyecto, con sus archivos y su terminal. El LLM pide una tool, el tool system la '
             'ejecuta sobre el proyecto y le devuelve el resultado; el ciclo se repite hasta que el LLM responde.',
             colors=('violet', 'green', 'slate'))
    vs, vb, vstrong = FAM['violet']
    s += (f'  <rect x="48" y="160" width="208" height="112" rx="14" fill="{vstrong}"/>'
          f'<text x="152" y="204" dy="0.35em" text-anchor="middle" font-size="24" font-weight="700" fill="#FFFFFF">LLM</text>'
          f'<text x="152" y="236" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#F4EBFF">predice el siguiente texto</text>\n')
    ins, inb, instrong = FAM['indigo']
    s += (f'  <rect x="356" y="112" width="248" height="232" rx="14" fill="{ins}" stroke="{inb}" stroke-width="1.75" stroke-dasharray="6 5"/>'
          f'<text class="h" x="480" y="138" text-anchor="middle" fill="{instrong}">TOOL SYSTEM</text>\n')
    for i, (name, what) in enumerate((('read', 'Leer archivos'), ('grep', 'Buscar en el código'),
                                      ('edit', 'Editar archivos'), ('bash', 'Ejecutar comandos'))):
        y = 154 + i * 46
        s += (f'  <rect x="376" y="{y}" width="208" height="36" rx="9" fill="#FFFFFF" stroke="{inb}" stroke-width="1.5"/>'
              f'<text class="mono" x="392" y="{y+18}" dy="0.35em" font-size="13.5" font-weight="700" fill="{instrong}">{name}</text>'
              f'<text x="568" y="{y+18}" dy="0.35em" text-anchor="end" font-size="12.5" fill="#454C61">{what}</text>\n')
    ts, tb, tstrong = FAM['teal']
    s += (f'  <path d="M712,176 a8,8 0 0 1 8,-8 h52 l12,14 h112 a8,8 0 0 1 8,8 v86 a8,8 0 0 1 -8,8 h-176 a8,8 0 0 1 -8,-8 Z" '
          f'fill="{ts}" stroke="{tb}" stroke-width="1.75"/>'
          f'<text x="808" y="218" dy="0.35em" text-anchor="middle" font-size="16" font-weight="700" fill="{tstrong}">Tu proyecto</text>'
          f'<text x="808" y="242" dy="0.35em" text-anchor="middle" font-size="12.5" fill="#454C61">archivos y terminal</text>\n')
    s += '  <path class="ar-violet" d="M260,196 H350"/><path class="ar-green" d="M350,240 H260"/>\n'
    s += '  ' + pill(305, 178, 'pide read(…)', 'violet', fs=10.5) + '\n'
    s += f'  <text x="305" y="262" text-anchor="middle" font-size="12" font-weight="600" fill="{FAM["green"][2]}">resultado</text>\n'
    s += '  <path class="ar-slate" d="M608,212 H704"/><path class="ar-slate" d="M704,236 H608"/>\n'
    s += '  <text x="656" y="200" text-anchor="middle" font-size="12" fill="#79809A">ejecuta</text>\n'
    return s + tail(h, 'Pedir una tool y recibir el resultado se repite las veces que haga falta. Cuando ya sabe lo suficiente, el LLM responde.')


FIGS['iaAgente'] = ia_agente


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
