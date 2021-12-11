import express, { request, Request, Response } from 'express';
import { requireAuth, validateRequest } from '@kubertickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/orders', requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId is required'),
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;
    //console.log('current user', req.currentUser!.id);

    const ticket = new Ticket({title: title, price: price, userId: req.currentUser!.id});
    await ticket.save();
    //console.log(ticket, ticket.userId);
    res.status(201).send(ticket);
});

export { router as newOrderRouter };