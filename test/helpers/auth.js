import { api } from './api.js';
import 'dotenv/config';

let tokenEmCache = null

export async function comTokenDeAdmin() {
    if (!tokenEmCache) {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                    email: process.env.ADMIN_EMAIL || 'admin@escola.com', 
                    senha: process.env.ADMIN_SENHA || process.env.ADMIN_PASSWORD || 'admin123'
            });
        
            
                    email: process.env.ADMIN_EMAIL, 
                    senha: process.env.ADMIN_SENHA
            });
        
        tokenEmCache = loginResposta.body.token;
    }

    return `Bearer ${tokenEmCache}`;
}

export async function comTokenDeAluno(email, senha) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email, senha });

    return `Bearer ${loginResposta.body.token}`;
}

export async function getToken(emailUser, passUser) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
            email: emailUser, 
            senha: passUser
        });

    return loginResposta.body.token;
}