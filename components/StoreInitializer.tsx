'use client';
import { useEffect, type ReactNode } from 'react';
import { useStore } from '@/lib/store';

export default function StoreInitializer() {
  const initStore = useStore((state) => state.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);

  return null;
}

/** Wrap content that depends on store data — shows spinner until hydrated */
export function StoreGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const hydrated = useStore((s) => s._hydrated);

  if (!hydrated) {
    return (fallback ?? (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-forest-600 rounded-full animate-spin" />
      </div>
    )) as JSX.Element;
  }

  return <>{children}</>;
}
