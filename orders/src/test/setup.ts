import mongoose from 'mongoose';

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
    // Use a a MongoDB coker image instead of MongoMemoryServer
    // because MongoMemoryServer checks mongodb.com for Ubuntu 21.10 which doesn't exist yet
    // mongo = await MongoMemoryServer.create({ binary: {version: '21.04'}});
    // const mongoUri = mongo.getUri();
    // await mongoose.connect(mongoUri);
    await mongoose.connect('mongodb://localhost:27017');
    process.env.JWT_KEY = 'asdf';
});

beforeEach(async () => {
    jest.clearAllMocks();

    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    //await mongo.stop();
    
    // Delete collections after finishing the tests because I'm using a persistent MongoDB instance
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
    await mongoose.connection.close();
})