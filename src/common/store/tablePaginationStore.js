import { create } from "zustand";

const useTablePagination = create((set) => ({
  tablePagination: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      defaultPageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
      position: ["bottomLeft"],
      showSizeChanger: true,
    },
    sorter: {
      columnKey: 0,
      field: null,
      order: "descend",
    },
    filters: {},
  },
  setTablePagination: (filters) => set(() => ({ tablePagination: filters })),
}));

export default useTablePagination;
