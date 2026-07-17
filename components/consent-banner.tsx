"use client"

import { useTranslations } from "next-intl"
import { useConsent } from "@/components/consent-provider"

export function ConsentBanner(): React.ReactElement | null {
  const {
    ready,
    acceptAll,
    rejectAll,
    save,
    openPreferences,
    preferencesOpen,
  } = useConsent()
  const t = useTranslations("consent")

  if (!ready) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="bg-background/95 border-border fixed inset-x-0 bottom-0 z-50 border-t shadow-lg backdrop-blur"
    >
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-sm">
          <span className="font-semibold">{t("title")}</span> {t("description")}
        </p>

        {preferencesOpen ? (
          <div className="mt-4 space-y-3 text-sm">
            <Row
              label={t("necessary")}
              desc={t("necessaryDesc")}
              checked
              disabled
            />
            <Row
              label={t("ads")}
              desc={t("adsDesc")}
              defaultChecked
              onChange={(v) => save({ ads: v, analytics: false })}
            />
            <Row
              label={t("analytics")}
              desc={t("analyticsDesc")}
              defaultChecked
              onChange={(v) => save({ ads: false, analytics: v })}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={acceptAll}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
              >
                {t("accept")}
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="border-border hover:bg-muted rounded-md border px-4 py-2 text-sm font-medium"
              >
                {t("reject")}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={acceptAll}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
            >
              {t("accept")}
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="border-border hover:bg-muted rounded-md border px-4 py-2 text-sm font-medium"
            >
              {t("reject")}
            </button>
            <button
              type="button"
              onClick={openPreferences}
              className="rounded-md px-4 py-2 text-sm font-medium hover:underline"
            >
              {t("save")}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({
  label,
  desc,
  checked,
  disabled,
  defaultChecked,
  onChange,
}: {
  label: string
  desc: string
  checked?: boolean
  disabled?: boolean
  defaultChecked?: boolean
  onChange?: (value: boolean) => void
}): React.ReactElement {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1"
      />
      <span>
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground block">{desc}</span>
      </span>
    </label>
  )
}
