import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;
beforeAll(async () => {
    // Use a a MongoDB coker image instead of MongoMemoryServer
    // because MongoMemoryServer checks mongodb.com for Ubuntu 21.10 which doesn't exist yet
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
    // await mongoose.connect('mongodb://localhost:27017');
    process.env.JWT_KEY = 'asdf';
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    
    // Delete collections after finishing the tests because I'm using a persistent MongoDB instance
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
    await mongoose.connection.close();
})