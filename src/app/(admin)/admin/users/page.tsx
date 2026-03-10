'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, toggleUserStatus, promoteUser } from '@/actions/admin.actions';
import { User } from '@/types/user';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    const result = await getAllUsers();

    if (result.success) {
      setUsers(result.users);
    } else {
      setError(result.error || 'Failed to load users');
    }

    setLoading(false);
  };

  const handleToggleStatus = async (userId: string) => {
    const result = await toggleUserStatus(userId);

    if (result.success) {
      await fetchUsers();
    } else {
      setError(result.error || 'Failed to update user status');
    }
  };

  const handlePromote = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';

    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      const result = await promoteUser(userId, newRole as 'USER' | 'ADMIN');

      if (result.success) {
        await fetchUsers();
      } else {
        setError(result.error || 'Failed to promote user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
          <p className="text-lg font-medium text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="animate-fade-in">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
                👥 User Management
            </h1>
            <p className="text-lg text-gray-600">
                View and manage all platform users
            </p>
            </div>

            {/* Back Button */}
            <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-all duration-200 shadow-sm"
            >
            ← Back
            </button>
        </div>
        </section>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50/80 text-red-700 px-4 py-3 flex items-center gap-2 backdrop-blur-sm">
          <span>❌</span>
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-12 text-center">
          <p className="text-lg text-gray-600 font-medium">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl shadow-lg">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user._id} className={`border-b border-white/30 hover:bg-white/40 transition-colors ${
                  idx % 2 === 0 ? 'bg-white/10' : 'bg-white/20'
                }`}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      user.role === 'ADMIN'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                    }`}>
                      {user.role === 'ADMIN' ? '👑 ' : '👤 '} {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      user.isActive
                        ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
                        : 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    }`}>
                      ● {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(user.createdAt!).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant={user.isActive ? 'danger' : 'secondary'}
                        onClick={() => handleToggleStatus(user._id!)}
                      >
                        {user.isActive ? '🔴 Deactivate' : '🟢 Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePromote(user._id!, user.role)}
                      >
                        {user.role === 'ADMIN' ? '⬇️ Demote' : '⬆️ Promote'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
