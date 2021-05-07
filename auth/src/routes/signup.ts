import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@scrbtickets/common';

import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
],
validateRequest,
async (req: Request, res: Response) => {
  // Check if the user already exists
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if(existingUser) {
    throw new BadRequestError('Email in use');
  }
 
  // Save the user in mongoDB
  const user = User.build({ email, password });
  await user.save();

  // Generate JWT (jwt.sign -> the first argument is the payload )
  const userJwt = jwt.sign({
    id: user.id,
    email: user.email
  }, 
  process.env.JWT_KEY!
  );

  // store it on the session object. We cannot use req.session.jwt (as the doc says) because the type definition file we've installed with
  // cookie-session is not assuming we actually have an object present as req.session. So rather that try to set directly
  // the jwt property, we redefine the entire object of session with the property we want
  req.session = {
    jwt: userJwt
  };

  res.status(201).send(user);
});

export { router as signupRouter };