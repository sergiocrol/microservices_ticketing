import request from 'supertest';

import app from '../../app';

const createTicket = (title: string, price: number) => {
  return request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title,
    price
  });
}

it('can fetch a list of tickets', async () => {
  await createTicket('ticket 1', 20);
  await createTicket('ticket 2', 30);
  await createTicket('ticket 3', 40);

  const tickets = await request(app)
  .get('/api/tickets')
  .expect(200)
  
  expect(tickets.body.length).toEqual(3);
});