"""Figuras SVG de «LLMs, Agentes y MCP Servers» (0046) y «Skills en Antigravity CLI» (0047).

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
LESSONS = ['lessonIA0.md', 'lessonIA2.md']
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


def folder(x, y, color):
    soft, border, strong = FAM[color]
    return (f'<path d="M{x},{y-7} h7 l3,3 h10 v12 h-20 Z" fill="{soft}" stroke="{strong}" stroke-width="1.4" '
            f'stroke-linejoin="round"/>')


def file_icon(x, y):
    return (f'<path d="M{x+2},{y-8} h9 l5,5 v12 h-14 Z" fill="#FFFFFF" stroke="#79809A" stroke-width="1.3" '
            f'stroke-linejoin="round"/>')


def ia_skills_carpetas():
    rows = [(0, '262WebApp6/', 'dir', 'slate', None),
            (1, '.agents/', 'dir', 'slate', None),
            (2, 'skills/', 'dir', 'slate', None),
            (3, 'spec-writer/', 'dir', 'violet', ('violet', 'spec-writer.', 'Escribe la spec antes del código.')),
            (4, 'SKILL.md', 'file', 'violet', None),
            (4, 'references/', 'dir', 'violet', None),
            (5, 'plantilla.md', 'file', 'violet', None),
            (3, 'api-creator/', 'dir', 'teal', ('teal', 'api-creator.', 'Crea endpoints con DTO y publicId.')),
            (4, 'SKILL.md', 'file', 'teal', None),
            (4, 'references/', 'dir', 'teal', None),
            (5, 'convenciones.md', 'file', 'teal', None),
            (5, 'manifiesto.md', 'file', 'teal', None),
            (3, 'api-tester/', 'dir', 'amber', ('amber', 'api-tester.', 'Prueba la API con scripts de curl.')),
            (4, 'SKILL.md', 'file', 'amber', None),
            (4, 'assets/', 'dir', 'amber', None),
            (5, 'ejemplo.sh', 'file', 'amber', None),
            (4, 'references/', 'dir', 'amber', None),
            (5, 'casos.md', 'file', 'amber', None),
            (1, 'src/', 'dir', 'slate', None),
            (1, 'pom.xml', 'file', 'slate', None)]
    step, top, x0, ind = 30, 124, 64, 26
    h = top + len(rows) * step + 40
    s = head('iaSkillsCarpetas', h, 'Las skills viven dentro del proyecto', 'Las skills viven dentro del proyecto',
             'Una carpeta por skill en .agents/skills/. El nombre de la carpeta es el nombre de la skill.',
             'Árbol de carpetas de 262WebApp6. Dentro de .agents/skills hay tres carpetas. spec-writer tiene SKILL.md y '
             'references/plantilla.md. api-creator tiene SKILL.md y references con convenciones.md y manifiesto.md. '
             'api-tester tiene SKILL.md, assets/ejemplo.sh y references/casos.md. Al lado de .agents siguen src y pom.xml.')
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
        dim = name in ('src/', 'pom.xml')
        icon = folder(x, y, color) if kind == 'dir' else file_icon(x, y)
        weight = '700' if kind == 'dir' or name == 'SKILL.md' else '400'
        fill = '#9AA3B5' if dim else (strong if kind == 'dir' and color != 'slate' else '#161A26')
        s += (f'  {icon}<text class="mono" x="{x+28}" y="{y}" dy="0.35em" font-size="13.5" font-weight="{weight}" '
              f'fill="{fill}">{name}</text>\n')
        if call:
            c, bold, text = call
            soft, border, cs = FAM[c]
            tx = x + 28 + len(name) * 8.1 + 10
            s += f'  <path d="M{tx},{y} H560" fill="none" stroke="{border}" stroke-width="1.5" stroke-dasharray="4 4"/>\n'
            s += (f'  <rect x="560" y="{y-17}" width="352" height="34" rx="9" fill="{soft}" stroke="{border}" stroke-width="1.5"/>'
                  f'<text x="576" y="{y}" dy="0.35em" font-size="13" fill="#454C61" data-fit="320">'
                  f'<tspan font-weight="700" fill="{cs}">{bold}</tspan> {text}</text>\n')
    return s + tail(h, 'Solo archivos de texto: se crean a mano y se pega su contenido. La skill no instala nada.')


FIGS['iaSkillsCarpetas'] = ia_skills_carpetas


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
