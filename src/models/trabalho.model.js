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

const trabalhoSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    alunoId: { type: String, required: true },
    disciplinaId: { type: String, required: true },
    titulo: { type: String, required: true },
    descricao: { type: String, default: null },
    status: { type: String, default: 'entregue' },
    nota: { type: Number, default: null },
    feedback: { type: String, default: null },
    dataEntrega: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: toPlainOptions, toObject: toPlainOptions }
);

const Trabalho =
  mongoose.models.Trabalho || mongoose.model('Trabalho', trabalhoSchema, 'trabalhos');

export default Trabalho;
