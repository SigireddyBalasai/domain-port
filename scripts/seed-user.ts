import database from "bun:sqlite"
import path from "node:path"
import { auth } from "@/lib/auth"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin"

const seed = async () => {
  const dbPath = path.join(process.cwd(), "data", "auth.db")
  const db = new database(dbPath)

  console.log("Checking for existing users...")

  const existing = db
    .prepare("SELECT id FROM user WHERE email = ?")
    .get(ADMIN_EMAIL)

  if (existing) {
    console.log(`User ${ADMIN_EMAIL} already exists. Skipping.`)
    db.close()
    return
  }

  console.log(`Creating user ${ADMIN_EMAIL}...`)

  const result = await auth.api.signUpEmail({
    body: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
      username: "admin",
    },
  })

  if (!result?.user?.id) {
    console.error("Failed to create user")
    db.close()
    process.exit(1)
  }

  console.log(`User created with ID: ${result.user.id}`)
  console.log("\n=== Next Steps ===")
  console.log("1. Start the dev server: bun run dev")
  console.log("2. Go to http://localhost:3000/login and sign in")
  console.log("3. After signing in, set up TOTP using the two-factor API")
  console.log("\n=== Done ===")

  db.close()
}

try {
  await seed()
} catch (error) {
  console.error("Seed failed:", error)
  process.exit(1)
}
