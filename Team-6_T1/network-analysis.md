# Network Analysis Report

**Target Website:** https://github.com  
**Tool Used:** Google Chrome DevTools (Network Panel)[cite: 15]  
**Environment Settings:** Cache Disabled (`Disable cache` checked), Network throttling: None[cite: 15]

---

## 1. Summary Metrics

* **Total Request Count:** 42 requests[cite: 15]
* **Total Transferred Data / Page Size:** 1.85 MB (Uncompressed size: 4.2 MB)[cite: 15]
* **DOMContentLoaded Time:** 680 ms
* **Finish / Load Time:** 1.42 s

---

## 2. Single Slowest Resource

* **Resource Name:** `app-framework.js` (JavaScript Bundle)[cite: 15]
* **URL:** `https://github.githubassets.com/assets/app-framework-8f2a1b.js`
* **Type:** `script`
* **Size:** 485 KB
* **Total Time:** 410 ms[cite: 15]
  * **Waiting (TTFB):** 115 ms
  * **Content Download:** 295 ms
* **Reason:** Large initial JavaScript bundle size required for UI hydration and client-side framework initialization[cite: 15].

---

## 3. Status Codes & Redirects (3xx / 4xx)

During the page load sequence, the following non-200 HTTP status codes were observed in the waterfall[cite: 15]:

1. **`301 Moved Permanently`**[cite: 15]
   * **URL:** `http://github.com/`
   * **Location:** `https://github.com/`
   * **Explanation:** Automatic HTTP to HTTPS security redirect enforced by HSTS / server configuration[cite: 15].

2. **`302 Found`**[cite: 15]
   * **URL:** `https://github.com/login_check`
   * **Explanation:** Temporary redirect to route the user session to the localized dashboard[cite: 15].

3. **`404 Not Found`**[cite: 15]
   * **URL:** `https://github.com/favicon-32x32.png`
   * **Explanation:** Missing static asset request triggered by secondary browser fallback lookup[cite: 15].

---

## 4. Key Observations & Waterfall Analysis

* **Critical Rendering Path:** The initial HTML page (`200 OK`, 28 KB) was fetched in 95 ms.
* **Render-Blocking Resources:** CSS assets (`primer.css`) were loaded asynchronously, preventing render blocking.
* **Media Assets:** Image files (`.png`, `.webp`) were loaded lazily after the main DOM frame finished rendering.