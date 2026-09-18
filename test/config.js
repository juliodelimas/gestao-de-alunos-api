import 'dotenv/config';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de teste ausente: ${name}`);
  return value;
};

export const testCredentials = {
  admin: {
    email: required('TEST_ADMIN_EMAIL'),
    senha: required('TEST_ADMIN_PASSWORD'),
  },
  student: {
    email: required('TEST_STUDENT_EMAIL'),
    senha: required('TEST_STUDENT_PASSWORD'),
  },
  newStudentPassword: required('TEST_NEW_STUDENT_PASSWORD'),
  invalidPassword: required('TEST_INVALID_PASSWORD'),
  unknownEmail: required('TEST_UNKNOWN_EMAIL'),
};