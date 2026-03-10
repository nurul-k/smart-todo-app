import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAdminStats } from '@/actions/admin.actions';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getSystemInfo } from '@/actions/admin.actions';

export default async function AdminDashboardPage() {
  const session = await auth();

  // Redirect non-authenticated or non-admin users
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const statsResult = await getAdminStats();
  const stats = statsResult.success ? statsResult.stats : null;

  const systemResult = await getSystemInfo();
  const system = systemResult.success ? systemResult.system : null;

  return (
    <div className="space-y-12 sm:space-y-14">
      <section className="space-y-3 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
          Admin Dashboard 🛠️
        </h1>
        <p className="text-lg text-gray-600">
          Manage your platform and users
        </p>
      </section>

      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-white/50 backdrop-blur p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-3">Total Users</h3>
            <p className="text-5xl font-black bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">{stats.totalUsers}</p>
          </div>
          <div className="rounded-2xl border border-green-200/50 bg-gradient-to-br from-green-50/80 to-white/50 backdrop-blur p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-3">Active Users</h3>
            <p className="text-5xl font-black bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">{stats.activeUsers}</p>
          </div>
          <div className="rounded-2xl border border-red-200/50 bg-gradient-to-br from-red-50/80 to-white/50 backdrop-blur p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-3">Inactive Users</h3>
            <p className="text-5xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">{stats.inactiveUsers}</p>
          </div>
          <div className="rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50/80 to-white/50 backdrop-blur p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-3">Total Todos</h3>
            <p className="text-5xl font-black bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">{stats.totalTodos}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">👥 User Management</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            View all users, activate/deactivate accounts, and manage roles.
          </p>
          <Link href="/admin/users">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all" variant="primary">
              Manage Users →
            </Button>
          </Link>
        </div>

        {system && (
        <div className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            📋 System Info
            </h2>

            {/* Database Info */}
            <div className="mb-6 space-y-2 text-sm text-gray-700">
            <p><strong>Total Users:</strong> {system.database.totalUsers}</p>
            <p><strong>Active Users:</strong> {system.database.activeUsers}</p>
            <p><strong>Inactive Users:</strong> {system.database.inactiveUsers}</p>
            <p><strong>Total Todos:</strong> {system.database.totalTodos}</p>
            <p><strong>Completed Todos:</strong> {system.database.completedTodos}</p>
            <p><strong>Pending Todos:</strong> {system.database.pendingTodos}</p>
            </div>

            {/* Environment Info */}
            <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <p><strong>Environment:</strong> {system.environment.environment}</p>
            <p><strong>Node Version:</strong> {system.environment.nodeVersion}</p>
            <p><strong>Server Time:</strong> {system.environment.serverTime}</p>
            <p><strong>Database Status:</strong> {system.environment.databaseStatus}</p>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}
