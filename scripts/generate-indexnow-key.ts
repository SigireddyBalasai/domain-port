import fs from "fs"
import path from "path"

const indexnowKey = process.env.INDEXNOW_KEY?.trim()

if (!indexnowKey) {
  console.log("[indexnow-key] INDEXNOW_KEY is not set; skipping key file generation.")
  process.exit(0)
}

const keyFileName = `${indexnowKey}.txt`
const keyFilePath = path.join(process.cwd(), "public", keyFileName)

fs.writeFileSync(keyFilePath, indexnowKey, "utf8")
console.log(`[indexnow-key] Generated public/${keyFileName}`)
