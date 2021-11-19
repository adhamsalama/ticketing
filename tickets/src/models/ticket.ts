import mongoose from 'mongoose';

interface Ticket {
    title: string,
    price: number,
    userId: string
}

const ticketSchema = new mongoose.Schema<Ticket>({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

const Ticket = mongoose.model<Ticket>('Ticket', ticketSchema);

export { Ticket };