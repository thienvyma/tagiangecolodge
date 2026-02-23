'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function StoreInitializer() {
    const initStore = useStore((state) => state.initStore);

    useEffect(() => {
        initStore();
    }, [initStore]);

    return null;
}
