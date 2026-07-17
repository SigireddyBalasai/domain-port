"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

export interface ConsentState {
  necessary: true
  ads: boolean
  analytics: boolean
}

const STORAGE_KEY = "cctv-consent"

interface ConsentContextValue {
  consent: ConsentState | null
  ready: boolean
  acceptAll: () => void
  rejectAll: () => void
  save: (next: Partial<Omit<ConsentState, "necessary">>) => void
  openPreferences: () => void
  closePreferences: () => void
  preferencesOpen: boolean
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export function ConsentProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [consent, setConsent] = useState<ConsentState | null>(null)
  const [ready, setReady] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)

      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ConsentState>

        setConsent({
          necessary: true,
          ads: Boolean(parsed.ads),
          analytics: Boolean(parsed.analytics),
        })
      }
    } catch {
      setConsent(null)
    }

    setReady(true)
  }, [])

  const persist = useCallback((next: ConsentState) => {
    setConsent(next)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }, [])

  const acceptAll = useCallback(() => {
    persist({ necessary: true, ads: true, analytics: true })
    setPreferencesOpen(false)
  }, [persist])

  const rejectAll = useCallback(() => {
    persist({ necessary: true, ads: false, analytics: false })
    setPreferencesOpen(false)
  }, [persist])

  const save = useCallback(
    (next: Partial<Omit<ConsentState, "necessary">>) => {
      persist({
        necessary: true,
        ads: next.ads ?? consent?.ads ?? false,
        analytics: next.analytics ?? consent?.analytics ?? false,
      })
      setPreferencesOpen(false)
    },
    [persist, consent]
  )

  const openPreferences = useCallback(() => setPreferencesOpen(true), [])
  const closePreferences = useCallback(() => setPreferencesOpen(false), [])

  return (
    <ConsentContext.Provider
      value={{
        consent,
        ready,
        acceptAll,
        rejectAll,
        save,
        openPreferences,
        closePreferences,
        preferencesOpen,
      }}
    >
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext)

  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider")
  }

  return ctx
}
