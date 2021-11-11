import request from 'supertest';
import { app } from '../../../app';

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