import { Row, Col, Typography, Button, Spin, Alert, FloatButton, message } from "antd";
import { 
  ReloadOutlined, 
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";

// Componentes del dashboard
import {
  KPICard,
  BirthdayCard,
  BirthdayBanner,
  AlertsCard,
  VacationRequestsCard,
  NewEmployeesCard,
  DistributionChart,
  PayrollChart,
} from "../../components/Dashboard";

// Servicios
import { 
  useDashboardAdmin,
  useAprobarVacaciones,
  useRechazarVacaciones 
} from "../../services/dashboard";

const { Title, Text } = Typography;

/**
 * Formateador de moneda compacta
 */
const formatCompactCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

/**
 * Dashboard del Administrador
 * Muestra KPIs, alertas, solicitudes, gráficos y más
 */
export default function DashboardAdmin() {
  const queryClient = useQueryClient();
  
  // Obtener datos del dashboard
  const { 
    data: dashboard, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useDashboardAdmin();

  // Mutaciones para aprobar/rechazar vacaciones
  const aprobarVacaciones = useAprobarVacaciones();
  const rechazarVacaciones = useRechazarVacaciones();

  // Función para refrescar todos los datos
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-admin"] });
    refetch();
  };

  // Aprobar vacaciones - POST /vacaciones/{cod}/aprobar
  const handleApproveVacation = async (cod_vacaciones) => {
    try {
      await aprobarVacaciones.mutateAsync(cod_vacaciones);
      message.success("Solicitud aprobada correctamente");
      handleRefresh();
    } catch (err) {
      message.error(err?.response?.data?.detail || "Error al aprobar la solicitud");
    }
  };

  // Rechazar vacaciones - POST /vacaciones/{cod}/rechazar
  const handleRejectVacation = async (cod_vacaciones) => {
    try {
      await rechazarVacaciones.mutateAsync(cod_vacaciones);
      message.success("Solicitud rechazada correctamente");
      handleRefresh();
    } catch (err) {
      message.error(err?.response?.data?.detail || "Error al rechazar la solicitud");
    }
  };

  // Mostrar spinner mientras carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" tip="Cargando dashboard..." />
      </div>
    );
  }

  // Mostrar error si hay problemas
  if (isError) {
    return (
      <div className="p-6">
        <Alert
          message="Error al cargar el dashboard"
          description={error?.message || "No se pudo cargar la información. Intenta nuevamente."}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleRefresh}>
              Reintentar
            </Button>
          }
        />
      </div>
    );
  }

  const {
    resumen_empleados,
    nomina_mes,
    liquidaciones,
    alertas,
    cumpleanos_proximos,
    cumpleanos_mes,  // Nuevo: todos los cumpleaños del mes
    solicitudes_vacaciones,
    nuevos_ingresos,
    distribucion,
  } = dashboard || {};

  // Datos para el gráfico de nómina (mock si no hay datos reales)
  const nominaData = dashboard?.grafico_nomina || [];

  return (
    <div className="p-4 md:p-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <Title level={2} className="mb-1 flex items-center gap-2">
            <DashboardOutlined style={{ color: "#8b5cf6" }} />
            Dashboard Administrador
          </Title>
          <Text type="secondary">
            Vista general de la empresa y gestión de personal
          </Text>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          className="mt-4 md:mt-0"
        >
          Actualizar
        </Button>
      </div>

      {/* Banner de Cumpleaños del Mes */}
      {cumpleanos_mes && cumpleanos_mes.length > 0 && (
        <BirthdayBanner 
          cumpleanos={cumpleanos_mes} 
          title="🎂 Cumpleaños del Mes"
        />
      )}

      {/* KPIs Principales */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={12} sm={12} md={6}>
          <KPICard
            icon={<TeamOutlined />}
            title="Empleados Activos"
            value={resumen_empleados?.total_activos || 0}
            trend={resumen_empleados?.nuevos_este_mes > 0 ? `+${resumen_empleados.nuevos_este_mes} este mes` : null}
            trendType="up"
            color="#3b82f6"
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KPICard
            icon={<DollarOutlined />}
            title="Nómina del Mes"
            value={nomina_mes?.total_liquido || 0}
            formatter={(value) => formatCompactCurrency(value)}
            color="#10b981"
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KPICard
            icon={<FileTextOutlined />}
            title="Liquidaciones"
            value={liquidaciones?.procesadas || 0}
            suffix={`/ ${liquidaciones?.total_esperado || 0}`}
            color="#8b5cf6"
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KPICard
            icon={<WarningOutlined />}
            title="Alertas"
            value={alertas?.total_alertas || 0}
            color={alertas?.total_alertas > 0 ? "#ef4444" : "#10b981"}
          />
        </Col>
      </Row>

      {/* Segunda fila: Cumpleaños y Solicitudes */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} md={12} lg={8}>
          <BirthdayCard
            cumpleanos={cumpleanos_proximos}
            title="Cumpleaños Próximos"
            maxItems={4}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <VacationRequestsCard
            solicitudes={solicitudes_vacaciones}
            onApprove={handleApproveVacation}
            onReject={handleRejectVacation}
            maxItems={4}
          />
        </Col>
        <Col xs={24} lg={8}>
          <AlertsCard alertas={alertas} />
        </Col>
      </Row>

      {/* Tercera fila: Gráficos */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} lg={14}>
          <PayrollChart data={nominaData} />
        </Col>
        <Col xs={24} lg={10}>
          <DistributionChart distribucion={distribucion} />
        </Col>
      </Row>

      {/* Cuarta fila: Nuevos ingresos y más info */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <NewEmployeesCard empleados={nuevos_ingresos} maxItems={5} />
        </Col>
        <Col xs={24} md={12}>
          {/* Resumen por tipo de contrato */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {resumen_empleados?.por_tipo_contrato && 
              Object.entries(resumen_empleados.por_tipo_contrato).map(([tipo, cantidad]) => (
                <KPICard
                  key={tipo}
                  title={tipo}
                  value={cantidad}
                  suffix="empleados"
                  size="small"
                  color={
                    tipo === "INDEFINIDO" ? "#10b981" :
                    tipo === "PLAZO FIJO" ? "#f59e0b" :
                    "#6b7280"
                  }
                />
              ))
            }
          </div>
        </Col>
      </Row>

      {/* Botón flotante de actualización en móvil */}
      <FloatButton
        icon={<ReloadOutlined />}
        tooltip="Actualizar datos"
        onClick={handleRefresh}
        className="md:hidden"
      />
    </div>
  );
}

