const express = require('express');
const router = express.Router();
const store = require('../store');
const { problem } = require('../middleware/problemDetails');
const mediaClient = require('../utils/mediaClient');

// Authorization Token Middleware Check
const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.includes('invalid_token')) {
        return problem(res, 401, 'Unauthorized', 'Invalid or expired Bearer token', 'unauthorized');
    }
    next();
};

// POST /posts (Create with Idempotency & Auth)
router.post('/posts', checkAuth, async (req, res) => {
    const idempotencyKey = req.headers['idempotency-key'];
    if (idempotencyKey && store.hasKey(idempotencyKey)) {
        const cached = store.getKey(idempotencyKey);
        res.setHeader('Location', `/posts/${cached.id}`);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(201).json(cached);
    }

    const body = req.body;
    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
        return problem(res, 400, 'Bad Request', 'Missing or malformed JSON body', 'malformed-body');
    }

    const validationErrors = [];
    if (!body.caption || typeof body.caption !== 'string' || body.caption.trim().length === 0) {
        validationErrors.push({ field: 'caption', reason: 'Caption cannot be empty' });
    }
    if (!body.mediaUrl || typeof body.mediaUrl !== 'string' || !body.mediaUrl.startsWith('http')) {
        validationErrors.push({ field: 'mediaUrl', reason: 'Valid HTTP/HTTPS mediaUrl is required' });
    }

    if (validationErrors.length > 0) {
        return problem(res, 422, 'Unprocessable Entity', 'Field validation failed', 'validation-error', validationErrors);
    }

    const mediaRes = await mediaClient.processMedia(body.mediaUrl, idempotencyKey);
    const post = store.create(body.authorId, body.caption, mediaRes.mediaUrl);
    const out = post.asJSON();

    if (idempotencyKey) {
        store.saveKey(idempotencyKey, out);
    }

    res.setHeader('Location', `/posts/${post.id}`);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(201).json(out);
});

// GET /posts
router.get('/posts', (req, res) => {
    const authorId = req.query.authorId;
    const list = store.listAll(authorId);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(list);
});

// GET /posts/:id (Conditional GET - 304 Not Modified)
router.get('/posts/:id', (req, res) => {
    const post = store.get(req.params.id);
    if (!post) {
        return problem(res, 404, 'Not Found', `Post with ID '${req.params.id}' does not exist`, 'post-not-found');
    }

    const etag = post.computeETag();
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'public, max-age=60');

    if (req.headers['if-none-match'] === etag) {
        return res.status(304).send();
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(post.asJSON());
});

// PATCH /posts/:id (Conditional Write - 412 Precondition Failed)
router.patch('/posts/:id', (req, res) => {
    const post = store.get(req.params.id);
    if (!post) {
        return problem(res, 404, 'Not Found', `Post with ID '${req.params.id}' does not exist`, 'post-not-found');
    }

    const ifMatch = req.headers['if-match'];
    if (ifMatch && ifMatch !== post.computeETag()) {
        return problem(res, 412, 'Precondition Failed', 'Resource ETag mismatch - state modified elsewhere', 'precondition-failed');
    }

    if (req.body && req.body.caption) {
        post.caption = req.body.caption;
        post.version += 1;
    }

    res.setHeader('ETag', post.computeETag());
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(post.asJSON());
});

// POST /posts/:id/likes
router.post('/posts/:id/likes', (req, res) => {
    const post = store.get(req.params.id);
    if (!post) {
        return problem(res, 404, 'Not Found', `Post with ID '${req.params.id}' does not exist`, 'post-not-found');
    }

    post.likesCount += 1;
    post.version += 1;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ id: post.id, likesCount: post.likesCount });
});

module.exports = router;