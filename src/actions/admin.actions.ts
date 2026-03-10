'use server';

import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Todo from '@/models/Todo';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/permissions';

export async function getAllUsers() {
  try {
    const session = await auth();

    if (!session || !isAdmin(session)) {
      throw new Error('Unauthorized - Admin access required');
    }

    await dbConnect();

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const plainUsers = users.map(user => JSON.parse(JSON.stringify(user)));

    return { success: true, users: plainUsers as any[] };
  } catch (error) {
    return { success: false, users: [], error: (error as Error).message };
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    const session = await auth();

    if (!session || !isAdmin(session)) {
      throw new Error('Unauthorized - Admin access required');
    }

    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    await user.save();

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/users');

    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return { success: false, user: null, error: (error as Error).message };
  }
}

export async function getAdminStats() {
  try {
    const session = await auth();

    if (!session || !isAdmin(session)) {
      throw new Error('Unauthorized - Admin access required');
    }

    await dbConnect();

    const totalUsers = await User.countDocuments();
    const totalTodos = await Todo.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    return {
      success: true,
      stats: {
        totalUsers,
        totalTodos,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
      },
    };
  } catch (error) {
    return {
      success: false,
      stats: null,
      error: (error as Error).message,
    };
  }
}

export async function promoteUser(userId: string, role: 'USER' | 'ADMIN') {
  try {
    const session = await auth();

    if (!session || !isAdmin(session)) {
      throw new Error('Unauthorized - Admin access required');
    }

    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.role = role;
    await user.save();

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/users');

    return { success: true, user: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return { success: false, user: null, error: (error as Error).message };
  }
}

export async function getSystemInfo() {
  try {
    const session = await auth();

    if (!session || !isAdmin(session)) {
      throw new Error('Unauthorized - Admin access required');
    }

    await dbConnect();

    // Database stats
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });

    const pendingTodos = totalTodos - completedTodos;

    return {
      success: true,
      system: {
        database: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          totalTodos,
          completedTodos,
          pendingTodos,
        },
        environment: {
          nodeVersion: process.version,
          environment: process.env.NODE_ENV,
          serverTime: new Date().toISOString(),
          databaseStatus: 'Connected',
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      system: null,
      error: (error as Error).message,
    };
  }
}
