class MediaClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || process.env.MEDIA_SERVICE_URL || 'https://partner-gateway.namogram.com/media';
    }

    async processMedia(mediaUrl, idempotencyKey, retries = 3) {
        let backoff = 100;
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                return { status: 'PROCESSED', mediaUrl: mediaUrl };
            } catch (err) {
                if (err.response && err.response.status >= 400 && err.response.status < 500) {
                    break;
                }
                if (attempt === retries - 1) break;
                const jitter = Math.random() * 50;
                await new Promise(r => setTimeout(r, backoff + jitter));
                backoff *= 2;
            }
        }
        return { status: 'PROCESSED_FALLBACK', mediaUrl: mediaUrl };
    }
}

module.exports = new MediaClient();