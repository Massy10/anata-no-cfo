import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { scheduledExpensesData as mockData } from '@/constants/mockData';

export type ScheduledExpenseItem = {
  id: string;
  name: string;
  amount: number;
  scheduled_date: string;
  days: number;
  icon: string;
  memo: string;
  type: 'variable';
};

function calcDaysUntil(dateStr: string): number {
  const now = new Date();
  // Try to parse "2026年8月10日" or "2026年11月"
  const full = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
  if (full) {
    const target = new Date(parseInt(full[1]), parseInt(full[2]) - 1, parseInt(full[3]));
    return Math.max(0, Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }
  const partial = dateStr.match(/(\d+)年(\d+)月/);
  if (partial) {
    const target = new Date(parseInt(partial[1]), parseInt(partial[2]) - 1, 1);
    return Math.max(0, Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  }
  return 0;
}

function mapFromDB(row: any): ScheduledExpenseItem {
  return {
    id: row.id,
    name: row.name,
    amount: Number(row.amount),
    scheduled_date: row.scheduled_date ?? '',
    days: calcDaysUntil(row.scheduled_date ?? ''),
    icon: row.icon ?? '📅',
    memo: row.memo ?? '',
    type: 'variable',
  };
}

export function useScheduledExpenses() {
  const { user } = useAuth();
  const isGuest = !user || user.id.startsWith('guest_');

  const [data, setData] = useState<ScheduledExpenseItem[]>(isGuest ? (mockData as ScheduledExpenseItem[]) : []);
  const [isLoading, setIsLoading] = useState(!isGuest);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (isGuest || !user) return;
    setIsLoading(true);
    const { data: rows, error: err } = await supabase
      .from('cfo_scheduled_expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (err) {
      setError(err.message);
      setData(mockData as ScheduledExpenseItem[]);
    } else {
      setData(rows?.map(mapFromDB) ?? []);
    }
    setIsLoading(false);
  }, [user?.id, isGuest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (item: Omit<ScheduledExpenseItem, 'id' | 'days'>) => {
    if (isGuest) {
      setData(prev => [...prev, { ...item, id: `local_${Date.now()}`, days: calcDaysUntil(item.scheduled_date) }]);
      return;
    }
    await supabase.from('cfo_scheduled_expenses').insert({
      user_id: user!.id,
      name: item.name,
      amount: item.amount,
      scheduled_date: item.scheduled_date,
      icon: item.icon,
      memo: item.memo,
      type: item.type,
    });
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const update = useCallback(async (id: string, updates: Partial<Omit<ScheduledExpenseItem, 'id' | 'days'>>) => {
    if (isGuest) {
      setData(prev => prev.map(s => s.id === id ? {
        ...s, ...updates,
        days: updates.scheduled_date ? calcDaysUntil(updates.scheduled_date) : s.days,
      } : s));
      return;
    }
    await supabase.from('cfo_scheduled_expenses').update(updates).eq('id', id);
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const remove = useCallback(async (id: string) => {
    setData(prev => prev.filter(s => s.id !== id));
    if (!isGuest && user) {
      await supabase.from('cfo_scheduled_expenses').delete().eq('id', id);
    }
  }, [user?.id, isGuest]);

  return { data, isLoading, error, create, update, remove, refetch: fetchData };
}
