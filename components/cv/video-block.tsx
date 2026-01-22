"use client"

import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube } from "lucide-react";

interface VideoBlockProps {
  data: CVData;
  lang: "en" | "ru";
}

export function VideoBlock({ data, lang }: VideoBlockProps) {
  if (!data.video) return null;

  // Extract video ID from URL
  const videoId = data.video.url.split("v=")[1];

  return (
    <Card className="p-0 gap-0 overflow-hidden">
      <CardHeader className="bg-primary/10 border-b border-primary/20 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Youtube className="w-5 h-5" />
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
