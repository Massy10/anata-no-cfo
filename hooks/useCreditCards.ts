import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { creditCardsData as mockData } from '@/constants/mockData';

export type CreditCardItem = {
  id: string;
  name: string;
  last4: string;
  balance: number;
  credit_limit: number;
  closing_day: number;
  payment_day: number;
  color: string;
};

function mapFromDB(row: any): CreditCardItem {
  return {
    id: row.id,
    name: row.name,
    last4: row.last4 ?? '****',
    balance: Number(row.balance ?? 0),
    credit_limit: Number(row.credit_limit ?? 0),
    closing_day: row.closing_day ?? 15,
    payment_day: row.payment_day ?? 10,
    color: row.color ?? '#00A650',
  };
}

export function useCreditCards() {
  const { user } = useAuth();
  const isGuest = !user || user.id.startsWith('guest_');

  const [data, setData] = useState<CreditCardItem[]>(isGuest ? (mockData as CreditCardItem[]) : []);
  const [isLoading, setIsLoading] = useState(!isGuest);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (isGuest || !user) return;
    setIsLoading(true);
    const { data: rows, error: err } = await supabase
      .from('cfo_credit_cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (err) {
      setError(err.message);
      setData(mockData as CreditCardItem[]);
    } else {
      setData(rows?.map(mapFromDB) ?? []);
    }
    setIsLoading(false);
  }, [user?.id, isGuest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (item: Omit<CreditCardItem, 'id'>) => {
    if (isGuest) {
      setData(prev => [...prev, { ...item, id: `local_${Date.now()}` }]);
      return;
    }
    await supabase.from('cfo_credit_cards').insert({
      user_id: user!.id,
      name: item.name,
      last4: item.last4,
      balance: item.balance,
      credit_limit: item.credit_limit,
      closing_day: item.closing_day,
      payment_day: item.payment_day,
      color: item.color,
    });
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const update = useCallback(async (id: string, updates: Partial<Omit<CreditCardItem, 'id'>>) => {
    if (isGuest) {
      setData(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      return;
    }
    await supabase.from('cfo_credit_cards').update(updates).eq('id', id);
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const remove = useCallback(async (id: string) => {
    setData(prev => prev.filter(c => c.id !== id));
    if (!isGuest && user) {
      await supabase.from('cfo_credit_cards').delete().eq('id', id);
    }
  }, [user?.id, isGuest]);

  return { data, isLoading, error, create, update, remove, refetch: fetchData };
}
