import request from 'supertest';
import 'dotenv/config';

let tokenEmCache = null

export async function comTokenDeAdmin() {
    if(!tokenEmCache){
         const loginResposta = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: process.env.ADMIN_SENHA
            });

        tokenEmCache = loginResposta.body.token;
    }

    return `Bearer ${tokenEmCache}`;
}

export async function comTokenDeAluno() {
    if(!tokenEmCache){
         const loginResposta = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ALUNO_EMAIL,
                senha: process.env.ALUNO_SENHA
            });

        tokenEmCache = loginResposta.body.token;
    }

    return `Bearer ${tokenEmCache}`;
}

export async function getToken(emailUser, passUser) {
    const loginResposta = await request(process.env.BASE_URL)
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: emailUser,
                    senha: passUser
                    });

    return loginResposta.body.token;    
}