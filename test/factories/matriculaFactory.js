// constroi uma criação de disciplina com dados aleatórios para o teste

import { faker } from '@faker-js/faker';

export function novaDisciplina() { //pode ser construido com randomNum

    const timestamp = Date.now(); //const randomNum = Math.floor(Math.random() * 10000);
    
    return {
        nome: faker.person.jobTitle(),//nome: `Pensamento Computacional8 ${randomNum}`,
        codigo: `PC${timestamp}`,//codigo: `PC1006${randomNum}`,
        cargaHoraria: 60

    };

}
