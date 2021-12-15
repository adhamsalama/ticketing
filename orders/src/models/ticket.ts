import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
    id: string,
    title: string;
    price: number;
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,    
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

ticketSchema.methods.isReserved = async function() {
    /**
     * Run query to look at all orders.
     * Find an order in which the ticket is the ticket we want
     * and the status is not cancelled
     * If we find this order then the ticket is reserved
     */
    const reservedOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!reservedOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('ticket', ticketSchema);

export { Ticket, TicketDoc };