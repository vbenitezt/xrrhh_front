import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@xsolutioncl/ruibernate";
import { message } from "antd";

// ==========================================
// HOOKS - VARIABLES
// ==========================================

/**
 * Hook para obtener las variables disponibles para el editor
 * GET /api/documentos-laborales/variables
 */
export const useVariablesContrato = () => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: ["variables-contrato"],
    queryFn: async () => {
      const { data } = await axios.get("/api/documentos-laborales/variables");
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });
};

// ==========================================
// HOOKS - TIPOS Y MODALIDADES
// ==========================================

/**
 * Hook para obtener los tipos de documento
 * GET /api/documentos-laborales/tipos-documento
 * Devuelve: [{ value: 1, label: "CONTRATO LABORAL" }]
 */
export const useTiposDocumento = () => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: ["tipos-documento"],
    queryFn: async () => {
      const { data } = await axios.get("/api/documentos-laborales/tipos-documento");
      return { tipos: data }; // Wrap en objeto para consistencia
    },
    staleTime: 60 * 60 * 1000,
  });
};

/**
 * Hook para obtener las modalidades de contrato
 * GET /api/documentos-laborales/modalidades
 * Devuelve: [{ value: 1, label: "INDEFINIDO" }]
 */
export const useModalidadesContrato = () => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: ["modalidades-contrato"],
    queryFn: async () => {
      const { data } = await axios.get("/api/documentos-laborales/modalidades");
      return { modalidades: data }; // Wrap en objeto para consistencia
    },
    staleTime: 60 * 60 * 1000,
  });
};

// ==========================================
// HOOKS - PLANTILLAS
// ==========================================

/**
 * Hook para obtener lista de plantillas
 * GET /api/documentos-laborales/plantillas
 * @param {number} codTipoDocumento - Filtrar por tipo de documento (opcional)
 */
export const usePlantillas = (codTipoDocumento = null) => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: ["plantillas", codTipoDocumento],
    queryFn: async () => {
      const params = {};
      if (codTipoDocumento) {
        params.cod_tipo_documento_laboral = codTipoDocumento;
      }
      const { data } = await axios.get("/api/documentos-laborales/plantillas", { params });
      return data;
    },
    enabled: !!codTipoDocumento, // Solo ejecutar cuando hay un tipo seleccionado
  });
};

/**
 * Hook para obtener una plantilla por ID (query automático)
 * GET /api/documentos-laborales/plantillas/{id}
 */
export const usePlantilla = (id) => {
  const axios = useAxios();
  
  return useQuery({
    queryKey: ["plantilla", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/documentos-laborales/plantillas/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Hook para obtener una plantilla por ID (llamada manual)
 * GET /api/documentos-laborales/plantillas/{id}
 */
export const useObtenerPlantilla = () => {
  const axios = useAxios();
  
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.get(`/api/documentos-laborales/plantillas/${id}`);
      return data;
    },
  });
};

/**
 * Hook para guardar plantilla (crear o actualizar)
 * POST /api/documentos-laborales/plantillas (crear)
 * PUT /api/documentos-laborales/plantillas/{id} (actualizar)
 * 
 * Payload:
 * - nombre_plantilla: str (required)
 * - cod_tipo_documento_laboral: int (required)
 * - descripcion: str (optional)
 * - mjml_base: str (required) - contenido HTML
 * - variables_definidas: dict (optional)
 */
export const useGuardarPlantilla = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      nombre_plantilla, 
      cod_tipo_documento_laboral, 
      descripcion, 
      mjml_base, 
      variables_definidas 
    }) => {
      const payload = {
        nombre_plantilla,
        cod_tipo_documento_laboral,
        descripcion: descripcion || null,
        mjml_base,
        variables_definidas: variables_definidas || {},
      };
      
      if (id) {
        const { data } = await axios.put(`/api/documentos-laborales/plantillas/${id}`, payload);
        return data;
      } else {
        const { data } = await axios.post("/api/documentos-laborales/plantillas", payload);
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plantillas"] });
      message.success(data.message || "Plantilla guardada exitosamente");
    },
    onError: (error) => {
      message.error(error?.response?.data?.detail || "Error al guardar plantilla");
    },
  });
};

// ==========================================
// HOOKS - GENERACIÓN DE DOCUMENTOS
// ==========================================

/**
 * Hook para generar documento desde plantilla + datos
 * POST /api/documentos-laborales/generar
 */
export const useGenerarDocumento = () => {
  const axios = useAxios();
  
  return useMutation({
    mutationFn: async ({ id_plantilla, cod_empleado, datos_variables }) => {
      const { data } = await axios.post("/api/documentos-laborales/generar", {
        id_plantilla,
        cod_empleado,
        datos_variables,
      });
      return data;
    },
    onSuccess: () => {
      message.success("Documento generado exitosamente");
    },
    onError: (error) => {
      message.error(error?.response?.data?.detail || "Error al generar documento");
    },
  });
};

/**
 * Hook para preview del documento (sin guardar)
 * POST /api/documentos-laborales/preview
 */
export const usePreviewDocumento = () => {
  const axios = useAxios();
  
  return useMutation({
    mutationFn: async ({ contenido_html, datos_variables }) => {
      const { data } = await axios.post("/api/documentos-laborales/preview", {
        contenido_html,
        datos_variables,
      });
      return data;
    },
  });
};

// ==========================================
// HOOKS - EMPLEADOS
// ==========================================

/**
 * Hook para buscar empleados
 * GET /api/documentos-laborales/empleados/buscar?q=texto
 */
export const useBuscarEmpleados = () => {
  const axios = useAxios();
  
  return useMutation({
    mutationFn: async (query) => {
      const { data } = await axios.get("/api/documentos-laborales/empleados/buscar", {
        params: { q: query }
      });
      return data;
    },
  });
};

/**
 * Hook para obtener datos de un contrato para el preview
 * GET /api/documentos-laborales/empleados/{cod_contrato}/datos-contrato
 */
export const useDatosEmpleadoContrato = () => {
  const axios = useAxios();
  
  return useMutation({
    mutationFn: async (codContrato) => {
      const { data } = await axios.get(`/api/documentos-laborales/empleados/${codContrato}/datos-contrato`);
      return data;
    },
  });
};
