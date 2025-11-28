import { Row, Col, Typography, Button, Spin, Alert, FloatButton } from "antd";
import { ReloadOutlined, UserOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";

// Componentes del dashboard
import {
  EmployeeInfoCard,
  PayrollCard,
  VacationCard,
  BirthdayCard,
  EventsCard,
} from "../../components/Dashboard";

// Servicios
import { useDashboardEmpleado, useMisVacaciones } from "../../services/dashboard";

const { Title, Text } = Typography;

/**
 * Dashboard del Empleado
 * Muestra información personal, liquidaciones, vacaciones, cumpleaños y eventos
 */
export default function DashboardEmpleado() {
  const queryClient = useQueryClient();
  
  // Obtener datos del dashboard
  const { 
    data: dashboard, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useDashboardEmpleado();

  // Obtener datos completos de vacaciones (para el modal de solicitud)
  const { data: vacacionesData } = useMisVacaciones();

  // Función para refrescar todos los datos
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-empleado"] });
    refetch();
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
    mi_informacion,
    ultima_liquidacion,
    vacaciones,
    mis_solicitudes_vacaciones,
    cumpleanos_equipo,
    proximos_eventos,
  } = dashboard || {};

  return (
    <div className="p-4 md:p-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <Title level={2} className="mb-1 flex items-center gap-2">
            <UserOutlined style={{ color: "#3b82f6" }} />
            Mi Dashboard
          </Title>
          <Text type="secondary">
            Bienvenido, aquí puedes ver tu información personal y laboral
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

      {/* Contenido principal */}
      <Row gutter={[16, 16]}>
        {/* Información Personal - Ancho completo en móvil */}
        <Col xs={24} lg={16}>
          <EmployeeInfoCard informacion={mi_informacion} />
        </Col>

        {/* Vacaciones */}
        <Col xs={24} lg={8}>
          <VacationCard
            diasDisponibles={vacaciones?.dias_disponibles}
            diasTomados={vacaciones?.dias_tomados}
            diasPendientes={vacaciones?.dias_pendientes}
            solicitudes={mis_solicitudes_vacaciones}
            vacacionesData={vacacionesData}
            puedeSolicitar={vacacionesData?.puede_solicitar !== false}
          />
        </Col>

        {/* Última Liquidación */}
        <Col xs={24} md={12} lg={8}>
          <PayrollCard
            liquidacion={ultima_liquidacion}
            onViewPDF={(id) => console.log("Ver PDF:", id)}
            onViewDetail={(id) => console.log("Ver detalle:", id)}
          />
        </Col>

        {/* Cumpleaños del Equipo */}
        <Col xs={24} md={12} lg={8}>
          <BirthdayCard
            cumpleanos={cumpleanos_equipo}
            title="Cumpleaños del Equipo"
            showJefatura={true}
            maxItems={4}
          />
        </Col>

        {/* Próximos Eventos */}
        <Col xs={24} lg={8}>
          <EventsCard
            eventos={proximos_eventos}
            title="Próximos Eventos"
            maxItems={5}
          />
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

