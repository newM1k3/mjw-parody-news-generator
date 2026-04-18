import { useState, useCallback } from 'react';

const STORAGE_KEY = 'tcn_generation_limit';
const DAILY_FREE_LIMIT = 3;

interface LimitData {
  date: string;
  count: number;
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getLimitData(): LimitData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: getTodayString(), count: 0 };
    const data: LimitData = JSON.parse(raw);
    if (data.date !== getTodayString()) {
      return { date: getTodayString(), count: 0 };
    }
    return data;
  } catch {
    return { date: getTodayString(), count: 0 };
  }
}

export function useGenerationLimit(isTinFoil: boolean) {
  const [limitData, setLimitData] = useState<LimitData>(getLimitData);

  const hasReachedLimit = !isTinFoil && limitData.count >= DAILY_FREE_LIMIT;
  const remainingGenerations = Math.max(0, DAILY_FREE_LIMIT - limitData.count);

  const incrementCount = useCallback(() => {
    if (isTinFoil) return;
    const current = getLimitData();
    const updated = { date: current.date, count: current.count + 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLimitData(updated);
  }, [isTinFoil]);

  return { hasReachedLimit, remainingGenerations, incrementCount };
}
