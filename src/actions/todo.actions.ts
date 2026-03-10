'use server';

import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Todo from '@/models/Todo';
import { revalidatePath } from 'next/cache';
import { checkUserOwnership, isUser } from '@/lib/permissions';

export async function addTodo(title: string) {
  try {
    const session = await auth();

    if (!session || !isUser(session)) {
      throw new Error('Unauthorized');
    }

    if (!title.trim()) {
      throw new Error('Todo title cannot be empty');
    }

    await dbConnect();

    const todo = await Todo.create({
      title: title.trim(),
      userId: (session.user as any).id,
      completed: false,
    });

    revalidatePath('/dashboard');
    return { success: true, todo: JSON.parse(JSON.stringify(todo)) };
  } catch (error) {
    return { success: false, todo: null, error: (error as Error).message };
  }
}

export async function getTodos() {
  try {
    const session = await auth();

    if (!session) {
      throw new Error('Unauthorized');
    }

    await dbConnect();

    const todos = await Todo.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });
    const plainTodos = todos.map(todo => JSON.parse(JSON.stringify(todo)));

    return { success: true, todos: plainTodos };
  } catch (error) {
    return { success: false, todos: [], error: (error as Error).message };
  }
}

export async function toggleTodo(todoId: string) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error('Unauthorized');
    }

    await dbConnect();

    const todo = await Todo.findById(todoId);

    if (!todo) {
      throw new Error('Todo not found');
    }

    if (!checkUserOwnership((session.user as any).id, todo.userId.toString())) {
      throw new Error('Unauthorized to modify this todo');
    }

    todo.completed = !todo.completed;
    await todo.save();

    revalidatePath('/dashboard');
    return { success: true, todo: JSON.parse(JSON.stringify(todo)) };
  } catch (error) {
    return { success: false, todo: null, error: (error as Error).message };
  }
}

export async function deleteTodo(todoId: string) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error('Unauthorized');
    }

    await dbConnect();

    const todo = await Todo.findById(todoId);

    if (!todo) {
      throw new Error('Todo not found');
    }

    if (!checkUserOwnership((session.user as any).id, todo.userId.toString())) {
      throw new Error('Unauthorized to delete this todo');
    }

    await Todo.deleteOne({ _id: todoId });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
