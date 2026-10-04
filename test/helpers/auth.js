import { api } from './api.js';
import 'dotenv/config';

let tokenEmCache = null

export async function comTokenDeAdmin() {
    if (!tokenEmCache) {
        const loginResposta = await api()
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

export async function comTokenAluno(emailUser, passUser) {
     if (!tokenEmCache) {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email: emailUser, 
                senha: passUser
         });

   tokenEmCache = loginResposta.body.token;
    }

    return `Bearer ${tokenEmCache}`;
}