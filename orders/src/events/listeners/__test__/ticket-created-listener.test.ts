import { TicketCreatedEvent } from "@kubertickets/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'test',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
;}

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();
    
    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('acks a message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

});