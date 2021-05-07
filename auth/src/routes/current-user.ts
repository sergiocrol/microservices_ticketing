import express from 'express';
import { currentUser } from '@scrbtickets/common';


const router = express.Router();

router.get('/api/users/current-user', currentUser, (req, res) => {
  // currentUser is the payload we're receiving as response from currentUser
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };