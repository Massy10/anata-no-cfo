import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionsData as mockData } from '@/constants/mockData';

export type SubscriptionItem = {
  id: string;
  name: string;
  amount: number;
  next_payment_date: string;
  card: string;
  icon: string;
  cycle: '月額' | '年額';
};

function mapFromDB(row: any): SubscriptionItem {
  return {
    id: row.id,
    name: row.name,
    amount: Number(row.amount),
    next_payment_date: row.next_payment_date ?? '',
    card: row.card ?? '',
    icon: row.icon ?? '📱',
    cycle: row.cycle as '月額' | '年額',
  };
}

export function useSubscriptions() {
  const { user } = useAuth();
  const isGuest = !user || user.id.startsWith('guest_');

  const [data, setData] = useState<SubscriptionItem[]>(isGuest ? (mockData as SubscriptionItem[]) : []);
  const [isLoading, setIsLoading] = useState(!isGuest);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (isGuest || !user) return;
    setIsLoading(true);
    const { data: rows, error: err } = await supabase
      .from('cfo_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    if (err) {
      setError(err.message);
      setData(mockData as SubscriptionItem[]);
    } else {
      setData(rows?.map(mapFromDB) ?? []);
    }
    setIsLoading(false);
  }, [user?.id, isGuest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = useCallback(async (item: Omit<SubscriptionItem, 'id'>) => {
    if (isGuest) {
      setData(prev => [...prev, { ...item, id: `local_${Date.now()}` }]);
      return;
    }
    await supabase.from('cfo_subscriptions').insert({
      user_id: user!.id,
      ...item,
    });
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const update = useCallback(async (id: string, updates: Partial<Omit<SubscriptionItem, 'id'>>) => {
    if (isGuest) {
      setData(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
      return;
    }
    await supabase.from('cfo_subscriptions').update(updates).eq('id', id);
    await fetchData();
  }, [user?.id, isGuest, fetchData]);

  const remove = useCallback(async (id: string) => {
    setData(prev => prev.filter(s => s.id !== id));
    if (!isGuest && user) {
      await supabase.from('cfo_subscriptions').delete().eq('id', id);
    }
  }, [user?.id, isGuest]);

  return { data, isLoading, error, create, update, remove, refetch: fetchData };
}
