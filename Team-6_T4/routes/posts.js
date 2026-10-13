const express = require('express');
const router = express.Router();
const store = require('../store');
const { problem } = require('../middleware/problemDetails');
const mediaClient = require('../utils/mediaClient');

// 1. CREATE: POST /posts (Supports Idempotency-Key & Manual Body Validation)
router.post('/posts', async (req, res) => {
    const idempotencyKey = req.headers['idempotency-key'];
    if (idempotencyKey && store.hasKey(idempotencyKey)) {
        const cached = store.getKey(idempotencyKey);
        res.setHeader('Location', `/posts/${cached.id}`);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(201).json(cached);
    }

    const body = req.body;
    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
        return problem(res, 400, 'Bad Request', 'Missing or malformed JSON request body', 'malformed-body');
    }

    // Pre-execution validation
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

    // Call hardened outbound media partner service
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

// 2. QUERY LIST: GET /posts (Filtered List via Query String)
router.get('/posts', (req, res) => {
    const authorId = req.query.authorId;
    const list = store.listAll(authorId);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(list);
});

// 3. READ SINGLE: GET /posts/:id
router.get('/posts/:id', (req, res) => {
    const post = store.get(req.params.id);
    if (!post) {
        return problem(res, 404, 'Not Found', `Post with ID '${req.params.id}' does not exist`, 'post-not-found');
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(post.asJSON());
});

// 4. SUB-RESOURCE STATE CHANGE: POST /posts/:id/likes
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