import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';


let mongo: any;
//hook function means this will run before all of
//our tests start excecuting.
beforeAll(async () => {
  process.env.JWT_KEY = 'BrB';

  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});
//reset all the data between each test runs.
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
});

