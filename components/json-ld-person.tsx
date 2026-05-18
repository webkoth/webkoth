import { CVData } from "@/app/data/cv";

interface JsonLdPersonProps {
  data: CVData;
  lang: "en" | "ru";
}

export function JsonLdPerson({ data, lang }: JsonLdPersonProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com';
  
  // Get current job from experience
  const currentJob = data.experience[0];
  
  // Build skills array
  const skills = data.skills.map(skill => skill.name);
  
  // Build sameAs array (social profiles)
  const sameAs: string[] = [];
  if (data.contacts.github) {
    sameAs.push(`https://${data.contacts.github}`);
  }
  if (data.contacts.linkedin) {
    sameAs.push(data.contacts.linkedin);
  }
  if (data.contacts.telegram) {
    sameAs.push(`https://t.me/${data.contacts.telegram.replace('@', '')}`);
  }
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": data.name,
    "jobTitle": data.role,
    "description": data.about,
    "email": data.contacts.email,
    "url": baseUrl,
    "sameAs": sameAs,
    "knowsAbout": skills,
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": data.education.university,
      "department": {
        "@type": "Organization",
        "name": data.education.faculty
      }
    },
    "worksFor": currentJob ? {
      "@type": "Organization",
      "name": currentJob.company,
      "jobTitle": currentJob.role
    } : undefined,
    "hasOccupation": {
      "@type": "Occupation",
      "name": data.role,
      "occupationLocation": {
        "@type": "Country",
        "name": "Russia"
      }
    }
  };

  // Remove undefined fields
  if (!jsonLd.worksFor) {
    delete jsonLd.worksFor;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
