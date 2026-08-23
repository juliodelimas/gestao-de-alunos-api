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

const administradorSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: { type: String, default: 'admin' },
  },
  { timestamps: true, toJSON: toPlainOptions, toObject: toPlainOptions }
);

administradorSchema.pre('save', function hashSenha() {
  if (!this.isModified('senha')) return;
  this.senha = bcrypt.hashSync(this.senha, 10);
});

const Administrador =
  mongoose.models.Administrador || mongoose.model('Administrador', administradorSchema, 'administradores');

export function sanitizeAdmin(admin) {
  if (!admin) return admin;
  const plain = typeof admin.toObject === 'function' ? admin.toObject() : admin;
  const { senha, ...resto } = plain;
  return resto;
}

export default Administrador;
