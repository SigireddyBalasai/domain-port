"use client"

import { useRouter } from "next/navigation"
import { type JSX, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { signIn, twoFactor } from "@/lib/auth-client"

export default function LoginPage(): JSX.Element {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [step, setStep] = useState<"credentials" | "totp">("credentials")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const totpRef = useRef<HTMLInputElement>(null)

  const handleCredentialsSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/admin/comments",
        fetchOptions: {
          onError: (ctx) => {
            if (ctx.error.code === "TWO_FACTOR_NOT_ENABLED") {
              setError("2FA is required. Please enter your TOTP code.")
              setStep("totp")
              setTimeout(() => totpRef.current?.focus(), 0)
            } else {
              setError(ctx.error.message || "Invalid credentials")
            }
          },
          onSuccess: () => {
            router.push("/admin/comments")
          },
        },
      })
    } catch (error_) {
      if (error_ instanceof Error && error_.message.includes("TWO_FACTOR")) {
        setStep("totp")
        setTimeout(() => totpRef.current?.focus(), 0)
        setError("Enter your TOTP code to continue")
      } else {
        setError("Invalid credentials")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTotpSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await twoFactor.verifyTotp({
        code: totpCode,
        fetchOptions: {
          onSuccess: () => {
            router.push("/admin/comments")
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Invalid TOTP code")
          },
        },
      })
    } catch {
      setError("Invalid TOTP code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === "credentials" ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              handleCredentialsSubmit(e).catch(console.error)
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                required
                id="email"
                type="email"
                value={email}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                required
                id="password"
                type="password"
                value={password}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              handleTotpSubmit(e).catch(console.error)
            }}
          >
            <div>
              <label
                htmlFor="totp"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                TOTP Code
              </label>
              <input
                required
                ref={totpRef}
                id="totp"
                type="text"
                inputMode="numeric"
                value={totpCode}
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-center text-2xl tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => {
                  setTotpCode(e.target.value)
                }}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
