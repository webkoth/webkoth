"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const cache = new Map<string, number | null>();
const inflight = new Map<string, Promise<number | null>>();

function fetchDownloads(pkg: string): Promise<number | null> {
  if (cache.has(pkg)) return Promise.resolve(cache.get(pkg) ?? null);
  const pending = inflight.get(pkg);
  if (pending) return pending;
  const p = fetch(`https://api.npmjs.org/downloads/point/last-week/${pkg}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const n = data?.downloads ?? null;
      cache.set(pkg, n);
      inflight.delete(pkg);
      return n;
    })
    .catch(() => {
      cache.set(pkg, null);
      inflight.delete(pkg);
      return null;
    });
  inflight.set(pkg, p);
  return p;
}

export function LiveNpmBadge({ pkg }: { pkg: string }) {
  const [dl, setDl] = useState<number | null | undefined>(() =>
    cache.has(pkg) ? cache.get(pkg) ?? null : undefined
  );

  useEffect(() => {
    if (dl !== undefined) return;
    let alive = true;
    fetchDownloads(pkg).then((n) => {
      if (alive) setDl(n);
    });
    return () => {
      alive = false;
    };
  }, [pkg, dl]);

  if (dl === undefined || dl === null) return null;
  return (
    <Badge variant="outline" className="font-mono text-xs">
      npm · {dl.toLocaleString("en-US")} / wk
    </Badge>
  );
}
