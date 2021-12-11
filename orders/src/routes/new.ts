import express, { request, Request, Response } from 'express';
import { NotFoundError, BadRequestError, requireAuth, validateRequest, OrderStatus } from '@kubertickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import mongoose from 'mongoose';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId is required'),
], validateRequest, async (req: Request, res: Response) => {
    // Find the ticket the user is trying to order
    const { ticketId } = req.body;    
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();
    
    // Make sure it's not already reserved
    const isReserved = await ticket.isResevred();
    if (isReserved) throw new BadRequestError('Ticket is already reserved');

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    
    //Build the order and save it
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    });
    await order.save();

    // Publish an event that an order was created

    res.status(201).send(order);
});

export { router as newOrderRouter };