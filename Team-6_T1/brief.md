# Namogram - System Brief

## 1. What the System Does
Namogram is a RESTful social photo-sharing and media post management microservice platform developed for CS543 Web Services. It allows users to publish photo posts with captions, discover and browse feeds, like posts, modify existing posts with concurrent ETag locks, archive posts through state-transition endpoints, and validate media URLs via an outbound media verification service.

---

## 2. Who Uses It
* **Content Creators / Standard Users:** Users who publish photo posts, provide captions and CDN media URLs, edit post details, and archive their content.
* **Consumers / Feed Followers:** Users who fetch social feeds, filter/paginate posts, and view post details in multiple representations (JSON/XML).
* **Upstream Media Storage Service:** An external HTTP media microservice (`mediaClient`) that validates media URLs and ensures image availability before post creation.
* **Platform Administrators:** Operational managers who monitor rate limits, manage API throttling, and handle content moderation.

---

## 3. Nouns (Entities, Microservices & Data Owned)
Explicit list of domain entities and microservice data models:

* **Posts Service (`/posts`):** Owns `Post`, `Caption`, `MediaUrl`, `AuthorId`, `LikesCount`, `CreatedAt`, `Version`, and `ArchivedState`.
* **Media Verification Service:** Owns `MediaMetadata`, `CDNStoragePath`, and `MediaAvailabilityStatus`.
* **Idempotency Cache:** Owns `IdempotencyKey`, `ProcessedRequestHash`, and `CachedResponsePayload`.
* **Error & RFC 7807 Catalogue:** Owns `ProblemDetails`, `TypeURI`, `ErrorList`, and `ValidationRules`.

---

## 4. Verbs (Actions, Contracts & Operations)
Explicit list of operations and system interactions exposed by the API:

* **Post Operations:** `createPost()`, `getPosts()`, `getPostById()`, `updatePost()`, `deletePost()`.
* **Sub-Resource & State Operations:** `likePost()`, `archivePost()`.
* **Validation & Outbound Operations:** `validateMediaUrl()`, `verifyIdempotency()`, `checkETagMatch()`.
* **Negotiation & Formatting Operations:** `renderJSON()`, `renderXML()`, `formatProblemDetails()`.