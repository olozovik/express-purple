import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
    const { app } = await boot;
    application = app;
});

describe('Users e2e', () => {
    it('Register - error', async () => {
        const res = await request(application.app).post('/users/register').send({
            email: 'john@gmail.com',
            password: '12345678',
            name: 'John',
        });
        expect(res.statusCode).toBe(409);
    });

    it('Login - success', async () => {
        const res = await request(application.app).post('/users/login').send({
            email: 'john@gmail.com',
            password: '12345678',
        });
        expect(res.body.jwt).not.toBeUndefined();
    });

    it('Login - wrong email', async () => {
        const res = await request(application.app).post('/users/login').send({
            email: 'john@gmail_.com',
            password: '12345678',
        });
        expect(res.statusCode).toBe(401);
    });

    it('Login - wrong password', async () => {
        const res = await request(application.app).post('/users/login').send({
            email: 'john@gmail.com',
            password: '12345678_',
        });
        expect(res.statusCode).toBe(401);
    });

    it('Info - success', async () => {
        const {
            body: { jwt },
        } = await request(application.app).post('/users/login').send({
            email: 'john@gmail.com',
            password: '12345678',
        });
        const res = await request(application.app)
            .get('/users/info')
            .set({
                Authorization: `Bearer ${jwt}`,
            });
        expect(res.body.email).toEqual('john@gmail.com');
    });

    it('Info - incorrect token', async () => {
        const {
            body: { jwt },
        } = await request(application.app).post('/users/login').send({
            email: 'john@gmail.com',
            password: '12345678',
        });
        const res = await request(application.app)
            .get('/users/info')
            .set({
                Authorization: `Bearer _${jwt}`,
            });
        expect(res.statusCode).toBe(401);
    });
});

afterAll(() => {
    application.close();
});
