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

const matriculaSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    alunoId: { type: String, required: true },
    disciplinaId: { type: String, required: true },
    dataMatricula: { type: Date, default: Date.now },
  },
  { toJSON: toPlainOptions, toObject: toPlainOptions }
);

const Matricula =
  mongoose.models.Matricula || mongoose.model('Matricula', matriculaSchema, 'matriculas');

export default Matricula;
