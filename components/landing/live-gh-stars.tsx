import { Badge } from "@/components/ui/badge";

async function getStars(owner: string, repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "webkoth-landing" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

export async function LiveGhStars({ owner, repo }: { owner: string; repo: string }) {
  const stars = await getStars(owner, repo);
  if (stars === null) return null;
  return (
    <Badge variant="outline" className="font-mono text-xs">
      GitHub · ★ {stars}
    </Badge>
  );
}
