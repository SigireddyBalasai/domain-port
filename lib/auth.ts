import path from "node:path"
import { betterAuth } from "better-auth"
import { twoFactor } from "better-auth/plugins"
import sqlite3 from "better-sqlite3"

const dbPath = path.join(process.cwd(), "data", "auth.db")

const db = new sqlite3(dbPath)

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        unique: true,
      },
    },
  },
  plugins: [twoFactor()],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
})

export type Session = typeof auth.$Infer.Session
