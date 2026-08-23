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

const disciplinaSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    nome: { type: String, required: true },
    codigo: { type: String, required: true, unique: true },
    cargaHoraria: { type: Number, default: null },
  },
  { timestamps: true, toJSON: toPlainOptions, toObject: toPlainOptions }
);

const Disciplina =
  mongoose.models.Disciplina || mongoose.model('Disciplina', disciplinaSchema, 'disciplinas');

export default Disciplina;
