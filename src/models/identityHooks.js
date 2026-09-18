import Reservation from './emailReservation.model.js';
import { normalizeEmail, validatePassword, emailPattern } from '../utils/identityPolicy.js';
import ApiError from '../utils/ApiError.js';

export default function identityHooks(schema) {
  schema.pre('validate', function () {
    if (this.isModified('email')) this.email = normalizeEmail(this.email);
    if (this.isModified('senha')) validatePassword(this.senha);
  });
  schema.pre('save', async function () {
    if (!this.isModified('email')) return;
    const owner = `${this.constructor.modelName}:${this.id}`;
    const connection = this.constructor.db;
    const old = this.isNew ? null : await this.constructor.findById(this.id).lean();
    this.$locals.previousEmail = old?.email;
    // Legacy rows may not yet have a reservation. Do not merge or normalize them in bulk.
    for (const collection of ['administradores', 'alunos']) {
      const matches = await connection.collection(collection).find({ email: emailPattern(this.email) }).toArray();
      if (matches.some((item) => collection !== this.constructor.collection.name || item._id !== this.id)) {
        throw new ApiError(409, 'E-mail já utilizado por outro usuário.');
      }
    }
    try {
      await Reservation.create({ _id: this.email, owner });
      this.$locals.newReservation = this.email;
    } catch (error) {
      if (error.code !== 11000) throw error;
      const existing = await Reservation.findById(this.email);
      if (existing?.owner !== owner) throw new ApiError(409, 'E-mail já utilizado por outro usuário.');
    }
  });
  schema.post('save', async function () {
    const old = this.$locals.previousEmail;
    const owner = `${this.constructor.modelName}:${this.id}`;
    this.$locals.newReservation = undefined;
    if (old && old.trim().toLowerCase() !== this.email) {
      await Reservation.deleteOne({ _id: old.trim().toLowerCase(), owner });
    }
  });
  schema.post('save', function (error, doc, next) {
    const cleanup = async () => {
      if (doc?.$locals.newReservation) {
        await Reservation.deleteOne({ _id: doc.$locals.newReservation,
          owner: `${doc.constructor.modelName}:${doc.id}` });
        doc.$locals.newReservation = undefined;
      }
    };
    cleanup().then(
      () => next(error.code === 11000 ? new ApiError(409, 'Matrícula ou e-mail já utilizado.') : error),
      next,
    );
  });
  schema.post('findOneAndDelete', async function (doc) {
    if (doc) await Reservation.deleteMany({ owner: `${doc.constructor.modelName}:${doc.id}` });
  });
}
