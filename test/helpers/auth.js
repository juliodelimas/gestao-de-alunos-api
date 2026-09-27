import  request from 'supertest';
import 'dotenv/config';
import { api } from './api.js';


let tokenEmCache = null;

export async function getTokenAdmin() {

    if (!tokenEmCache) {

        const responseToken = await api()
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: process.env.ADMIN_EMAIL,
                    senha: process.env.ADMIN_SENHA
                });

        tokenEmCache = responseToken.body.token;
                
    }
   return `Bearer ${tokenEmCache}`;

}

export async function getToken(email, senha) {

     const responseToken = await api()
                .post('/api/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: email,
                    senha: senha
                });
                
    return `Bearer ${responseToken.body.token}`;

}
      