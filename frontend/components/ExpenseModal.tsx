'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const schema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(255),
  date: z.string().min(1, 'Date is required'),
  categoryId: z.string().uuid('Please select a category'),
});

type FormData = z.infer<typeof schema>;

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ExpenseFormData {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}

interface ExpenseModalProps {
  expense?: ExpenseFormData | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ExpenseModal({ expense, onClose, onSaved }: ExpenseModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: expense
      ? { amount: expense.amount, description: expense.description, date: expense.date, categoryId: expense.categoryId }
      : { date: new Date().toISOString().split('T')[0] },
  });

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');
    try {
      if (expense) {
        await api.patch(`/expenses/${expense.id}`, data);
      } else {
        await api.post('/expenses', data);
      }
      onSaved();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setError(message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {expense ? 'Edit Expense' : 'New Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <FormField label="Amount ($)" error={errors.amount?.message}>
            <Input
              {...register('amount')}
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <Input
              {...register('description')}
              placeholder="What did you spend on?"
            />
          </FormField>

          <FormField label="Date" error={errors.date?.message}>
            <Input {...register('date')} type="date" />
          </FormField>

          <FormField label="Category" error={errors.categoryId?.message}>
            <Select {...register('categoryId')}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </Select>
          </FormField>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Saving..."
              className="flex-1"
            >
              {expense ? 'Save Changes' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
