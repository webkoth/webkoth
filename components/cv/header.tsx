import { CVData } from "@/app/data/cv";
import Image from "next/image";

interface HeaderProps {
  data: CVData;
}

export function Header({ data }: HeaderProps) {
  return (
    <header className="flex flex-col items-center gap-5 text-center md:flex-row md:items-start md:gap-6 md:text-left">
      <div className="size-24 md:size-28 relative shrink-0">
        <div className="absolute inset-0 rounded-full bg-muted overflow-hidden border-4 border-background shadow-xl">
          <Image
            src="/images/profile.jpg"
            alt={data.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{data.name}</h1>
          <p className="mt-0.5 text-base font-semibold text-foreground md:text-lg">{data.role}</p>
          <p className="text-xs text-muted-foreground md:text-sm">{data.roleSub}</p>
          <p className="text-xs text-muted-foreground">{data.location}</p>
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {data.pitch}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2 md:justify-start md:gap-6">
          {data.metrics.map((m) => (
            <div key={m.label}>
              <div className="text-xl font-bold tabular-nums md:text-2xl">
                {m.value}{m.suffix}
              </div>
              <div className="text-[11px] text-muted-foreground md:text-xs">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
