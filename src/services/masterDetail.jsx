import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  axiosDeletePaginate,
  axiosGet,
  axiosPost,
} from "../apis/calls";
import { omit } from "lodash";
import useTablePagination from "../common/store/tablePaginationStore";
import useNotification from "../hooks/useNotifications";
import { useGlobalFilterStore } from "../common/store/globalFiltersStore";

export const useGetDetailsStructure = (path, extra) => {
  const { selectedCompany } = useGlobalFilterStore();
  const { notify } = useNotification();
  return useQuery({
    queryKey: [path, selectedCompany, extra],
    queryFn: () => axiosGet(`${path}`, { rut_company: selectedCompany, ...(extra ? { ...extra } : {}) }),
    throwOnError: ({ response }) => {
      if (response.data?.detail) {
        notify(response.data.detail, "error", "");
      }
    },
  });
};

export const useSaveRecord = (path = "", title = "Registro", extra) => {
  const { selectedCompany } = useGlobalFilterStore();
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: async (body) => {
      return await axiosPost(`${path}`, body, { rut_company: selectedCompany });
    },
    onSuccess: (response) => {
      if (response) {
        queryClient.setQueryData(
          [path, selectedCompany, extra],
          response
        );
        notify(`${title} se guardó correctamente`);
        console.log("POST SAVE",response);
        
      }
    },
    onError: ({ response }) => {
      if (response?.data?.detail) {
        notify(response.data.detail, "error", "");
      } else {
        notify(`Error al guardar ${title}`, "error");
      }
    },
  });
};

export const useDeleteRecord = (path = "", title = "Registro") => {
  const queryClient = useQueryClient();
  const { tablePagination } = useTablePagination();
  const { selectedCompany, search } = useGlobalFilterStore();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: async (body) => {
      return await axiosDeletePaginate(`${path}`, body);
    },
    onSuccess: (response) => {
      if (response) {
        queryClient.setQueryData(
          [path, omit(tablePagination, ["pagination.total"]), selectedCompany, search],
          response
        );
        notify(`${title} eliminado correctamente`);
      }
    },
    onError: (error) => {
      notify(`Error al eliminar ${title}`, "error");
    },
  });
};
