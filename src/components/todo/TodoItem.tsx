'use client';

import Button from '@/components/ui/Button';
import { toggleTodo, deleteTodo } from '@/actions/todo.actions';
import { useState } from 'react';

interface TodoItemProps {
  _id: string;
  title: string;
  completed: boolean;
  onDelete?: () => void;
  onToggle?: (completed: boolean) => void;
}

export default function TodoItem({ _id, title, completed, onDelete, onToggle }: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
    const newCompleted = !completed;
    setIsLoading(true);

    // Optimistic update
    onToggle?.(newCompleted);

    const result = await toggleTodo(_id);

    if (!result.success) {
        // revert if failed
        onToggle?.(completed);
    }

    setIsLoading(false);
    };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      setIsLoading(true);
      await deleteTodo(_id);
      onDelete?.();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 sm:p-5 bg-white/60 backdrop-blur rounded-xl hover:bg-white/80 transition-all duration-300 border border-white/30">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          disabled={isLoading}
          className="w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0 border border-gray-300 hover:border-blue-500 transition"
        />
        <span
          className={`text-base font-medium truncate ${
            completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
        >
          {title}
        </span>
      </div>
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={isLoading}
        className="flex-shrink-0"
      >
        Delete
      </Button>
    </div>
  );
}
