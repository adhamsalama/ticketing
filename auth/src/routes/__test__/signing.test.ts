import { sign } from 'crypto';
import request from 'supertest';
import { app } from '../../app';
import { signup } from './utils/signup';

it('returns a 200 on successful signin', async () => {
    // Sign up
    await signup();

    // Sign in
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);
    
        expect(response.get('Set-Cookie')).toBeDefined();
});

it('fails when an email that does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'testooooo@testoooooo.com',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 when given wrong credentials', async () => {
    // Sign up
    await signup();
        
    // Sign in with wrong password
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'differentpassword'
        })
        .expect(400);
});