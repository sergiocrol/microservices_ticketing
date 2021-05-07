import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

// stan is how a client or instance of nats is called by convention
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

// Now we have make the connection, we are going to listen the connect event
stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20
    });
  } catch (error) {
    console.log(error);
  }

});