import { faker } from '@faker-js/faker';

export function novaDisciplina(){
    const timestamp = new Date().getTime();

    return{ 
                    "nome": "Matemática",
                    "codigo": `MAT-${timestamp}`,
                    "cargaHoraria": 60

            };

}