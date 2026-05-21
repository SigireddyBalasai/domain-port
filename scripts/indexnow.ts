import axios from "axios"
import { IndexNowSubmitter } from "indexnow-submitter"

const siteUrl = process.env.INDEXNOW_SITE_URL ?? "https://cctv.name"
const indexnowKey = process.env.INDEXNOW_KEY?.trim()

const log = (...args: unknown[]) => console.log("[indexnow]", ...args)

const submitUrls = async (): Promise<void> => {
  if (!indexnowKey) {
    log("INDEXNOW_KEY is not set; skipping submission.")
    return
  }

  const host = new URL(siteUrl).host
  const keyLocation = `${siteUrl.replace(/\/$/, "")}/${indexnowKey}.txt`
  const sitemapUrl = `${siteUrl.replace(/\/$/, "")}/sitemap.xml`

  log("Configuration:")
  log("  siteUrl:", siteUrl)
  log("  host:", host)
  log("  key:", indexnowKey.slice(0, 8) + "...")
  log("  keyLocation:", keyLocation)
  log("  sitemapUrl:", sitemapUrl)

  // Step 1: Verify key file is publicly accessible
  log("\nStep 1: Verifying key file accessibility...")
  try {
    const keyResp = await axios.get(keyLocation, { timeout: 10000 })
    log("  Key file status:", keyResp.status)
    log("  Key file content-type:", keyResp.headers["content-type"])
    log("  Key file body:", keyResp.data?.toString()?.trim())
    if (keyResp.status !== 200) {
      log("  ERROR: Key file not accessible. IndexNow will reject submissions.")
      return
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log("  ERROR: Could not fetch key file:", msg)
    return
  }

  // Step 2: Verify sitemap is accessible
  log("\nStep 2: Verifying sitemap accessibility...")
  try {
    const sitemapResp = await axios.get(sitemapUrl, { timeout: 10000 })
    log("  Sitemap status:", sitemapResp.status)
    log("  Sitemap content-type:", sitemapResp.headers["content-type"])
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log("  ERROR: Could not fetch sitemap:", msg)
    return
  }

  // Step 3: Test IndexNow API directly with a single URL
  log("\nStep 3: Testing IndexNow API directly...")
  const endpoint = "https://api.indexnow.org/IndexNow"
  const testPayload = {
    host,
    key: indexnowKey,
    keyLocation,
    urlList: [siteUrl],
  }
  log("  Endpoint:", endpoint)
  log(
    "  Payload:",
    JSON.stringify(
      { ...testPayload, key: testPayload.key.slice(0, 8) + "..." },
      null,
      2
    )
  )

  try {
    const testResp = await axios.post(endpoint, testPayload, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      validateStatus: () => true,
      timeout: 15000,
    })
    log("  Response status:", testResp.status)
    log("  Response headers:", JSON.stringify(testResp.headers, null, 2))
    log(
      "  Response body:",
      typeof testResp.data === "string"
        ? testResp.data
        : JSON.stringify(testResp.data, null, 2)
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log("  ERROR: Direct API call failed:", msg)
    if (axios.isAxiosError(err) && err.response) {
      log("  Response status:", err.response.status)
      log("  Response body:", err.response.data)
    }
  }

  // Step 4: Submit via IndexNowSubmitter
  log("\nStep 4: Submitting via IndexNowSubmitter...")
  const submitter = new IndexNowSubmitter({
    key: indexnowKey,
    host,
    keyLocation,
  })

  try {
    await submitter.submitFromSitemap(sitemapUrl)
    log("\nSubmission complete.")
    log("Analytics:", JSON.stringify(submitter.getAnalytics(), null, 2))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log("ERROR during submission:", msg)
    if (axios.isAxiosError(err) && err.response) {
      log("  Response status:", err.response.status)
      log("  Response body:", err.response.data)
    }
  }
}

try {
  await submitUrls()
} catch (error) {
  log("Fatal error:", error instanceof Error ? error.message : String(error))
  process.exit(1)
}
