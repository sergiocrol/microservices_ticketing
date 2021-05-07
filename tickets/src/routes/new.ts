import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@scrbtickets/common';
import { Ticket } from '../models/ticket'

const router = express.Router();

router.post('/api/tickets', requireAuth, [
  body('title')
  .not()
  .isEmpty()
  .withMessage('Title is required'),
  body('price')
  .isFloat({ gt: 0 })
  .withMessage('Price must be greater than zero')
], validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;

  // in the userId property, TS throws an error because it does not know that we are using
  // requireAuth middleware, which is already handling that we have a currentUser; so we use an 
  // exclamation in order to avoid that.
  const ticket = Ticket.build({title, price, userId: req.currentUser!.id});
  await ticket.save();
  res.status(201).send(ticket);
});

export { router as createTicketRouter };