import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TickedCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to nats');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  new TickedCreatedListener(stan).listen();
});

process.on('SIGNIT', () => stan.close());
process.on('SIGNTERM', () => stan.close());
