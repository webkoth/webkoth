import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveNpmBadge } from "./live-npm-badge";
import { LiveGhStars } from "./live-gh-stars";

export type CaseItem = {
  id: string;
  title: string;
  sub: string;
  stack: string[];
  audienceTag?: "founder" | "smb" | "agency";
  link?: string;
  openSource?: { npmPkg: string; ghOwner: string; ghRepo: string };
};

export function CaseCard({ item, tagLabel }: { item: CaseItem; tagLabel?: string }) {
  const body = (
    <Card id={item.id} className="h-full relative">
      {tagLabel ? (
        <span className="absolute right-3 top-3 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {tagLabel}
        </span>
      ) : null}
      <CardContent className="p-5 flex flex-col gap-3">
        <h3 className="text-base font-semibold pr-20">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.sub}</p>
        <div className="flex flex-wrap gap-1">
          {item.stack.map((s) => (
            <Badge key={s} variant="secondary" className="font-mono text-[10px]">{s}</Badge>
          ))}
        </div>
        {item.openSource && (
          <div className="flex flex-wrap gap-1 pt-1">
            <LiveNpmBadge pkg={item.openSource.npmPkg} />
            <LiveGhStars owner={item.openSource.ghOwner} repo={item.openSource.ghRepo} />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (item.link) {
    return (
      <Link href={item.link} className="block h-full transition-opacity hover:opacity-90">
        {body}
      </Link>
    );
  }
  return body;
}
