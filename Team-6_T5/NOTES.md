# NOTES.md - CS543 Assignment 05

Team ID: 6
Course: CS-543 Web Services

Team Members:
1. Gauraansh Gaur (Roll No: 20251651039)
2. Shraiyansh Chaware (Roll No: 20251651085)
3. Abhishek Yadav (Roll No: 20251651007)
4. Utkarsh Singh (Roll No: 20251651099)
5. Jatin Mandwani (Roll No: 20251651048)

-------------------------------------------------------------------------------

## 1. Method Map (Part A1)
| Action | Method | URL | Safe? | Idempotent? |
| :--- | :--- | :--- | :--- | :--- |
| Read Feed / Catalog | `GET` | `/posts` | YES | YES |
| Read Single Post | `GET` | `/posts/:id` | YES | YES |
| Publish Post | `POST` | `/posts` | NO | NO (Retry-safe via Idempotency-Key) |
| Update Caption | `PATCH` | `/posts/:id` | NO | YES |
| Increment Likes | `POST` | `/posts/:id/likes` | NO | NO |

## 2. Request / Response Headers Table (Part D2)
| Endpoint | Required Request Headers | Response Headers Set |
| :--- | :--- | :--- |
| `POST /posts` | `Content-Type: application/json`, `Idempotency-Key` (Optional), `Authorization: Bearer <token>` | `201 Created`, `Location: /posts/:id`, `X-RateLimit-Limit`, `X-RateLimit-Remaining` |
| `GET /posts/:id` | `Accept: application/json`, `If-None-Match: "<etag>"` | `200 OK` / `304 Not Modified`, `ETag: "<etag>"`, `Cache-Control: public, max-age=60` |
| `PATCH /posts/:id` | `Content-Type: application/json`, `If-Match: "<etag>"` | `200 OK` / `412 Precondition Failed`, `ETag: "<new-etag>"` |
| `OPTIONS /posts/:id`| `Access-Control-Request-Method` | `204 No Content`, `Allow: GET, POST, PATCH, DELETE, OPTIONS` |

## 3. Safe-Retry Plan (Part C4)
* `GET /posts/:id`: Naturally safe and idempotent. Free to retry on network drops.
* `POST /posts`: Neither safe nor idempotent by nature. Made retry-safe by passing `Idempotency-Key` header so repeat attempts return cached 201 response.
* `PATCH /posts/:id`: Made concurrency-safe using `If-Match` header with ETag to prevent mid-air write collisions.

-------------------------------------------------------------------------------

## Answers to Mandatory Assignment Questions

### Q1: Method, Success Status, and Critical Header for 3 Endpoints
1. `POST /posts` -> `201 Created` -> `Location: /posts/:id` (Points to newly created resource location).
2. `GET /posts/:id` -> `200 OK` -> `ETag: "..."` (Powers conditional GETs to eliminate bandwidth overhead).
3. `PATCH /posts/:id` -> `200 OK` -> `ETag: "..."` (Provides updated version fingerprint for optimistic locking).

### Q2: Safe vs Idempotent Breakdown
`GET /posts/:id` is safe (read-only) and idempotent. `PATCH /posts/:id` is idempotent but not safe. `POST /posts` is neither safe nor idempotent; we made it retry-safe using an `Idempotency-Key` header cache.

### Q3: ETag, 304, and 412 Mechanics
* Sample ETag: `"a3b2c1d4e5f67890"`
* `If-None-Match` returning `304 Not Modified` saves network bandwidth and CPU rendering time.
* `If-Match` returning `412 Precondition Failed` prevents lost update problems when two editors update the same caption concurrently.

### Q4: 400 vs 422 Explanation
* `400 Bad Request`: Triggered by malformed JSON syntax that cannot be parsed by Express (`express.json()`).
* `422 Unprocessable Entity`: Triggered when JSON is syntactically valid but fails domain validation rules (e.g., empty caption or missing media URL).

### Q5: Browser CORS Block vs 200 OK
The browser client blocked the response due to Same-Origin Policy enforcement. The server returned 200 OK, but the browser rejected it because the server omitted the `Access-Control-Allow-Origin: *` response header.

### Q6: Cache-Control Usage
* `Cache-Control: public, max-age=60`: Set on `GET /posts/:id` to allow CDN/browser caching for static content.
* `Cache-Control: no-store`: Set on `POST /posts` and auth endpoints to prevent sensitive request data from hitting disk caches.

### Q7: GET Search vs POST Search
If search queries grow extremely complex (e.g., heavy geospatial/filter vectors that exceed URI length limits), `POST /posts/search` would be justified. Switching to POST gives up standard browser HTTP caching, ETag conditional GETs, and bookmarkability.

### Q8: Location Header on 201 vs 3xx
* On `201 Created`: Points directly to the newly created resource (`/posts/post_123`).
* On `3xx Redirect`: Points to the new target URI where the requested resource has moved (`/posts/v2/post_123`).