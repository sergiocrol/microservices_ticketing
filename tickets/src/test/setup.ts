import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;
// This block of code is gonna be executed before everything else (basically we are creating a copy of mongoDB)
beforeAll(async () => {
  process.env.JWT_KEY = 'dfhfghb';
  
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// This block of code is gonna be executed before each test (We delete all the collections might be created in our db)
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// This block of code will be executed at the end of the execution (We close the mongoose connection)
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// this global declaration is going to be used everytime we need to make a test using currentUser
// it has been declared like global, but would be also be declared in a separate file and import it the tests
global.signin = () => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt: MY_JWT }
  const session = { jwt: token }

  // Turn that session into JSON 
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};