import { sign } from 'crypto';
import request from 'supertest';
import { app } from '../../app';
import { signup } from './utils/signup';

it('responds with details about the current user', async () => {
    // Sign up
    const cookie = await signup();

    // Get current user
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    console.log(response.body);
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
});