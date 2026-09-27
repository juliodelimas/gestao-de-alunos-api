import { faker } from '@faker-js/faker';

export function novoAluno(){
    const timestamp = new Date().getTime();

    return {
                    nome:  faker.person.fullName(),
                    email: `vanessa.${timestamp}@example.com`,
                    matricula: `{timestamp}`,
                    senha: faker.internet.password()
            };

}