import { redirect } from 'next/navigation';

export default function RootPage() {
  // This page will be handled by middleware, but as a fallback redirect to /en
  redirect('/en');
}
