import { Row, Col, Typography, Button, Spin, Alert, FloatButton } from "antd";
import { ReloadOutlined, SyncOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";

// Componentes del dashboard
import {
  EmployeeInfoCard,
  VacationCard,
  BirthdayCard,
  EventsCard,
} from "../../components/Dashboard";

// Servicios
import { useDashboardEmpleado, useMisVacaciones } from "../../services/dashboard";

const { Title, Text } = Typography;

/**
 * Dashboard del Empleado - Diseño moderno
 */
export default function DashboardEmpleado() {
  const queryClient = useQueryClient();
  
  const { 
    data: dashboard, 
    isLoading, 
    isError, 
    error,
    refetch,
    isFetching
  } = useDashboardEmpleado();

  const { data: vacacionesData } = useMisVacaciones();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-empleado"] });
    refetch();
  };

  const handleDownloadLiquidacion = (codLiquidacion) => {
    console.log("Descargar liquidación:", codLiquidacion);
    // TODO: Implementar descarga de liquidación
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Spin size="large" />
        <Text type="secondary">Cargando tu dashboard...</Text>
      </div>
    );
  }

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
    mi_informacion,
    ultima_liquidacion,
    vacaciones,
    mis_solicitudes_vacaciones,
    cumpleanos_equipo,
    proximos_eventos,
  } = dashboard || {};

  // Obtener nombre para saludo
  const primerNombre = mi_informacion?.nombre?.split(" ")[0] || "";
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <div 
      className="min-h-full"
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      {/* Header mejorado */}
      <div 
        className="px-6 py-6"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 50%, #3d5a80 100%)",
          borderRadius: "0 0 24px 24px",
          boxShadow: "0 4px 20px rgba(30, 58, 95, 0.15)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
              {saludo}, {primerNombre} 👋
            </Text>
            <Title level={2} style={{ margin: "4px 0 0 0", color: "white", fontWeight: 600 }}>
              Mi Dashboard
            </Title>
          </div>
          <Button 
            icon={isFetching ? <SyncOutlined spin /> : <ReloadOutlined />}
            onClick={handleRefresh}
            size="large"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
            }}
            disabled={isFetching}
          >
            {isFetching ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Mi Información (ancho completo) */}
        <div className="mb-6">
          <EmployeeInfoCard 
            informacion={mi_informacion} 
            liquidacion={ultima_liquidacion}
            onDownloadLiquidacion={handleDownloadLiquidacion}
          />
        </div>

        {/* Segunda fila: Cumpleaños + Eventos | Vacaciones */}
        <Row gutter={[16, 16]}>
          {/* Columna izquierda: Cumpleaños y Eventos apilados */}
          <Col xs={24} lg={12}>
            <div className="flex flex-col gap-4 h-full">
              <BirthdayCard
                cumpleanos={cumpleanos_equipo}
                title="Cumpleaños del Equipo"
                showJefatura={true}
                maxItems={3}
                className="flex-1"
              />
              <EventsCard
                eventos={proximos_eventos}
                title="Próximos Eventos"
                maxItems={4}
                className="flex-1"
              />
            </div>
          </Col>

          {/* Columna derecha: Vacaciones (altura completa) */}
          <Col xs={24} lg={12}>
            <VacationCard
              diasDisponibles={vacaciones?.dias_disponibles}
              diasTomados={vacaciones?.dias_tomados}
              diasPendientes={vacaciones?.dias_pendientes}
              solicitudes={mis_solicitudes_vacaciones}
              vacacionesData={vacacionesData}
              puedeSolicitar={vacacionesData?.puede_solicitar !== false}
              className="h-full"
            />
          </Col>
        </Row>
      </div>

      {/* Botón flotante en móvil */}
      <FloatButton
        icon={isFetching ? <SyncOutlined spin /> : <ReloadOutlined />}
        tooltip="Actualizar datos"
        onClick={handleRefresh}
        className="md:hidden"
        style={{
          backgroundColor: "#1e3a5f",
        }}
      />
    </div>
  );
}
