const crypto = require('crypto');

class Post {
    constructor(id, authorId, caption, mediaUrl) {
        this.id = id;
        this.authorId = authorId || 'usr_anon';
        this.caption = caption;
        this.mediaUrl = mediaUrl;
        this.likesCount = 0;
        this.version = 1;
        this.createdAt = new Date().toISOString();
    }

    computeETag() {
        const raw = `${this.id}:${this.caption}:${this.likesCount}:${this.version}`;
        return `"${crypto.createHash('md5').update(raw).digest('hex')}"`;
    }

    asJSON() {
        return {
            id: this.id,
            authorId: this.authorId,
            caption: this.caption,
            mediaUrl: this.mediaUrl,
            likesCount: this.likesCount,
            version: this.version
        };
    }
}

module.exports = Post;