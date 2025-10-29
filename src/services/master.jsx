import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  axiosDeletePaginate,
  axiosPaginateGet,
  axiosPost,
  axiosPostPaginate,
  basePostBlobFile,
} from "../apis/calls";
import { omit } from "lodash";
import useTablePagination from "../common/store/tablePaginationStore";
import useNotification from "../hooks/useNotifications";
import { useGlobalFilterStore } from "../common/store/globalFiltersStore";
import { downloadAny } from "../utils/files";

export const useGetPaginatedRecords = (path) => {
  const { tablePagination } = useTablePagination();
  const { selectedCompany, search } = useGlobalFilterStore();
  return useQuery({
    queryKey: [path, omit(tablePagination, ["pagination.total"]), selectedCompany, search],
    queryFn: () => axiosPaginateGet(`${path}`),
    enabled: !!tablePagination.sorter.field,
  });
};

export const useSaveRecord = (path = "", title = "Registro") => {
  const queryClient = useQueryClient();
  const { tablePagination } = useTablePagination();
  const { selectedCompany, search } = useGlobalFilterStore();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: async (body) => {
      return await axiosPostPaginate(`${path}`, body);
    },
    onSuccess: (response) => {
      if (response) {
        queryClient.setQueryData(
          [path, omit(tablePagination, ["pagination.total"]), selectedCompany, search],
          response
        );
        notify(`${title} guardado correctamente`);
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
    onError: () => {
      notify(`Error al eliminar ${title}`, "error");
    },
  });
};


export const useDownloadExcel = (path) => {
  const { notify } = useNotification();
  return useMutation({
    mutationFn: () => basePostBlobFile(`${path}get-load-excel`, {}),
    onMutate: () => {
      notify("Descargando excel...", "loading");
    },
    onSuccess: (response) => {
      if (response) {
        const [objectUrl, filename] = response;
        downloadAny(objectUrl, filename ? filename : "planilla_carga.xlsx");
        notify("Se generó el excel correctamente!", "success");
      }
    },
    onError: (error) => {
      notify("Error al generar excel", "error");
      console.log("ERROR", error);
    },
  });
};


export const useUploadExcel = (path) => {
  const { notify } = useNotification();
  return useMutation({
    mutationFn: (data) => axiosPostPaginate(`${path}save-load-excel`, data),
    onMutate: () => {
      notify("Subiendo excel...");
    },
    onSuccess: (response) => {
      if (response) {
        console.log(response);
        notify("Se subió el excel correctamente!");
      }
    },
    onError: (error) => {
      notify("Error al subir excel", "error");
      console.log("ERROR", error);
    },
  });
};


export const useButtonAction = () => {
  const { notify } = useNotification();
  return useMutation({
    mutationFn: ({ path, body }) => {
      return axiosPost(`${path}`, body)
    },
    onSuccess: (response) => {
      if (response) {
        notify("Acción ejecutada correctamente!");
      }
    },
    onError: (error) => {
      notify("Error al ejecutar acción", "error");
      console.log("ERROR", error);
    },
  });
};