import express, { request, Request, Response } from 'express';
import { requireAuth, validateRequest } from '@kubertickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0}).withMessage('Price must be greater than 0')
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;
    //console.log('current user', req.currentUser!.id);

    const ticket = new Ticket({title: title, price: price, userId: req.currentUser!.id});
    await ticket.save();
    //console.log(ticket, ticket.userId);
    res.status(201).send(ticket);
});

export { router as createTicketRouter };