'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

const MAX_COMPARE = 4;

interface CompareState {
  selectedIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isSelected: (id: string) => boolean;
  isFull: boolean;
}

const CompareContext = createContext<CompareState>({
  selectedIds: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  clearCompare: () => {},
  isSelected: () => false,
  isFull: false,
});

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const addToCompare = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id) || prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  return (
    <CompareContext.Provider
      value={{
        selectedIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isSelected,
        isFull: selectedIds.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
