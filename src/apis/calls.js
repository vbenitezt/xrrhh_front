import { useGlobalFilterStore } from "../common/store/globalFiltersStore";
import useTablePagination from "../common/store/tablePaginationStore";
import axios from "./axiosConfig";

const normalizeFilters = (filters = {}) =>
  Object.entries(filters ?? {}).reduce((acc, [key, value]) => {
    const descriptors = (Array.isArray(value) ? value : [value])
      .map((item) => {
        if (!item) {
          return null;
        }

        if (typeof item !== "object") {
          if (item === "" || item === null || item === undefined) {
            return null;
          }
          return {
            type: "text",
            operator: "ilk",
            value: item,
          };
        }

        const { type, operator, value: descriptorValue } = item;

        if (type === "text") {
          if (!descriptorValue) {
            return null;
          }
          return {
            type: "text",
            operator: operator ?? "ilk",
            value: descriptorValue,
          };
        }

        if (type === "select") {
          if (
            descriptorValue === null ||
            descriptorValue === undefined ||
            descriptorValue === ""
          ) {
            return null;
          }
          return {
            type: "select",
            operator: operator ?? "eq",
            value: descriptorValue,
          };
        }

        if (type === "number" || type === "date") {
          const rangeValue = descriptorValue;
          let from = null;
          let to = null;

          if (Array.isArray(rangeValue)) {
            [from, to] = rangeValue;
          } else if (rangeValue && typeof rangeValue === "object") {
            from = rangeValue.from ?? null;
            to = rangeValue.to ?? null;
          } else if (
            rangeValue !== undefined &&
            rangeValue !== null &&
            rangeValue !== ""
          ) {
            if (operator === "lte") {
              to = rangeValue;
            } else if (operator === "gte") {
              from = rangeValue;
            } else {
              from = rangeValue;
            }
          }

          const hasFrom =
            from !== undefined && from !== null && from !== "";
          const hasTo = to !== undefined && to !== null && to !== "";

          if (!hasFrom && !hasTo) {
            return null;
          }

          const normalizedOperator =
            hasFrom && hasTo
              ? "btw"
              : hasFrom
              ? "gte"
              : "lte";

          const normalizedValue =
            normalizedOperator === "btw"
              ? [from, to]
              : hasFrom
              ? from
              : to;

          return {
            type,
            operator: normalizedOperator,
            value: normalizedValue,
          };
        }

        if (
          descriptorValue === null ||
          descriptorValue === undefined ||
          descriptorValue === ""
        ) {
          return null;
        }

        return {
          type: type ?? "text",
          operator: operator ?? "ilk",
          value: descriptorValue,
        };
      })
      .filter(Boolean);

    if (descriptors.length > 0) {
      acc[key] = descriptors[0];
    }

    return acc;
  }, {});

export const axiosPaginateGet = async (uri) => {
  const { tablePagination, setTablePagination } = useTablePagination.getState();
  const { selectedCompany, search } = useGlobalFilterStore.getState();
  const { sorter, pagination, filters } = tablePagination;
  const { field, order } = sorter;
  const { current, pageSize, total } = pagination ? { ...pagination } : {};
  const normalizedFilters = normalizeFilters(filters);
  const { data } = await axios.get(uri, {
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      total,
      current,
      field,
      order,
      search,
      page_size: pageSize,
      rut_company: selectedCompany,
      filters: normalizedFilters,
    },
  });
  let newFilters = { ...tablePagination };
  newFilters.pagination.total = data.total;
  setTablePagination(newFilters);
  return data;
};

export const axiosGet = async (uri, params) => {
  const { data } = await axios.get(`${uri}`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: {rut_company: "RUT_COMPAÑIA" },
  });
  return data;
};

export const axiosPost = async (uri, body, params) => {
  const formData = new FormData();
  const hasFile =
    Object.keys(body).filter((key) => body[key]?.file && body[key]?.fileList)
      .length > 0;

  if (hasFile) {
    for (const key in body) {
      if (body.hasOwnProperty(key) && body[key]) {
        if (body[key].file && body[key].fileList) {
          const originFileObj =
            body[key].file.originFileObj ||
            body[key].fileList[0]?.originFileObj;
          formData.append("file", originFileObj);
        } else {
          if (typeof body[key] === "object" && body[key] !== null) {
            formData.append(key, JSON.stringify(body[key]));
          } else {
            formData.append(key, body[key]);
          }
        }
      }
    }
  }

  const { data } = await axios.post(`${uri}`, hasFile ? formData : body, {
    headers: {
      "Content-Type": hasFile ? "multipart/form-data" : "application/json",
    },
    params,
  });

  return data;
};

export const axiosPostPaginate = async (uri, body) => {
  const { tablePagination, setTablePagination } = useTablePagination.getState();
  const { selectedCompany, search } = useGlobalFilterStore.getState();

  const { sorter, pagination, filters } = tablePagination;
  const { field, order } = sorter;
  const { current, pageSize, total } = pagination ? { ...pagination } : {};
  const normalizedFilters = normalizeFilters(filters);

  const formData = new FormData();
  const hasFile =
    Object.keys(body).filter((key) => body[key]?.file && body[key]?.fileList)
      .length > 0;

  if (hasFile) {
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        if (body[key].file && body[key].fileList) {
          const originFileObj =
            body[key].file.originFileObj ||
            body[key].fileList[0]?.originFileObj;
          formData.append("file", originFileObj);
        } else {
          formData.append(key, body[key]);
        }
      }
    }
  }

  const { data } = await axios.post(`${uri}`, hasFile ? formData : body, {
    headers: {
      "Content-Type": hasFile ? "multipart/form-data" : "application/json",
    },
    params: {
      total,
      current,
      field,
      order,
      search,
      page_size: pageSize,
      rut_company: selectedCompany,
      filters: normalizedFilters,
    },
  });
  let newFilters = { ...tablePagination };
  newFilters.pagination.total = data.total;
  setTablePagination(newFilters);
  return data;
};

export const axiosPostFile = async (uri, body) => {
  const { data } = await axios({
    method: "post",
    url: `${uri}`,
    data: body,
    headers: {
      "Content-Type": `multipart/form-data`,
    },
  });
  return data;
};

export const axiosPut = async (uri, body) => {
  const { data } = await axios.put(`${uri}`, body, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const axiosDelete = async (uri, body) => {
  const { data } = await axios.delete(`${uri}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(body),
  });
  return data;
};

export const axiosDeletePaginate = async (uri, body) => {
  const { tablePagination, setTablePagination } = useTablePagination.getState();
  const { selectedCompany, search } = useGlobalFilterStore.getState();

  const { sorter, pagination, filters } = tablePagination;
  const { field, order } = sorter;
  const { current, pageSize, total } = pagination ? { ...pagination } : {};
  const normalizedFilters = normalizeFilters(filters);

  const { data } = await axios.delete(`${uri}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      total,
      current,
      field,
      order,
      search,
      page_size: pageSize,
      rut_company: selectedCompany,
      filters: normalizedFilters,
    },
    data: body,
  });
  let newFilters = { ...tablePagination };
  newFilters.pagination.total = data.total;
  setTablePagination(newFilters);
  return data;
};

export const baseFilePost = async (uri, file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch(`${uri}`, {
      method: "POST",
      headers: token ? { authorization: "Bearer " + token } : {},
      body: formData,
    });

    const data = await res.json();
    if (res.status !== 200 && res.status !== 201) {
      return null;
    }
    return data;
  } catch (e) {
    console.log("error", e);
    return null;
  }
};

export const baseGetFile = async (uri) => {
  try {
    const response = await fetch(`${uri}`);
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const basePostBlobFile = async (uri, body, params = {}) => {
  const { selectedCompany } = useGlobalFilterStore.getState();
  const resp = await axios({
    method: "post",
    url: `${uri}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    params: {
      ...params,
      rut_company: selectedCompany,
    },
    responseType: "blob",
    withCredentials: true,
  });
  const { data, headers } = resp;
  const contentDisposition = headers["content-disposition"];
  let filename = "";

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (filenameMatch.length === 2) {
      filename = filenameMatch[1];
    }
  }

  const objectUrl = URL.createObjectURL(data);
  return [objectUrl, filename];
};

export const baseGetBlobFile = async (uri) => {
  const { tablePagination } = useTablePagination.getState();
  const { cod_sucursal_contribuyente, cod_documento } =
    useGlobalFilterStore.getState();
  const { sorter, pagination } = tablePagination;
  const { field, order } = sorter;
  const { current, pageSize, total } = pagination ? { ...pagination } : {};
  const { data } = await axios({
    method: "get",
    url: `${uri}`,
    params: {
      total,
      current,
      page_size: pageSize,
      field,
      order,
      cod_sucursal_contribuyente,
      cod_documento,
    },
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "blob",
  });
  return URL.createObjectURL(data);
};

export async function baseGetImageDataUrl(uri) {
  const response = await fetch(`${uri}`);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export const multiPartPost = async (uri, body) => {
  let header =
    token == ""
      ? {}
      : {
          authorization: "Bearer " + token,
        };

  try {
    const res = await fetch(`${uri}`, {
      method: "POST",
      headers: header,
      body: body,
    });
    const data = await res.json();
    if (res.status != 200 && res.status != 201) {
      return null;
    } else {
      return data;
    }
  } catch (e) {
    console.log("error", e);
    return null;
  }
};

export const multiPartPut = async (uri, body) => {
  let header =
    token == ""
      ? {}
      : {
          authorization: "Bearer " + token,
        };

  try {
    const res = await fetch(`${uri}`, {
      method: "PUT",
      headers: header,
      body: body,
    });
    const data = await res.json();
    if (res.status != 200 && res.status != 201) {
      return null;
    } else {
      return data;
    }
  } catch (e) {
    console.log("error", e);
    return null;
  }
};
