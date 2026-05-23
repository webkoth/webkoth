"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const cache = new Map<string, number | null>();
const inflight = new Map<string, Promise<number | null>>();

function fetchStars(owner: string, repo: string): Promise<number | null> {
  const key = `${owner}/${repo}`;
  if (cache.has(key)) return Promise.resolve(cache.get(key) ?? null);
  const pending = inflight.get(key);
  if (pending) return pending;
  const p = fetch(`https://api.github.com/repos/${owner}/${repo}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const n = data?.stargazers_count ?? null;
      cache.set(key, n);
      inflight.delete(key);
      return n;
    })
    .catch(() => {
      cache.set(key, null);
      inflight.delete(key);
      return null;
    });
  inflight.set(key, p);
  return p;
}

export function LiveGhStars({ owner, repo }: { owner: string; repo: string }) {
  const key = `${owner}/${repo}`;
  const [stars, setStars] = useState<number | null | undefined>(() =>
    cache.has(key) ? cache.get(key) ?? null : undefined
  );

  useEffect(() => {
    if (stars !== undefined) return;
    let alive = true;
    fetchStars(owner, repo).then((n) => {
      if (alive) setStars(n);
    });
    return () => {
      alive = false;
    };
  }, [owner, repo, stars]);

  if (stars === undefined || stars === null) return null;
  return (
    <Badge variant="outline" className="font-mono text-xs">
      GitHub · ★ {stars}
    </Badge>
  );
}
