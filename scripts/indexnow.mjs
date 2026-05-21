import { IndexNowSubmitter } from "indexnow-submitter"

const siteUrl = process.env.INDEXNOW_SITE_URL ?? "https://cctv.name"
const indexnowKey = process.env.INDEXNOW_KEY?.trim()

async function submitUrls() {
  if (!indexnowKey) {
    console.log("[indexnow] INDEXNOW_KEY is not set; skipping submission.")
    return
  }

  const submitter = new IndexNowSubmitter({
    key: indexnowKey,
    host: new URL(siteUrl).host,
    keyLocation: `${siteUrl.replace(/\/$/, "")}/${indexnowKey}.txt`,
  })

  await submitter.submitFromSitemap(`${siteUrl.replace(/\/$/, "")}/sitemap.xml`)

  console.log("[indexnow] Submitted sitemap URLs to IndexNow.")
  console.log("[indexnow] Analytics:", submitter.getAnalytics())
}

submitUrls().catch((error) => {
  console.warn(
    `[indexnow] ${error instanceof Error ? error.message : String(error)}`
  )
})