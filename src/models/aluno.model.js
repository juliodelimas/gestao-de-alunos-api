import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import mongoose from '../database/db.js';

const { Schema } = mongoose;

const toPlainOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
};

const alunoSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matricula: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: { type: String, default: 'aluno' },
  },
  { timestamps: true, toJSON: toPlainOptions, toObject: toPlainOptions }
);

alunoSchema.pre('save', function hashSenha() {
  if (!this.isModified('senha')) return;
  this.senha = bcrypt.hashSync(this.senha, 10);
});

const Aluno = mongoose.models.Aluno || mongoose.model('Aluno', alunoSchema, 'alunos');

export function sanitizeAluno(aluno) {
  if (!aluno) return aluno;
  const plain = typeof aluno.toObject === 'function' ? aluno.toObject() : aluno;
  const { senha, ...resto } = plain;
  return resto;
}

export default Aluno;
