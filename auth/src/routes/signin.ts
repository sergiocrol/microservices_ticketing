import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@scrbtickets/common';

import { Password } from '../services/password';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signin', [
  body('email')
    .isEmail() 
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must apply a password')
],
validateRequest,
async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordsMatch = await Password.compare(existingUser.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials');
  }

  // Generate JWT (jwt.sign -> the first argument is the payload )
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, 
  process.env.JWT_KEY!
  );

  // store it on the session object. We cannot use req.session.jwt (as the doc says) because the type definition file we've installed with
  // cookie-session is not asuming we actually have an object present as req.session. So rather that try to set directly
  // the jwt property, we redefine the entire object of session with the property we want
  req.session = {
    jwt: userJwt
  };

  res.status(200).send(existingUser);
});

export { router as signingRouter };