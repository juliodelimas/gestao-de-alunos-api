import ApiError from './ApiError.js';

export function normalizeEmail(value) {
  if (typeof value !== 'string') throw new ApiError(400, 'E-mail inválido.');
  const email = value.trim().toLowerCase();
  const parts = email.split('@');
  const [local, domain] = parts;
  const labels = domain?.split('.') || [];
  if (email.length > 254 || parts.length !== 2 || !local || local.length > 64 ||
      !/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local) || local.startsWith('.') ||
      local.endsWith('.') || local.includes('..') || labels.length < 2 ||
      labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) {
    throw new ApiError(400, 'E-mail inválido.');
  }
  return email;
}

export function validatePassword(value) {
  if (typeof value !== 'string' || !value || Buffer.byteLength(value, 'utf8') > 72) {
    throw new ApiError(400, 'A senha deve conter de 1 a 72 bytes UTF-8.');
  }
  return value;
}

// Match legacy case/outer spaces without modifying existing records.
export function emailPattern(email) {
  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^\\s*${escaped}\\s*$`, 'i');
}
