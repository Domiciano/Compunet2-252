import { describe, it, expect } from 'vitest';
import { parseRosterMarkdown, normalizeCodigo, normalizeName, nameSetKey } from './rosterParser';

const SAMPLE = `| Código | Nombre |
|---------|---------|
| A00406656 | ANDRES FELIPE RIVAS OSPINA |
| A00403756 | DAYANNA FERNANDEZ NUÑEZ |
| A00404256 | XILENA VIDAL RAMIREZ |`;

describe('parseRosterMarkdown', () => {
  it('lee la tabla de la universidad sin el encabezado ni el separador', () => {
    expect(parseRosterMarkdown(SAMPLE)).toEqual([
      { codigo: 'A00406656', nombre: 'ANDRES FELIPE RIVAS OSPINA' },
      { codigo: 'A00403756', nombre: 'DAYANNA FERNANDEZ NUÑEZ' },
      { codigo: 'A00404256', nombre: 'XILENA VIDAL RAMIREZ' },
    ]);
  });

  it('ignora todo lo que no sea fila de tabla', () => {
    const md = `# Lista 2026-2\n\nNota suelta.\n\n${SAMPLE}\n\nOtro párrafo.`;
    expect(parseRosterMarkdown(md)).toHaveLength(3);
  });

  it('no cuenta dos veces a la misma persona', () => {
    const md = `${SAMPLE}\n| A00406656 | ANDRES FELIPE RIVAS OSPINA |`;
    expect(parseRosterMarkdown(md)).toHaveLength(3);
  });

  it('acepta una lista de una sola columna como nombres', () => {
    expect(parseRosterMarkdown('| Nombre |\n|---|\n| ANA GOMEZ |')).toEqual([
      { codigo: '', nombre: 'ANA GOMEZ' },
    ]);
  });

  it('descarta las tablas cuya primera columna no es el código', () => {
    const md = `${SAMPLE}\n\n| Nombre | Correo | Rol |\n|---|---|---|\n| Domiciano Rincón | domi@icesi.edu.co | profesor |`;
    const entries = parseRosterMarkdown(md);
    expect(entries).toHaveLength(3);
    expect(entries.map((e) => e.codigo)).not.toContain('Domiciano Rincón');
  });

  it('devuelve una lista vacía si no hay tabla', () => {
    expect(parseRosterMarkdown('sin tabla aquí')).toEqual([]);
    expect(parseRosterMarkdown('')).toEqual([]);
    expect(parseRosterMarkdown(null)).toEqual([]);
  });

  it('tolera filas con celdas vacías al final', () => {
    expect(parseRosterMarkdown('| A001 | ANA GOMEZ |  |')).toEqual([
      { codigo: 'A001', nombre: 'ANA GOMEZ' },
    ]);
  });
});

describe('claves de comparación', () => {
  it('normalizeCodigo iguala mayúsculas y espacios', () => {
    expect(normalizeCodigo(' a00406656 ')).toBe('A00406656');
  });

  it('normalizeName quita tildes, puntuación y mayúsculas', () => {
    expect(normalizeName('Dayanna Fernández Núñez')).toBe('DAYANNA FERNANDEZ NUNEZ');
    expect(normalizeName('  Juan   Pablo  Pino-Bastidas ')).toBe('JUAN PABLO PINO BASTIDAS');
  });

  it('nameSetKey es insensible al orden de los apellidos', () => {
    expect(nameSetKey('ANDRES FELIPE RIVAS OSPINA')).toBe(nameSetKey('Rivas Ospina, Andrés Felipe'));
  });
});
