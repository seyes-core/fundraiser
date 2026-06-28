import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-in-production';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev-secret-change-me';
const COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

// Simple HMAC-based session token (no external JWT library needed)
async function createToken(payload: object): Promise<string> {
  const data = JSON.stringify({ ...payload, exp: Date.now() + SESSION_DURATION });
  const encoded = Buffer.from(data).toString('base64url');
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(ADMIN_JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encoded));
  const sigB64 = Buffer.from(sig).toString('base64url');
  return `${encoded}.${sigB64}`;
}

async function verifyToken(token: string): Promise<object | null> {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sigB64] = parts;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(ADMIN_JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const sigBytes = Buffer.from(sigB64, 'base64url');
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(encoded));
  if (!valid) return null;
  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
  if (Date.now() > payload.exp) return null;
  return payload;
}

export async function adminLogin(password: string): Promise<string | null> {
  if (password !== ADMIN_PASSWORD) return null;
  return createToken({ role: 'admin' });
}

export async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie) return false;
  const payload = await verifyToken(cookie.value);
  return payload !== null;
}

export function setAdminCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60,
    path: '/',
  });
}

export function clearAdminCookie(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAME);
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
