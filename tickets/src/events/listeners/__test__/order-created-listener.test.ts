import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@kubertickets/common';
import { Ticket } from "../../../models/ticket";
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
    const ticket = Ticket.build({
        title: 'first title',
        price: 10,
        userId: 'asdf'
    }); 
    
    await ticket.save();

    const listener = new OrderCreatedListener(natsWrapper.client);
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'not important',
        expiresAt: 'not important',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { ticket, listener, data, msg };
};

it('sets the userId of a ticket', async () => {
    const { ticket, listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { ticket, listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
    
});

it('publishes a ticket updated event', async () => {
    const { ticket, listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // @ts-ignore
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    
    expect(data.id).toEqual(ticketUpdatedData.orderId);
});