import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus
} from '@kubertickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token')
        .not()
        .isEmpty()
        .withMessage('Token required'),
        body('orderId')
        .not()
        .isEmpty()
        .withMessage('orderId required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.body.orderId);
        if (!order) throw new NotFoundError();
        if (order.userId != req.currentUser!.id) throw new NotAuthorizedError();
        if (order.status === OrderStatus.Cancelled) throw new BadRequestError('Cannot pay for a cancelled order');
        res.send({"msg": "this order is yours"});
    }
);

export { router as createChargeRouter };