import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { expenseData as mockData } from '@/constants/mockData';
import { isoToJP, jpToISO } from '@/lib/dateUtils';

export type ExpenseItem = {
  id: string;
  name: string;
  amount: number;
  currency: 'JPY' | 'USD';
  payment_method: string;
  tag: string;
  type: 'fixed' | 'variable';
  date: string; // "4月4日" format
  icon: string;
};

function mapFromDB(row: any): ExpenseItem {
  return {
    id: row.id,
    name: row.name,
    amount: Number(row.amount),
    currency: row.currency as 'JPY' | 'USD',
    payment_method: row.payment_method ?? '',
    tag: row.tag ?? '',
    type: row.type as 'fixed' | 'variable',
    date: isoToJP(row.date),
    icon: row.icon ?? '🛒',
  };
}

export function useExpenses() {
  const { user } = useAuth();
  const isGuest = !user || user.id.startsWith('guest_');

  const [data, setData] = useState<ExpenseItem[]>(isGuest ? (mockData as ExpenseItem[]) : []);
  const [isLoading, setIsLoading] = useState(!isGuest);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (isGuest || !user) return;
    setIsLoading(true);
    const { data: rows, error: err } = await supabase
      .from('cfo_expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (err) {
      setError(err.message);
      setData(mockData as ExpenseItem[]);
    } else {
      setData(rows?.map(mapFromDB) ?? []);
    }
    setIsLoading(false);
  }, [user?.id, isGuest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (item: Omit<ExpenseItem, 'id'>) => {
    if (isGuest) {
      setData(prev => [{ ...item, id: `local_${Date.now()}` }, ...prev]);
      return;
    }
    await supabase.from('cfo_expenses').insert({
      user_id: user!.id,
      name: item.name,
      amount: item.amount,
      currency: item.currency,
      payment_method: item.payment_method,
      tag: item.tag,
      type: item.type,
      icon: item.icon,
      date: jpToISO(item.date),
    });
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const update = useCallback(async (id: string, updates: Partial<Omit<ExpenseItem, 'id'>>) => {
    if (isGuest) {
      setData(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      return;
    }
    const dbUpdates: any = { ...updates };
    if (updates.date) dbUpdates.date = jpToISO(updates.date);
    await supabase.from('cfo_expenses').update(dbUpdates).eq('id', id);
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const remove = useCallback(async (id: string) => {
    setData(prev => prev.filter(e => e.id !== id));
    if (!isGuest && user) {
      await supabase.from('cfo_expenses').delete().eq('id', id);
    }
  }, [user?.id, isGuest]);

  return { data, isLoading, error, create, update, remove, refetch: fetchData };
}
