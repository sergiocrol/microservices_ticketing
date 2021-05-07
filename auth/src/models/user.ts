import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties that the User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

// middleware function implemented in mongoose. Every time we attempt to save a document to our db, we're gonna
// execute the function passed as second argument. This function is async, and the done method of the arg must be called
// when we finish the process we want to finish.
// also, the function has to be declared with function() syntax, so we can refers to the user as this.user... in case
// we'd use arrow function, the this context would be the entire file, and not the object context
userSchema.pre('save', async function(done) {
  // With every change to our db this middleware will be called, so, we want to hash our password only in the case
  // that the password has been modified, not if has been modified the email, por instance
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Usually we don't need this function. In a normal way, to create a new User we would need only to do:
// const user = new User({email: 'sergi@gmail.com', password: 'yosoysergi'}). But in this case we are working with
// TS, and the only way to TS be aware of the attrs we are passing to the schema are correct, we have to create an
// interface, and then an intermediate function passing the interface as argument, in order TS can check they are correct
// We are using this .statics.build, in order to create a user like User.build({email: 'sergi@gmail.com', password: 'yosoysergi'})
// so we don't need to instantiate it (this is how we add a function to a schema in mongoose)
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };