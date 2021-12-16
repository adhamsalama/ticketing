import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketCreatedEvent } from "@kubertickets/common";
import { Ticket } from "../../../models/ticket";
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';

const setup = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'first title',
        price: 10,
    }); 
    await ticket.save();

    const listener = new TicketUpdatedListener(natsWrapper.client);
    const data: TicketCreatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new title',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString() 
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { ticket, listener, data, msg };
};

it('updates a ticket', async () => {
    const { ticket, listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
});

it('does not call ack if event version in inconsistent', async () => {
    const { ticket, listener, data, msg } = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    }
    catch (err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});