import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../app';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
  .put(`/api/tickets/${id}`)
  .set('Cookie', global.signin())
  .send({
    title: 'ticket',
    price: 20
  })
  .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
  .put(`/api/tickets/${id}`)
  .send({
    title: 'ticket',
    price: 20
  })
  .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'ticket',
    price: 20
  });

  // this second time, the result of global.signin is another user completely different.
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ticket updated',
      price: 25
    })
    .expect(401)

});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'ticket',
    price: 20
  });

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: '',
    price: 25
  })
  .expect(400);

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: 'Ticket',
    price: -10
  })
  .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'ticket',
    price: 20
  });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Ticket updated',
      price: 35
    })
    .expect(200);

  const ticketResponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send();

  expect(ticketResponse.body.title).toEqual('Ticket updated');
  expect(ticketResponse.body.price).toEqual(35);
});