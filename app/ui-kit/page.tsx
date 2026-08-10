import type { Metadata } from "next"
import { Showcase } from "./showcase"

export const metadata: Metadata = {
  title: "Webkoth UI Kit",
  description:
    "Живая витрина темы и компонентов Webkoth UI — shadcn registry (base-vega, Tailwind v4, OKLCH).",
  robots: { index: false, follow: false },
}

export default function UiKitPage() {
  return <Showcase />
}
