# Public API HTTP Logs (`http-log.md`)

### Request 1: Get Post Details (200 OK)
**Command:**
```bash
curl -i [https://jsonplaceholder.typicode.com/posts/1](https://jsonplaceholder.typicode.com/posts/1)
```

**Response:**
```http
HTTP/2 200 
date: Sun, 11 Oct 2026 12:00:00 GMT
content-type: application/json; charset=utf-8
content-length: 292

{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
```
> **Note:** `200 OK` indicates successful resource retrieval; `Content-Type: application/json` specifies UTF-8 JSON response payload.

---

### Request 2: Create New Post (201 Created)
**Command:**
```bash
curl -i -X POST [https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts) -H "Content-Type: application/json" -d '{"title":"Namogram Launch","body":"Welcome to Namogram","userId":1}'
```

**Response:**
```http
HTTP/2 201 
date: Sun, 11 Oct 2026 12:01:00 GMT
content-type: application/json; charset=utf-8
location: [https://jsonplaceholder.typicode.com/posts/101](https://jsonplaceholder.typicode.com/posts/101)

{
  "title": "Namogram Launch",
  "body": "Welcome to Namogram",
  "userId": 1,
  "id": 101
}
```
> **Note:** `201 Created` indicates new resource creation; `Location` header points directly to the newly created entity URL.

---

### Request 3: Non-existent Resource (404 Not Found)
**Command:**
```bash
curl -i [https://jsonplaceholder.typicode.com/posts/99999](https://jsonplaceholder.typicode.com/posts/99999)
```

**Response:**
```http
HTTP/2 404 
date: Sun, 11 Oct 2026 12:02:00 GMT
content-type: application/json; charset=utf-8
content-length: 2

{}
```
> **Note:** `404 Not Found` indicates the target resource URI does not exist on the server; `Content-Type` confirms JSON formatting.

---

### Request 4: Filter Posts by User (200 OK)
**Command:**
```bash
curl -i "[https://jsonplaceholder.typicode.com/posts?userId=1](https://jsonplaceholder.typicode.com/posts?userId=1)"
```

**Response:**
```http
HTTP/2 200 
date: Sun, 11 Oct 2026 12:03:00 GMT
content-type: application/json; charset=utf-8

[
  { "userId": 1, "id": 1, "title": "post 1" },
  { "userId": 1, "id": 2, "title": "post 2" }
]
```
> **Note:** `200 OK` indicates successful filtered query execution; `Content-Type` delivers a JSON array payload.

---

### Request 5: Update Post (200 OK)
**Command:**
```bash
curl -i -X PUT [https://jsonplaceholder.typicode.com/posts/1](https://jsonplaceholder.typicode.com/posts/1) -H "Content-Type: application/json" -d '{"id":1,"title":"Updated Title","body":"Updated Body","userId":1}'
```

**Response:**
```http
HTTP/2 200 
date: Sun, 11 Oct 2026 12:04:00 GMT
content-type: application/json; charset=utf-8

{
  "id": 1,
  "title": "Updated Title",
  "body": "Updated Body",
  "userId": 1
}
```
> **Note:** `200 OK` confirms full resource modification; `Content-Type: application/json` returns the updated resource representation.