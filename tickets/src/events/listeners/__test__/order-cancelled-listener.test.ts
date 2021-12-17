import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from '@kubertickets/common';
import { Ticket } from "../../../models/ticket";
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'first title',
        price: 10,
        userId: 'asdf'
    });

    ticket.set({ orderId });
    
    await ticket.save();

    const listener = new OrderCancelledListener(natsWrapper.client);
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { ticket, orderId, listener, data, msg };
};

it('sets the userId of a ticket', async () => {
    const { ticket, listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
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
    // const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    
    // expect(data.id).toEqual(ticketUpdatedData.orderId);
});