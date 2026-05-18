import { Badge } from "@/components/ui/badge";

async function getDownloads(pkg: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.npmjs.org/downloads/point/last-week/${pkg}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.downloads ?? null;
  } catch {
    return null;
  }
}

export async function LiveNpmBadge({ pkg }: { pkg: string }) {
  const dl = await getDownloads(pkg);
  if (dl === null) return null;
  return (
    <Badge variant="outline" className="font-mono text-xs">
      npm · {dl.toLocaleString("en-US")} / wk
    </Badge>
  );
}
