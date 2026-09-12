import 'dotenv/config';
import mongoose from 'mongoose';

export const mochaHooks = {
  async afterAll() {
    await mongoose.connection.close();
  },
};
