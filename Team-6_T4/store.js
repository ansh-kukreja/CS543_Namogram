const Post = require('./models/post');

class PostStore {
    constructor() {
        this.posts = new Map();
        this.idempotencyKeys = new Map();

        // Seed initial record
        const p1 = new Post('post_init101', 'usr_gauraansh', 'Initial seed post for Namogram', 'https://cdn.namogram.com/seed.jpg');
        this.posts.set(p1.id, p1);
    }

    create(authorId, caption, mediaUrl) {
        const id = `post_${Math.random().toString(36).substring(2, 10)}`;
        const post = new Post(id, authorId, caption, mediaUrl);
        this.posts.set(id, post);
        return post;
    }

    get(id) {
        return this.posts.get(id);
    }

    listAll(authorId) {
        const all = Array.from(this.posts.values());
        if (authorId) {
            return all.filter(p => p.authorId === authorId).map(p => p.asJSON());
        }
        return all.map(p => p.asJSON());
    }

    hasKey(key) {
        return this.idempotencyKeys.has(key);
    }

    getKey(key) {
        return this.idempotencyKeys.get(key);
    }

    saveKey(key, responseData) {
        this.idempotencyKeys.set(key, responseData);
    }
}

module.exports = new PostStore();