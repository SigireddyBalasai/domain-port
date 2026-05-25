const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW = 60_000
const urlPattern = /https?:\/\/|www\./i

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const lastSubmission = rateLimitMap.get(ip)

  if (lastSubmission && now - lastSubmission < RATE_LIMIT_WINDOW) {
    return false
  }
  rateLimitMap.set(ip, now)

  return true
}

export function checkHoneypot(website: unknown): boolean {
  return typeof website === "string" && website.trim().length > 0
}

export function containsUrl(text: string): boolean {
  return urlPattern.test(text)
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)
}
