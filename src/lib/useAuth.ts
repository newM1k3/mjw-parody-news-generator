import { useState, useEffect, useCallback } from 'react';
import pb from './pocketbase';

export interface AuthUser {
  id: string;
  email: string;
  tier: 'free' | 'tin_foil';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = () => {
      const model = pb.authStore.model;
      if (pb.authStore.isValid && model) {
        setUser({
          id: model.id,
          email: model.email,
          tier: model.tier || 'free',
          stripe_customer_id: model.stripe_customer_id,
          stripe_subscription_id: model.stripe_subscription_id,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    syncUser();

    const unsubscribe = pb.authStore.onChange(() => {
      syncUser();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const auth = await pb.collection('users').authWithPassword(email, password);
    const model = auth.record;
    setUser({
      id: model.id,
      email: model.email,
      tier: (model as Record<string, unknown>).tier as 'free' | 'tin_foil' || 'free',
    });
    return auth;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      tier: 'free',
    });
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
  }, []);

  const isTinFoil = user?.tier === 'tin_foil';

  return { user, loading, login, signup, logout, isTinFoil };
}
