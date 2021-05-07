import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app';
import request from 'supertest';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
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
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201)

  const cookie = response.get('Set-Cookie');

  return cookie;
};