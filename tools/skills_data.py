"""Copia las skills de tools/skills/ al diagrama interactivo skill-files (lección 0047).

    python3 tools/skills_data.py      reescribe el bloque SKILLS de skillSims.js

Las skills se editan en tools/skills/<nombre>/ y se vuelve a correr este script. El orden de
SKILLS y los textos de cada pestaña (resumen, pedidos de ejemplo, lo que escribe) viven aquí.
"""

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'tools' / 'skills'
SIM = ROOT / 'classnotesapp' / 'src' / 'components' / 'interactive' / 'skillSims.js'

META = [
    dict(name='api-creator', color='#0F8478', soft='#E3F6F3',
         summary='Revisa qué entidades tienen endpoints y cuáles no, y crea los que faltan con DTO, mapper '
                 'de MapStruct y publicId. Deja el manifiesto de la API y un histórico de lo que hizo.',
         prompts=['Revisa la API y dime qué entidades no tienen endpoints',
                  'Expón Student con lectura y creación'],
         writes=['apidev.md', 'apidevlog.md', 'api/dto/', 'api/mapper/', 'api/']),
    dict(name='api-tester', color='#A96C05', soft='#FFF3DC',
         summary='Escribe una batería de pruebas con curl por cada recurso de la API, con casos positivos y '
                 'negativos, y deja test.sh para correrla. Anota la cobertura y cada falla. Nunca corrige el código.',
         prompts=['Escribe y corre las pruebas de la API'],
         writes=['tests/api/<recurso>.sh', 'test.sh', 'testresults.md']),
    dict(name='spec-writer', color='#7439B8', soft='#F4EBFF',
         summary='Convierte un pedido vago en una spec: requisitos, criterios de aceptación que se responden '
                 'con sí o no, endpoints con sus errores y tareas. No escribe código.',
         prompts=['Escribe la spec para matricular un estudiante en un curso desde la API'],
         writes=['docs/specs/<nombre>.md']),
]


def files(name):
    base = SRC / name
    paths = sorted((p for p in base.rglob('*') if p.is_file()),
                   key=lambda p: (p.name != 'SKILL.md', str(p.relative_to(base))))
    return [dict(path=str(p.relative_to(base)), content=p.read_text(encoding='utf-8')) for p in paths]


def main():
    skills = [dict(m, files=files(m['name'])) for m in META]
    block = '// <skills-data>\nexport const SKILLS = ' + json.dumps(skills, ensure_ascii=False, indent=2) + ';\n// </skills-data>'
    text = SIM.read_text(encoding='utf-8')
    SIM.write_text(re.sub(r'// <skills-data>.*?// </skills-data>', lambda _: block, text, flags=re.S), encoding='utf-8')
    print('skills:', ', '.join(f"{s['name']} ({len(s['files'])})" for s in skills))


if __name__ == '__main__':
    main()
