import mongoose from 'mongoose';

import app from './app';

// The last versions of Node can make use of the keyword of await in a top level (not needing a async function), but just
// for ensure a correct perform, we will start the connection inside a function
const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDB')
  } catch(err) {
    console.log(err);
  }

  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!!!`);
  })
}

start();