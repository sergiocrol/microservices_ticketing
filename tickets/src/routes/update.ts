import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { NotFoundError, requireAuth, NotAuthorizedError, validateRequest } from '@scrbtickets/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id',
 requireAuth,
 [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be provided and must be greater than zero')
 ],
 validateRequest,
 async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if(!ticket) {
    throw new NotFoundError();
  }

  // Check if the user that is attempting to make the update is also the owner of the ticket
  if (ticket.userId !==  req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  // This just makes the update to the document in memory, it does not persist anything in mongoDB
  // for doing that we need to call save() function.
  ticket.set({
    title: req.body.title,
    price: req.body.price
  });
  await ticket.save();

  res.status(200).send(ticket);
});

export { router as updateTicketRouter };