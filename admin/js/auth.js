/* ================================================================
   AUTH — login, logout, session guard
================================================================ */
import db from './supabase-client.js';

/** Redirige al login si no hay sesión activa */
export async function requireAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.href = '/admin/login.html';
    return null;
  }
  return session;
}

/** Inicia sesión con email y contraseña */
export async function login(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Cierra sesión */
export async function logout() {
  await db.auth.signOut();
  window.location.href = '/admin/login.html';
}

/** Devuelve el usuario actual */
export async function getCurrentUser() {
  const { data: { user } } = await db.auth.getUser();
  return user;
}
