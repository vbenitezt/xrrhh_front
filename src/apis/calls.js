import { useGlobalFilterStore } from "../common/store/globalFiltersStore";
import useTablePagination from "../common/store/tablePaginationStore";
import axios from "./axiosConfig";

export const axiosPaginateGet = async (uri) => {
  const { tablePagination, setTablePagination } = useTablePagination.getState();
  const { selectedCompany, search } = useGlobalFilterStore.getState();
  const { sorter, pagination } = tablePagination;
  const { field, order } = sorter;
  const { current, pageSize, total } = pagination ? { ...pagination } : {};
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

  const { sorter, pagination } = tablePagination;
  const { field, order } = sorter;
  const { current, pageSize, total } = pagination ? { ...pagination } : {};

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

  const { sorter, pagination } = tablePagination;
  const { field, order } = sorter;
  const { current, pageSize, total } = pagination ? { ...pagination } : {};

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
