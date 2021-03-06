import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
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
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String
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
    return new Ticket(attrs);
}

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin);
const Ticket = mongoose.model<TicketDoc, TicketModel>('ticket', ticketSchema);

export { Ticket };

// const ticketSchema = new mongoose.Schema<Ticket>({
//     title: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     userId: {
//         type: String,
//         required: true
//     }
// }, {
//     toJSON: {
//         transform(doc, ret) {
//             ret.id = ret._id;
//             delete ret._id;
//         }
//     }
// });
// const Ticket = mongoose.model<Ticket>('Ticket', ticketSchema);
