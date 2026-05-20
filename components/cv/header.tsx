import { CVData } from "@/app/data/cv";
import Image from "next/image";

interface HeaderProps {
  data: CVData;
}

export function Header({ data }: HeaderProps) {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-start">
      <div className="size-28 md:size-32 relative shrink-0">
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

      <div className="flex-1 space-y-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{data.name}</h1>
          <p className="mt-1 text-lg font-semibold text-foreground md:text-xl">{data.role}</p>
          <p className="mt-0.5 text-sm text-muted-foreground md:text-base">{data.roleSub}</p>
          <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">{data.location}</p>
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {data.pitch}
        </p>

        <div className="flex flex-wrap gap-5 md:gap-7 pt-1">
          {data.metrics.map((m) => (
            <div key={m.label}>
              <div className="text-2xl font-bold tabular-nums md:text-3xl">
                {m.value}{m.suffix}
              </div>
              <div className="text-xs text-muted-foreground md:text-sm">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
