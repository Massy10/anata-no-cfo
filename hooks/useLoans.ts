import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { loansData as mockData } from '@/constants/mockData';

export type LoanItem = {
  id: string;
  name: string;
  principal: number;
  annual_rate: number;
  term_years: number;
  start_date: string;
  icon: string;
  bank_name: string;
};

function mapFromDB(row: any): LoanItem {
  return {
    id: row.id,
    name: row.name,
    principal: Number(row.principal),
    annual_rate: Number(row.annual_rate),
    term_years: row.term_years,
    start_date: row.start_date ?? '',
    icon: row.icon ?? '🏦',
    bank_name: row.bank_name ?? '',
  };
}

export function useLoans() {
  const { user } = useAuth();
  const isGuest = !user || user.id.startsWith('guest_');

  const [data, setData] = useState<LoanItem[]>(isGuest ? (mockData as LoanItem[]) : []);
  const [isLoading, setIsLoading] = useState(!isGuest);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (isGuest || !user) return;
    setIsLoading(true);
    const { data: rows, error: err } = await supabase
      .from('cfo_loans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (err) {
      setError(err.message);
      setData(mockData as LoanItem[]);
    } else {
      setData(rows?.map(mapFromDB) ?? []);
    }
    setIsLoading(false);
  }, [user?.id, isGuest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (item: Omit<LoanItem, 'id'>) => {
    if (isGuest) {
      setData(prev => [...prev, { ...item, id: `local_${Date.now()}` }]);
      return;
    }
    await supabase.from('cfo_loans').insert({ user_id: user!.id, ...item });
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const update = useCallback(async (id: string, updates: Partial<Omit<LoanItem, 'id'>>) => {
    if (isGuest) {
      setData(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
      return;
    }
    await supabase.from('cfo_loans').update(updates).eq('id', id);
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const remove = useCallback(async (id: string) => {
    setData(prev => prev.filter(l => l.id !== id));
    if (!isGuest && user) {
      await supabase.from('cfo_loans').delete().eq('id', id);
    }
  }, [user?.id, isGuest]);

  return { data, isLoading, error, create, update, remove, refetch: fetchData };
}
