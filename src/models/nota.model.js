import { randomUUID } from 'node:crypto';
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

const notaSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    alunoId: { type: String, required: true },
    disciplinaId: { type: String, required: true },
    valor: { type: Number, required: true },
    tipo: { type: String, required: true },
    descricao: { type: String, default: null },
  },
  { timestamps: true, toJSON: toPlainOptions, toObject: toPlainOptions }
);

const Nota = mongoose.models.Nota || mongoose.model('Nota', notaSchema, 'notas');

export default Nota;
