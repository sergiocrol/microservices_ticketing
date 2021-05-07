import { Message } from "node-nats-streaming";

import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-events";
import { Subjects } from './subjects';

export class TickedCreatedListener extends Listener<TicketCreatedEvent> {
  // We use type readonly for subject in order to avoid that the value could be changed in the future 
  // (without it we could reassign subject with Subjects.OrderUpdated for example)
  readonly subject = Subjects.TickedCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);
    
    msg.ack();
  }
}