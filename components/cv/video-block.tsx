"use client"

import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

interface VideoBlockProps {
  data: CVData;
  lang: "en" | "ru";
}

export function VideoBlock({ data }: VideoBlockProps) {
  if (!data.video) return null;

  // Extract video ID from URL
  const videoId = data.video.url.split("v=")[1];

  return (
    <Card className="p-0 gap-0 overflow-hidden">
      <CardHeader className="bg-primary/10 border-b border-primary/20 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <YoutubeIcon className="w-5 h-5" />
          {data.video.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={data.video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
}
