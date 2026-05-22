const CACHE = "domain-port-v1"

const ASSETS = ["/favicon.svg", "/favicon.ico"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      await cache.addAll(ASSETS).catch(() => {})

      try {
        const res = await fetch("/blog-manifest.json")
        if (res.ok) {
          const urls = await res.json()
          for (const url of urls) {
            try {
              await cache.add(url)
            } catch {
              // Individual URL pre-cache failure is non-fatal
            }
          }
          console.log(`[SW] Pre-cached ${urls.length} content URLs`)
        }
      } catch {
        // No manifest at first install — will cache on visit
      }
    })()
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

function shouldCache(url) {
  if (url.pathname.startsWith("/api/")) return false
  if (url.pathname === "/sw.js") return false
  if (url.pathname === "/blog-manifest.json") return false
  return true
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (url.origin !== self.location.origin) return
  if (!shouldCache(url)) return

  if (request.mode === "navigate") {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  event.respondWith(cacheFirst(request))
})

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)
  if (cached) {
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches.open(CACHE).then((cache) => cache.put(request, response))
        }
      })
      .catch(() => {})
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    })
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response("Offline", { status: 503 })
  }
}
