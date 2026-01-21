import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Github, Send } from "lucide-react";
import Link from "next/link";

interface ContactsProps {
  data: CVData;
  lang: "en" | "ru";
}

export function Contacts({ data, lang }: ContactsProps) {
  return (
    <Card>
      <CardHeader className="bg-primary/10 border-b border-primary/20">
        <CardTitle className="text-primary">{lang === "en" ? "Contacts" : "Контакты"}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-3">
        {data.contacts.email && (
          <Link 
            href={`mailto:${data.contacts.email}`} 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span className="break-all">{data.contacts.email}</span>
          </Link>
        )}
        {data.contacts.telegram && (
          <Link 
            href={`https://t.me/${data.contacts.telegram.replace('@', '')}`} 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>{data.contacts.telegram}</span>
          </Link>
        )}
        {data.contacts.github && (
          <Link 
            href={`https://${data.contacts.github}`} 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-4 h-4 shrink-0" />
            <span>{data.contacts.github}</span>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
