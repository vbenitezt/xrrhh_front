import { useState, useCallback } from "react";
import { Typography, Spin, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";

// Componentes móviles
import {
  PayrollCardMobile,
  VacationCardMobile,
  BirthdayListMobile,
  EventsListMobile,
  EmployeeHeaderMobile,
} from "../../components/Dashboard/mobile";

// Componentes compartidos
import { NotificationSettings } from "../../components/Dashboard";

// Servicios
import { useDashboardEmpleado, useMisVacaciones } from "../../services/dashboard";

// Estilos inline para el pull-to-refresh
import "./DashboardMobile.css";

const { Text } = Typography;

/**
 * Dashboard móvil para empleados
 * Diseño nativo optimizado para iOS/Android
 */
export default function DashboardMobile() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  // Obtener datos del dashboard
  const { 
    data: dashboard, 
    isLoading, 
    refetch 
  } = useDashboardEmpleado();

  // Obtener datos completos de vacaciones (para solicitar)
  const { data: vacacionesData } = useMisVacaciones();

  // Función para refrescar datos
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["dashboard-empleado"] });
      await queryClient.invalidateQueries({ queryKey: ["mis-vacaciones"] });
      await refetch();
      message.success("Datos actualizados");
    } catch (error) {
      message.error("Error al actualizar");
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, [queryClient, refetch]);

  // Handlers para pull-to-refresh
  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      const touch = e.touches[0];
      window._pullStartY = touch.clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (window._pullStartY && window.scrollY === 0) {
      const touch = e.touches[0];
      const distance = Math.max(0, touch.clientY - window._pullStartY);
      setPullDistance(Math.min(distance, 100));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 60 && !isRefreshing) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
    window._pullStartY = null;
  }, [pullDistance, isRefreshing, handleRefresh]);

  // Mostrar loading inicial
  if (isLoading && !dashboard) {
    return (
      <div className="dashboard-mobile-loading">
        <Spin size="large" />
        <Text type="secondary" className="mt-4">Cargando tu dashboard...</Text>
      </div>
    );
  }

  const {
    mi_informacion,
    ultima_liquidacion,
    vacaciones,
    cumpleanos_equipo,
    proximos_eventos,
  } = dashboard || {};

  const refreshProgress = Math.min(pullDistance / 60, 1);

  return (
    <div 
      className="dashboard-mobile"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      <div 
        className="pull-to-refresh-indicator"
        style={{ 
          height: pullDistance,
          opacity: refreshProgress,
        }}
      >
        <div className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}>
          <ReloadOutlined style={{ fontSize: 24, color: '#3b82f6' }} />
        </div>
        <Text type="secondary" className="text-xs mt-1">
          {pullDistance > 60 ? 'Suelta para actualizar' : 'Desliza para actualizar'}
        </Text>
      </div>

      {/* Header con información del empleado */}
      <EmployeeHeaderMobile 
        informacion={mi_informacion} 
        loading={isLoading}
      />

      {/* Contenido scrolleable */}
      <div className="dashboard-mobile-content">
        {/* Saludo */}
        <div className="dashboard-greeting">
          <Text className="text-lg font-medium text-gray-800">
            Tu resumen de hoy
          </Text>
          <Text type="secondary" className="text-sm">
            {new Date().toLocaleDateString('es-CL', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </div>

        {/* Cards */}
        <div className="dashboard-mobile-cards">
          {/* Liquidación */}
          <PayrollCardMobile
            liquidacion={ultima_liquidacion}
            loading={isLoading}
          />

          {/* Vacaciones */}
          <VacationCardMobile
            diasDisponibles={vacaciones?.dias_disponibles}
            diasTomados={vacaciones?.dias_tomados}
            diasPendientes={vacaciones?.dias_pendientes}
            solicitudes={vacacionesData?.solicitudes_recientes || []}
            loading={isLoading}
            vacacionesData={vacacionesData}
            puedeSolicitar={vacacionesData?.puede_solicitar !== false}
          />

          {/* Cumpleaños */}
          <BirthdayListMobile
            cumpleanos={cumpleanos_equipo}
            loading={isLoading}
            maxItems={3}
          />

          {/* Eventos */}
          <EventsListMobile
            eventos={proximos_eventos}
            loading={isLoading}
            maxItems={4}
          />

          {/* Notificaciones Push */}
          <NotificationSettings compact />
        </div>
      </div>

      {/* Refresh overlay */}
      {isRefreshing && (
        <div className="refresh-overlay">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}

