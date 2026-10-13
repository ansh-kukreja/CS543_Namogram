const express = require('express');
const postsRouter = require('./routes/posts');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-RateLimit-Limit', '100');
    res.setHeader('X-RateLimit-Remaining', '99');

    const overrideMethod = req.headers['x-http-method-override'];
    if (overrideMethod) {
        req.method = overrideMethod.toUpperCase();
    }

    if (req.method === 'OPTIONS') {
        res.setHeader('Allow', 'GET, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Idempotency-Key, If-None-Match, If-Match, Accept, X-HTTP-Method-Override');
        return res.status(204).send();
    }

    next();
});

app.use(express.json());
app.use('/', postsRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(5000, () => {
        console.log('Server running on port 5000');
    });
}

module.exports = app;