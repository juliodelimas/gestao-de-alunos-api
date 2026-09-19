import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/env.js';

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão com o MongoDB:', err.message);
});

await mongoose.connect(MONGODB_URI);

console.log(`MongoDB conectado em ${MONGODB_URI}`);

export default mongoose;
