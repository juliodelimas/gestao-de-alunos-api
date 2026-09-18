import mongoose from '../database/db.js';

const schema = new mongoose.Schema({
  _id: String, // canonical e-mail is the shared, atomic unique key
  owner: { type: String, required: true },
});
export default mongoose.models.EmailReservation ||
  mongoose.model('EmailReservation', schema, 'email_reservations');
