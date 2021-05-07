import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@scrbtickets/common';

import { currentUserRouter } from './routes/current-user';
import { signingRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
// this is related with the secure:true of cookieSession. This is because we are receiving the request through 
// a proxy (nginx-ingress), so this won't be trustful for express unless we specify this 'trust proxy'
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUserRouter);
app.use(signingRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
})

// Thi middleware will capture every error thrown in the app
app.use(errorHandler);

export default app;