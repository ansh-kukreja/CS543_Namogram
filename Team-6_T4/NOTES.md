# NOTES.md - CS543 Assignment 04

Team ID: 6
Course: CS-543 Web Services

Team Members:
1. Gauraansh Gaur (Roll No: 20251651039)
2. Shraiyansh Chaware (Roll No: 20251651085)
3. Abhishek Yadav (Roll No: 20251651007)
4. Utkarsh Singh (Roll No: 20251651099)
5. Jatin Mandwani (Roll No: 20251651048)

-------------------------------------------------------------------------------

## 1. Resource Table (Part A4)
| Method | URL | Action / Description | Success Code | Failure Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/posts` | Creates a new post with media and caption | `201 Created` | `400 Bad Request`, `422 Unprocessable Entity` |
| `GET` | `/posts` | Returns filtered list of posts | `200 OK` | - |
| `GET` | `/posts/:id` | Fetches details of a single post | `200 OK` | `404 Not Found` |
| `POST` | `/posts/:id/likes` | Sub-resource state change: increments post likes | `200 OK` | `404 Not Found` |

## 2. Justification for Least Comfortable Mapping (Part A5)
The operation `toggleLike()` mapped least comfortably onto a standard CRUD resource because liking an item is an event rather than creating a durable standalone resource. We resolved this by modeling likes as a state-changing sub-resource (`POST /posts/:id/likes`). We rejected URL paths like `/likePost` or `/toggleLike` to prevent verb leaks in resource URLs.

## 3. Outbound Call Fallback Reasoning (Part D3)
When calling the external Media Moderation Service (`utils/mediaClient.js`), if the service is unreachable or encounters transient network timeouts, our service retries up to 3 times with exponential backoff and randomized jitter. If all retries fail, our service degrades gracefully by applying an internal fallback state (`PROCESSED_FALLBACK`) rather than crashing or throwing an unhandled exception. Failing the entire post creation would be unacceptable for user experience during transient media service blips.

-------------------------------------------------------------------------------

## Answers to Mandatory Assignment Questions

### Question 1: WSDL vs OpenAPI line count difference
The line count difference stems from SOAP's heavy XML Envelope wrapping, extensive `wsdl:binding`, `wsdl:portType`, and verbose XML Schema type declarations. OpenAPI does not need explicit protocol transport bindings (SOAP-over-HTTP) or message input/output element wrappers, as HTTP verbs and JSON schemas directly convey operational intent.

### Question 2: soap:Fault inside 200 OK problem
Returning an error inside a `200 OK` HTTP status misleads network intermediaries, HTTP caches, proxy servers, and API gateways into treating failed transactions as successful operations, breaking standard HTTP caching and automated retry/alerting mechanisms.

### Question 3: UDDI's Publish, Find, Bind status
* **Publish**: Replaced by CI/CD pipelines publishing OpenAPI spec files (`openapi.yaml`) to API portals / Swagger hubs.
* **Find**: Replaced by Service Mesh / DNS service discovery (e.g., Kubernetes service discovery).
* **Bind**: Continues to exist as runtime HTTP requests binding directly to host endpoints configured via environment variables (`process.env.MEDIA_SERVICE_URL`).

### Question 4: Schema validation enforcement function
In our code, manual validation responsibility is carried out inside `routes/posts.js` before interacting with store logic. If we had not written explicit validation, empty captions or invalid media URLs would corrupt store records and cause unhandled runtime exceptions.

### Question 5: Choosing SOAP over REST
We would choose the SOAP stack over REST for bank-to-bank financial transactions or legal compliance edges where strict contract-first WSDL schemas, WS-Security (XML digital signatures), and WS-AtomicTransaction multi-party ACID guarantees are non-negotiable requirements.