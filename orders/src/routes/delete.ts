import express, { Request, Response } from 'express';
//import { Ticket } from '../models/ticket';
import { NotFoundError } from '@kubertickets/common';

const router = express.Router();

router.delete('/api/orders/:id', async (req: Request, res: Response) => {
    //const ticket = await Ticket.findById(req.params.id);

    //if (!ticket) throw new NotFoundError();
    res.send({});
});

export { router as deleteOrderRouter };