import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useGlobalFilterStore = create(
  persist(
    (set) => ({
      cod_sucursal_contribuyente: null,
      cod_documento: null,
      selectedCompany: null,
      search: "",
      setSelectedCompany: (selectedCompany) =>
        set((state) => ({
          selectedCompany,
        })),
      setSearch: (search) =>
        set((state) => ({
          search,
        })),
      setSucursal: (cod_sucursal_contribuyente) =>
        set((state) => ({
          cod_sucursal_contribuyente,
        })),
      setCodDoc: (cod_documento) =>
        set((state) => ({
          cod_documento,
        })),
      resetGobalFilter: () =>
        set(() => ({
          cod_sucursal_contribuyente: null,
          cod_documento: null,
          selectedCompany: null,
          search: "",
        })),
    }),
    {
      name: "globalFilters",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
