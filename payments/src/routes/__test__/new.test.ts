import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import mongoose from 'mongoose';
import { signin } from './utils/signing';
import { OrderStatus } from '@kubertickets/common';
import { stripe } from '../../stripe';


it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', signin())
        .send({
            token: 'some token',
            orderId: new mongoose.Types.ObjectId().toHexString() 
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user ', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 30
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin())
        .send({
            token: 'some token',
            orderId: order.id 
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled event', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        status: OrderStatus.Cancelled,
        price: 30
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin(userId))
        .send({
            token: 'some token',
            orderId: order.id 
        })
    .expect(400);
});

it('creates a successful charge with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        status: OrderStatus.Created,
        price: price
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

        const stripeCharges = await stripe.charges.list({limit: 50});

        const stripeCharge = stripeCharges.data.find(charge => charge.amount === price * 100);
        expect(stripeCharge).toBeDefined();
        expect(stripeCharge!.currency).toEqual('usd');
});