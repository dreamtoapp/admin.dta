import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to unified dashboard
  redirect('/dashboard');
}

