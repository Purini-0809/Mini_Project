import { createContext, useContext, useMemo, useState } from "react";
import type { HomeItem } from "@/data/homes";

interface CompareContextValue {
  selected: HomeItem[];
  toggle: (home: HomeItem) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<HomeItem[]>([]);

  const value = useMemo<CompareContextValue>(() => ({
    selected,
    toggle(home) {
      setSelected(prev => prev.find(h => h.id === home.id) ? prev.filter(h => h.id !== home.id) : [...prev, home]);
    },
    clear() { setSelected([]); }
  }), [selected]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
};
