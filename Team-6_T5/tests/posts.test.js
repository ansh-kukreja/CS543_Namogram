const request = require('supertest');
const app = require('../app');

describe('Namogram Posts Service Assignment 05 Tests', () => {
    test('1. Conditional GET returns 304 Not Modified when ETag matches', async () => {
        const getRes = await request(app).get('/posts/post_init101');
        const etag = getRes.headers.etag;

        const condRes = await request(app)
            .get('/posts/post_init101')
            .set('If-None-Match', etag);

        expect(condRes.statusCode).toEqual(304);
    });

    test('2. Conditional Write returns 412 Precondition Failed on ETag mismatch', async () => {
        const res = await request(app)
            .patch('/posts/post_init101')
            .set('If-Match', '"stale_etag_999"')
            .send({ caption: 'Conflicting caption update' });

        expect(res.statusCode).toEqual(412);
        expect(res.body.type).toContain('precondition-failed');
    });

    test('3. OPTIONS preflight returns Allow header and 204 No Content', async () => {
        const res = await request(app).options('/posts/post_init101');
        expect(res.statusCode).toEqual(204);
        expect(res.headers.allow).toContain('GET');
    });

    test('4. Rate-limit and Security headers are set on responses', async () => {
        const res = await request(app).get('/posts/post_init101');
        expect(res.headers['x-ratelimit-limit']).toEqual('100');
        expect(res.headers['x-content-type-options']).toEqual('nosniff');
    });
});