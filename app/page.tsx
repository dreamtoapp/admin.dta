import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import SignInForm from './auth/signin/SignInForm';

export default async function RootPage() {
  const session = await auth();

  if (session) {
    const role = session.user?.role?.toUpperCase();
    if (role === 'ADMIN') {
      redirect('/dashboard/admin');
    } else if (role === 'STAFF') {
      redirect('/dashboard/staff');
    } else {
      redirect('/dashboard/client');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-center text-sm text-gray-600">Access your unified dashboard</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}

