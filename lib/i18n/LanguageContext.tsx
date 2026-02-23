"use client";
import { createContext, useContext, useEffect, useState } from "react";
import vi from "./vi";
import en from "./en";
import type { Translations } from "./vi";

type Lang = "vi" | "en";
const TRANSLATIONS: Record<Lang, Translations> = { vi, en };
const STORAGE_KEY = "tg_lang";

type ContextValue = {
    lang: Lang;
    t: Translations;
    setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<ContextValue>({
    lang: "en",
    t: en,
    setLang: () => { },
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>("en");

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
        if (saved === "vi" || saved === "en") setLangState(saved);
    }, []);

    const setLang = (newLang: Lang) => {
        setLangState(newLang);
        localStorage.setItem(STORAGE_KEY, newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, t: TRANSLATIONS[lang], setLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    return useContext(LanguageContext);
}
