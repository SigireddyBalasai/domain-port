import { redirect } from "next/navigation"
import type { JSX } from "react/jsx-runtime"

export default function AdminPage(): Promise<JSX.Element> {
  redirect("./comments")
}
