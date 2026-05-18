import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveNpmBadge } from "./live-npm-badge";
import { LiveGhStars } from "./live-gh-stars";

export type CaseItem = {
  id: string;
  title: string;
  sub: string;
  stack: string[];
  openSource?: { npmPkg: string; ghOwner: string; ghRepo: string };
};

export function CaseCard({ item }: { item: CaseItem }) {
  return (
    <Card id={item.id} className="h-full">
      <CardContent className="p-5 flex flex-col gap-3">
        <h3 className="text-base font-semibold">{item.title}</h3>
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
}
