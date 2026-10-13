const request = require('supertest');
const app = require('../app');

describe('Namogram Posts Service Assignment 06 Tests', () => {
    test('1. Batch validation failure returns 422 with RFC 7807 problem details', async () => {
        const res = await request(app)
            .post('/posts')
            .send({ caption: '', mediaUrl: 'bad' });

        expect(res.statusCode).toEqual(422);
        expect(res.headers['content-type']).toContain('application/problem+json');
        expect(res.body.errors.length).toEqual(2);
    });

    test('2. Content negotiation returns XML when Accept header specifies application/xml', async () => {
        const res = await request(app)
            .get('/posts/post_init101')
            .set('Accept', 'application/xml');

        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toContain('application/xml');
    });

    test('3. Unsupported Accept header returns 406 Not Acceptable', async () => {
        const res = await request(app)
            .get('/posts/post_init101')
            .set('Accept', 'text/csv');

        expect(res.statusCode).toEqual(406);
        expect(res.body.type).toContain('not-acceptable');
    });

    test('4. Non-existent post ID returns 404 RFC 7807 problem details', async () => {
        const res = await request(app).get('/posts/post_missing_999');
        expect(res.statusCode).toEqual(404);
        expect(res.body.status).toEqual(404);
    });
});