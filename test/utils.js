import request from 'supertest';
import app from '../src/app.js';

export async function accessToken() {
	const res = await request(app)
		.post('/api/auth/login')
		.set('Content-Type', 'application/json')
		.send({
			email: 'admin@escola.com',
			senha: 'admin123'
		});

	return res.body.token;
}
