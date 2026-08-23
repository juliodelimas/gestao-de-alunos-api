import request from 'supertest';

export async function getToken(emailUser, passUser) {
    const loginResposta = await request('http://localhost:3000')
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
            email: emailUser, 
            senha: passUser
        });

    return loginResposta.body.token;
}