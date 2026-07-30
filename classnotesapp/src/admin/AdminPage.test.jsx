import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const authState = { configured: true, isTeacher: true, user: { uid: 'p1' } };
vi.mock('@/auth/AuthContext', () => ({ useAuth: () => authState }));

const fetchStudents = vi.fn();
const fetchRoster = vi.fn();
vi.mock('./adminData', () => ({
  fetchStudents: (...a) => fetchStudents(...a),
  fetchRoster: (...a) => fetchRoster(...a),
  saveRoster: vi.fn(),
}));

// El módulo real inicializa Firebase al importarse.
vi.mock('@/auth/firebaseConfig', () => ({ courseId: 'compunet2', isFirebaseConfigured: true }));

const navigate = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => navigate }));

const { default: AdminPage } = await import('./AdminPage');
const { ThemeProvider } = await import('@/theme/ThemeContext');

const mount = () => render(<ThemeProvider><AdminPage /></ThemeProvider>);

describe('AdminPage', () => {
  beforeEach(() => {
    Object.assign(authState, { configured: true, isTeacher: true, user: { uid: 'p1' } });
    fetchStudents.mockReset().mockResolvedValue([
      { uid: 'u1', codigo: 'A00406656', fullName: 'Andrés Rivas', email: 'arivas@icesi.edu.co', githubUsername: 'arivas', role: 'estudiante' },
      { uid: 'p1', fullName: 'Domiciano Rincón', email: 'domi@icesi.edu.co', role: 'profesor' },
    ]);
    fetchRoster.mockReset().mockResolvedValue({
      entries: [
        { codigo: 'A00406656', nombre: 'ANDRES FELIPE RIVAS OSPINA' },
        { codigo: 'A00403756', nombre: 'DAYANNA FERNANDEZ NUÑEZ' },
      ],
      label: '262.md',
      updatedAt: new Date(2026, 6, 30),
    });
  });

  it('sin el claim de profesor no consulta nada y explica por qué', async () => {
    authState.isTeacher = false;
    mount();
    expect(await screen.findByText(/solo para el profesor/i)).toBeTruthy();
    expect(fetchStudents).not.toHaveBeenCalled();
  });

  it('cruza la lista con los perfiles y marca a quien no ha ingresado', async () => {
    mount();
    expect(await screen.findByText('ANDRES FELIPE RIVAS OSPINA')).toBeTruthy();
    expect(screen.getByText('arivas@icesi.edu.co')).toBeTruthy();
    expect(screen.getByText('arivas')).toBeTruthy();
    expect(screen.getByText('DAYANNA FERNANDEZ NUÑEZ')).toBeTruthy();
    expect(screen.getByText('Sin ingresar')).toBeTruthy();
    expect(screen.getByText('Registrado')).toBeTruthy();
  });

  it('resume los conteos y saca al profesor a "fuera de la lista"', async () => {
    mount();
    await screen.findByText('ANDRES FELIPE RIVAS OSPINA');
    expect(screen.getByText('2 en lista')).toBeTruthy();
    expect(screen.getByText('1 con cuenta')).toBeTruthy();
    expect(screen.getByText('1 sin ingresar')).toBeTruthy();
    expect(screen.getByText('Fuera de la lista (1)')).toBeTruthy();
    expect(screen.getByText('Domiciano Rincón')).toBeTruthy();
  });

  it('invita a cargar la lista cuando no hay ninguna', async () => {
    fetchRoster.mockResolvedValue(null);
    mount();
    expect(await screen.findByText(/Todavía no hay lista de clase cargada/i)).toBeTruthy();
  });

  it('traduce el rechazo de Firestore a la causa real: falta el claim', async () => {
    fetchStudents.mockRejectedValue(Object.assign(new Error('nope'), { code: 'permission-denied' }));
    mount();
    await waitFor(() => expect(screen.getByText(/custom claim/i)).toBeTruthy());
  });
});
