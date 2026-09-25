import {MongoMemoryServer} from 'mongodb-memory-server';

// Start an in-memory MongoDB instance before tests and set MONGODB_URI
const mongod = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongod.getUri();

// Ensure the in-memory server is stopped when the process exits
process.on('exit', async () => {
  try {
    await mongod.stop();
  } catch (e) {
    // ignore
  }
});
