const CACHE = "domain-port-v1"

const ASSETS = ["/favicon.svg", "/favicon.ico"]

function getLocalePrefix(pathname) {
  const match = pathname.match(/^\/(de|en|es|fr|hi)(\/|$)/)
  return match ? match[1] : null
}

function shellUrlForLocale(locale) {
  return locale === "en" || !locale ? "/" : `/${locale}`
}

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
        }
      } catch {
        // No manifest at first SW install
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
    event.respondWith(navigateWithShellFallback(request))
    return
  }

  event.respondWith(cacheFirst(request))
})

async function navigateWithShellFallback(request) {
  const cached = await caches.match(request)
  if (cached) {
    fetch(request)
      .then((res) => {
        if (res.ok) {
          caches.open(CACHE).then((cache) => cache.put(request, res))
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
    const locale = getLocalePrefix(new URL(request.url).pathname)
    const shellUrl = shellUrlForLocale(locale)
    const shell = await caches.match(shellUrl)
    if (shell) return shell

    const lc = locale ?? "en"
    const notFound = await caches.match(`/${lc}/not-found`)
    if (notFound) return notFound

    return new Response("Offline", { status: 503 })
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
