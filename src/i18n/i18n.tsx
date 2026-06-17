import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dict, type DictKey, type Lang } from "./dict";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: DictKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "cms.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "th" || stored === "en") setLangState(stored);
    } catch {
      /* noop */
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (k, vars) => {
        const entry = dict[k];
        let s: string = entry ? entry[lang] : k;
        if (vars)
          for (const [key, val] of Object.entries(vars))
            s = s.replace(`{${key}}`, String(val));
        return s;
      },
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const v = useContext(I18nContext);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}
