import { testCredentials } from '../config.js';

export async function loginAsAdmin(client, credentials = {
  ...testCredentials.admin,
}) {
  const response = await client
    .post('/api/auth/login')
    .send(credentials);

  return response;
}

export async function loginAsUser(client, credentials) {
  const response = await client
    .post('/api/auth/login')
    .send(credentials);

  return response;
}