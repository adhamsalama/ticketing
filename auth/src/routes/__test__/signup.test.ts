import request from 'supertest';
import { app } from '../../app';
import { signup, getSignupCookie } from './utils/signup';

it('returns a 201 on successful signup', async () => {
    await signup();
});

it('returns a 400 with an invalid email', async () => {
    await signup('notanemail', 'password', 400);
});

it('returns a 400 with an invalid password', async () => {
    await signup('test@test.com', '', 400);
});

it('returns a 400 with missing email and password', async () => {
    await signup('', '', 400);
});

it('disallows duplicate emails', async () => {
    const email = 'test@test.com';
    const password = 'password';

    await signup(email, password, 201);
    await signup(email, password, 400);
    
});

it('sets a cookie after successful signup', async () => {
    const cookie = await getSignupCookie();
    expect(cookie).toBeDefined();
});