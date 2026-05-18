import { CVData } from "@/app/data/cv";
import Image from "next/image";

interface HeaderProps {
  data: CVData;
}

export function Header({ data }: HeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-32 h-32 md:w-40 md:h-40 relative shrink-0">
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
      
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">{data.name}</h1>
        <p className="text-lg text-primary font-medium">{data.role}</p>
      </div>
    </div>
  );
}
