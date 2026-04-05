import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { incomeData as mockData } from '@/constants/mockData';
import { isoToJP, jpToISO } from '@/lib/dateUtils';

export type IncomeItem = {
  id: string;
  name: string;
  amount: number;
  currency: 'JPY' | 'USD';
  payment_method: string;
  tag: string;
  date: string; // "4月4日" format
  icon: string;
};

function mapFromDB(row: any): IncomeItem {
  return {
    id: row.id,
    name: row.name,
    amount: Number(row.amount),
    currency: row.currency as 'JPY' | 'USD',
    payment_method: row.payment_method ?? '',
    tag: row.tag ?? '',
    date: isoToJP(row.date),
    icon: row.icon ?? '💰',
  };
}

export function useIncome() {
  const { user } = useAuth();
  const isGuest = !user || user.id.startsWith('guest_');

  const [data, setData] = useState<IncomeItem[]>(isGuest ? (mockData as IncomeItem[]) : []);
  const [isLoading, setIsLoading] = useState(!isGuest);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (isGuest || !user) return;
    setIsLoading(true);
    const { data: rows, error: err } = await supabase
      .from('cfo_income')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (err) {
      setError(err.message);
      setData(mockData as IncomeItem[]); // fallback
    } else {
      setData(rows?.map(mapFromDB) ?? []);
    }
    setIsLoading(false);
  }, [user?.id, isGuest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (item: Omit<IncomeItem, 'id'>) => {
    if (isGuest) {
      setData(prev => [{ ...item, id: `local_${Date.now()}` }, ...prev]);
      return;
    }
    await supabase.from('cfo_income').insert({
      user_id: user!.id,
      name: item.name,
      amount: item.amount,
      currency: item.currency,
      payment_method: item.payment_method,
      tag: item.tag,
      icon: item.icon,
      date: jpToISO(item.date),
    });
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const update = useCallback(async (id: string, updates: Partial<Omit<IncomeItem, 'id'>>) => {
    if (isGuest) {
      setData(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
      return;
    }
    const dbUpdates: any = { ...updates };
    if (updates.date) dbUpdates.date = jpToISO(updates.date);
    await supabase.from('cfo_income').update(dbUpdates).eq('id', id);
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const remove = useCallback(async (id: string) => {
    setData(prev => prev.filter(i => i.id !== id));
    if (!isGuest && user) {
      await supabase.from('cfo_income').delete().eq('id', id);
    }
  }, [user?.id, isGuest]);

  return { data, isLoading, error, create, update, remove, refetch: fetchData };
}
