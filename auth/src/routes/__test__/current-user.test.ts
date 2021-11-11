import { sign } from 'crypto';
import request from 'supertest';
import { app } from '../../app';
import { signup } from './utils/signup';

it('responds with details about the current user', async () => {
    const email = 'test@test.com';
    const password = 'password';

    // Sign up
    const cookie = await signup(email, password);

    // Get current user
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

        expect(response.body.currentUser.email).toEqual(email);
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
});