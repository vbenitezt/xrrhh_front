import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",
      changeTheme: () =>
        set((state) => {
          return {
            theme: state.theme === "light" ? "dark" : "light",
          };
        }),
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
