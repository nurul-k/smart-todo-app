'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGoal } from '@/actions/goal.actions';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function NewGoalPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<'MONTHLY' | 'YEARLY' | 'CUSTOM'>('CUSTOM');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!startDate || !endDate) {
      setError('Start and End dates are required');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after start date');
      return;
    }

    setIsSubmitting(true);

    const result = await createGoal({
      title,
      description,
      startDate,
      endDate,
      type,
    });

    if (result.success) {
      router.push('/goals');
    } else {
      setError(result.error || 'Failed to create goal');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-black text-gray-900">
          ✨ Set New Goal
        </h1>
        <p className="text-gray-600 mt-2">
          Define your long-term vision and track your progress.
        </p>
      </section>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-8 shadow-lg space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Goal Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Learn Advanced React"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Description (Optional)
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your goal..."
          />
        </div>

        {/* Goal Type */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Goal Type
          </label>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as 'MONTHLY' | 'YEARLY' | 'CUSTOM')
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600">
            ❌ {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="w-full"
        >
          Create Goal
        </Button>
      </form>
    </div>
  );
}