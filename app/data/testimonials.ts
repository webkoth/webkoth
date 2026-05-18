export type Testimonial = {
  id: string;
  quote: { ru: string; en: string };
  author: string;
  role: { ru: string; en: string };
  href?: string;
};

export const testimonials: ReadonlyArray<Testimonial> = [];
