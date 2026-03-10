'use client';

import {
  useState,
  useEffect,
  type FormEvent,
} from 'react';
import TodoItem from './TodoItem';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { addTodo, getTodos } from '@/actions/todo.actions';
import type { Todo } from '@/types/todo';

type FilterType = 'ALL' | 'COMPLETED' | 'PENDING';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const pendingCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const completionRate =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    void fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    const result = await getTodos();
    if (result.success) {
      setTodos(result.todos);
    }
    setLoading(false);
  };

  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const trimmed = title.trim();
    if (!trimmed) {
      setError('Todo title cannot be empty');
      return;
    }

    setIsAdding(true);
    const result = await addTodo(trimmed);

    if (result.success) {
      setTitle('');
      await fetchTodos();
    } else {
      setError(result.error || 'Failed to add todo');
    }

    setIsAdding(false);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'COMPLETED') return todo.completed;
    if (filter === 'PENDING') return !todo.completed;
    return true;
  });

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-3xl space-y-6">
        <div className="rounded-2xl border border-white/40 bg-white/40 p-8 backdrop-blur-xl animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-8 sm:space-y-10">
      {/* Add Todo Form */}
      <form
        onSubmit={handleAddTodo}
        className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm backdrop-blur"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add a new task
            </h2>
            <p className="text-sm text-slate-500">
              Capture what&apos;s on your mind and get it out of your head.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            type="text"
            placeholder="e.g. Plan weekly review, buy groceries..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isAdding}
            className="flex-1"
          />
          <Button
            type="submit"
            isLoading={isAdding}
            className="w-full shrink-0 sm:w-auto"
          >
            Add Todo
          </Button>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </form>

      {/* Filter + quick info */}
      <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">
              Filter tasks
            </p>
            <p className="text-xs text-slate-500">
              View all, only completed, or only pending tasks.
            </p>
          </div>

          <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs sm:text-sm">
            {(['ALL', 'COMPLETED', 'PENDING'] as FilterType[]).map((f) => {
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={isActive}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {f === 'ALL'
                    ? 'All'
                    : f === 'COMPLETED'
                    ? 'Completed'
                    : 'Pending'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Todos List */}
      <div className="rounded-2xl border border-slate-100 bg-white/80 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Your tasks
          </h3>
          <p className="text-xs text-slate-500">
            {filteredTodos.length} shown · {totalCount} total
          </p>
        </div>

        {filteredTodos.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            {filter === 'ALL' ? (
              <p>
                No todos yet. Start by adding your first task above.
              </p>
            ) : filter === 'COMPLETED' ? (
              <p>No completed todos yet. Mark tasks as done as you go.</p>
            ) : (
              <p>Everything is done here. Nice work!</p>
            )}
          </div>
        ) : (
          <div className="max-h-[420px] space-y-4 overflow-y-auto px-4 py-4">
            {filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 transition hover:border-blue-100 hover:bg-blue-50/70"
              >
                <TodoItem
                _id={todo._id!}
                title={todo.title}
                completed={todo.completed}
                onDelete={() => {
                    setTodos((prevTodos) =>
                    prevTodos.filter((t) => t._id !== todo._id)
                    );
                }}
                onToggle={(newCompleted) => {
                    setTodos((prevTodos) =>
                    prevTodos.map((t) =>
                        t._id === todo._id
                        ? { ...t, completed: newCompleted }
                        : t
                    )
                    );
                }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Progress overview
            </p>
            <p className="text-xs text-slate-500">
              You&apos;ve completed {completionRate}% of your tasks.
            </p>
          </div>

          <div className="w-full space-y-2 sm:w-1/2">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 sm:text-xs">
              <span>{pendingCount} pending</span>
              <span>{completedCount} completed</span>
              <span>{totalCount} total</span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}