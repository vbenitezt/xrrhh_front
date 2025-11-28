import { useQuery, useMutation } from "@tanstack/react-query";
import { useAxios } from "@xsolutioncl/ruibernate";

// ==========================================
// DASHBOARD EMPLEADO
// ==========================================

/**
 * Hook para obtener el dashboard completo del empleado
 */
export const useDashboardEmpleado = () => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["dashboard-empleado"],
    queryFn: async () => {
      const { data } = await axios.get("/dashboard/empleado");
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener las últimas liquidaciones del empleado
 */
export const useLiquidacionesEmpleado = (limit = 6) => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["liquidaciones-empleado", limit],
    queryFn: async () => {
      const { data } = await axios.get(`/dashboard/empleado/liquidaciones?limit=${limit}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener los cumpleaños del equipo
 */
export const useCumpleanosEquipo = () => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["cumpleanos-equipo"],
    queryFn: async () => {
      const { data } = await axios.get("/dashboard/empleado/cumpleanos-equipo");
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para obtener las vacaciones del empleado
 */
export const useMisVacaciones = () => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["mis-vacaciones"],
    queryFn: async () => {
      const { data } = await axios.get("/dashboard/empleado/mis-vacaciones");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener los eventos próximos
 */
export const useEventosEmpleado = () => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["eventos-empleado"],
    queryFn: async () => {
      const { data } = await axios.get("/dashboard/empleado/eventos");
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// ==========================================
// DASHBOARD ADMINISTRADOR
// ==========================================

/**
 * Hook para obtener el dashboard completo del administrador
 */
export const useDashboardAdmin = () => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["dashboard-admin"],
    queryFn: async () => {
      const { data } = await axios.get("/dashboard/admin");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener los cumpleaños de la empresa
 */
export const useCumpleanosAdmin = (dias = 30) => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["cumpleanos-admin", dias],
    queryFn: async () => {
      const { data } = await axios.get(`/dashboard/admin/cumpleanos?dias=${dias}`);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para obtener las solicitudes de vacaciones pendientes
 */
export const useSolicitudesVacaciones = () => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["solicitudes-vacaciones"],
    queryFn: async () => {
      const { data } = await axios.get("/dashboard/admin/solicitudes-vacaciones");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener los nuevos ingresos
 */
export const useNuevosIngresos = (dias = 30) => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["nuevos-ingresos", dias],
    queryFn: async () => {
      const { data } = await axios.get(`/dashboard/admin/nuevos-ingresos?dias=${dias}`);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para obtener la evolución de nómina
 */
export const useGraficoNomina = (meses = 6) => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["grafico-nomina", meses],
    queryFn: async () => {
      const { data } = await axios.get(`/dashboard/admin/graficos/nomina?meses=${meses}`);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para obtener la rotación de personal
 */
export const useGraficoRotacion = (meses = 12) => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["grafico-rotacion", meses],
    queryFn: async () => {
      const { data } = await axios.get(`/dashboard/admin/graficos/rotacion?meses=${meses}`);
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para obtener las alertas
 */
export const useAlertas = () => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["alertas-admin"],
    queryFn: async () => {
      const { data } = await axios.get("/dashboard/admin/alertas");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener la distribución por cargo/departamento
 */
export const useDistribucion = () => {
  const axios = useAxios();
  return useQuery({
    queryKey: ["distribucion-admin"],
    queryFn: async () => {
      const { data } = await axios.get("/dashboard/admin/distribucion");
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

// ==========================================
// ACCIONES
// ==========================================

/**
 * Hook para aprobar solicitud de vacaciones
 * POST /vacaciones/{cod_vacaciones}/aprobar
 */
export const useAprobarVacaciones = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async (cod_vacaciones) => {
      const { data } = await axios.post(`/vacaciones/${cod_vacaciones}/aprobar`);
      return data;
    },
  });
};

/**
 * Hook para rechazar solicitud de vacaciones
 * POST /vacaciones/{cod_vacaciones}/rechazar
 */
export const useRechazarVacaciones = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async (cod_vacaciones) => {
      const { data } = await axios.post(`/vacaciones/${cod_vacaciones}/rechazar`);
      return data;
    },
  });
};

/**
 * Hook para descargar documento de vacaciones
 * GET {url_documento}
 */
export const useDescargarDocumentoVacaciones = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async (url_documento) => {
      const response = await axios({
        method: "get",
        url: url_documento,
        responseType: "blob",
      });
      
      // Obtener nombre del archivo del header
      const contentDisposition = response.headers["content-disposition"];
      let filename = "comprobante_vacaciones.pdf";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
      }
      
      // Crear URL y descargar
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, filename };
    },
  });
};

// ==========================================
// SOLICITUD DE VACACIONES (EMPLEADO)
// ==========================================

/**
 * Hook para calcular días hábiles entre dos fechas (preview)
 */
export const useCalcularDiasVacaciones = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async ({ fecha_inicio, fecha_termino }) => {
      const { data } = await axios.post(
        `/dashboard/empleado/calcular-dias-vacaciones`,
        null,
        { params: { fecha_inicio, fecha_termino } }
      );
      return data;
    },
  });
};

/**
 * Hook para solicitar vacaciones
 */
export const useSolicitarVacaciones = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async ({ fecha_inicio, fecha_termino, descripcion }) => {
      const { data } = await axios.post(`/dashboard/empleado/solicitar-vacaciones`, {
        fecha_inicio,
        fecha_termino,
        descripcion,
      });
      return data;
    },
  });
};

