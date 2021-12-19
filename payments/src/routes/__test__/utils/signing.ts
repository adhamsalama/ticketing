import request from 'supertest';
import { app } from '../../../app';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const getSignupCookie = async (email='test@test.com', password='password') => {
    
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: email,
            password: password
        })
        .expect(201);
    const cookie = response.get('Set-Cookie');

    return cookie;
}

export const signup =  async (email='test@test.com', password='password', statusCode=201) => {    
    return request(app)
        .post('/api/users/signup')
        .send({
            email: email,
            password: password
        })
        .expect(statusCode)
}

export const signin = (id?: string, email='test@test.com') => {
    id = id || new mongoose.Types.ObjectId().toHexString();
    // Build a JWT payload
    const payload = {
        id,
        email
    };

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn it into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
    
    // Return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
}

export const createTicket = (title?: string, price?: number) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', signin('', 'test@test.com'))
        .send({
            title,
            price
        })
} 