const request = require('supertest');
const app = require('../app');

describe('Namogram Posts Service Assignment 04 Tests', () => {
    test('1. Successful Create returns 201 Created and Location header', async () => {
        const res = await request(app)
            .post('/posts')
            .send({ caption: 'Assignment 04 Test Post', mediaUrl: 'https://cdn.namogram.com/test.jpg' });

        expect(res.statusCode).toEqual(201);
        expect(res.headers.location).toBeDefined();
        expect(res.body.caption).toEqual('Assignment 04 Test Post');
    });

    test('2. Idempotent repeat returns original result without duplication', async () => {
        const headers = { 'Idempotency-Key': 'unique_key_101' };
        const payload = { caption: 'Idempotent Post', mediaUrl: 'https://cdn.namogram.com/test.jpg' };

        const r1 = await request(app).post('/posts').set(headers).send(payload);
        const r2 = await request(app).post('/posts').set(headers).send(payload);

        expect(r1.statusCode).toEqual(201);
        expect(r2.statusCode).toEqual(201);
        expect(r1.body.id).toEqual(r2.body.id);
    });

    test('3. Malformed or invalid body returns 422 Unprocessable Entity', async () => {
        const res = await request(app)
            .post('/posts')
            .send({ caption: '', mediaUrl: 'invalid_url' });

        expect(res.statusCode).toEqual(422);
        expect(res.headers['content-type']).toContain('application/problem+json');
        expect(res.body.errors.length).toEqual(2);
    });

    test('4. Unknown ID returns 404 Problem Details', async () => {
        const res = await request(app).get('/posts/invalid_post_999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.type).toContain('post-not-found');
    });
});