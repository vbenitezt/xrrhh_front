import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useMenuStore = create(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (value) =>
        set((state) => ({
          collapsed: value,
        })),
    }),
    {
      name: "menu",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
