import request from 'supertest';

export async function createStudent(app, alunoObject, loginResponse) {
    return await request('http://localhost:3000')
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(alunoObject)
}