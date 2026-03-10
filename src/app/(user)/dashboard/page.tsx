import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TodoList from '@/components/todo/TodoList';

export default async function DashboardPage() {
  const session = await auth();

  // Redirect non-authenticated or admin users
  if (!session) {
    redirect('/login');
  }

  if ((session.user as any)?.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  return (
    <div className="space-y-12 sm:space-y-14">
      <section className="space-y-3 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
          Welcome, {(session.user as any).name}! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Manage your tasks and stay organized
        </p>
      </section>

      <div className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 sm:p-8">
        <TodoList />
      </div>
    </div>
  );
}
