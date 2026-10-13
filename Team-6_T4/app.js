const express = require('express');
const cors = require('cors');
const postsRouter = require('./routes/posts');

const app = express();

app.use(cors());
app.use(express.json());

// Mount Post Service Routes
app.use('/', postsRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(5000, () => {
        console.log('Namogram Post Service running on http://localhost:5000');
    });
}

module.exports = app;