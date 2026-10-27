import { describe, expect, it } from "vitest"
import { unstable_getResponseFromNextConfig } from "next/experimental/testing/server"
import nextConfig from "../../next.config.mjs"

describe("CV routing", () => {
  it.each(["/en/minasarkisyan", "/en/minasarkisyan?utm_source=cv"])(
    "keeps %s accessible",
    async (path) => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://webkoth.com${path}`,
        nextConfig,
      })
      expect(response.status).toBe(200)
      expect(response.headers.get("location")).toBeNull()
    }
  )

  it.each([
    "/en",
    "/en/standard",
    "/en/cases/seller-workspace",
    "/en/minasarkisyan-other",
    "/en/minasarkisyan/other",
  ])("preserves the marketing redirect for %s", async (path) => {
    const response = await unstable_getResponseFromNextConfig({
      url: `https://webkoth.com${path}`,
      nextConfig,
    })
    expect(response.status).toBe(308)
    expect(response.headers.get("location")).toBe("https://webkoth.com/")
  })
})
