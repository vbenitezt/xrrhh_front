import { useState } from "react";
import { Typography, Progress, Button, Tag, message } from "antd";
import { SunOutlined, RightOutlined, PlusOutlined, DownloadOutlined, CalendarOutlined } from "@ant-design/icons";
import VacationRequestDrawer from "./VacationRequestDrawer";
import { useDescargarDocumentoVacaciones } from "../../../services/dashboard";

const { Text } = Typography;

/**
 * Card de vacaciones compacto para móvil con círculos de progreso
 */
export default function VacationCardMobile({
  diasDisponibles = 0,
  diasTomados = 0,
  diasPendientes = 0,
  solicitudes = [],
  loading = false,
  onPress,
  vacacionesData = null,
  puedeSolicitar = true,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const descargarDocumento = useDescargarDocumentoVacaciones();
  const totalDias = diasDisponibles + diasTomados;
  const porcentajeUsado = totalDias > 0 ? Math.round((diasTomados / totalDias) * 100) : 0;

  // Manejar descarga
  const handleDownload = async (e, url_documento) => {
    e.stopPropagation();
    try {
      await descargarDocumento.mutateAsync(url_documento);
      message.success("Documento descargado");
    } catch (error) {
      message.error("Error al descargar");
    }
  };

  if (loading) {
    return (
      <div className="mobile-card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="flex justify-around">
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-card" onClick={onPress}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="mobile-icon-circle bg-green-100">
            <SunOutlined className="text-green-500 text-lg" />
          </div>
          <Text className="mobile-card-title">Mis Vacaciones</Text>
        </div>
        <RightOutlined className="text-gray-400" />
      </div>

      {/* Círculos de progreso */}
      <div className="flex justify-around items-center">
        {/* Disponibles */}
        <div className="text-center">
          <Progress
            type="circle"
            percent={100}
            size={60}
            strokeColor="#10b981"
            format={() => (
              <span className="text-lg font-bold text-green-600">
                {diasDisponibles}
              </span>
            )}
          />
          <Text className="block text-xs text-gray-500 mt-1">Disponibles</Text>
        </div>

        {/* Tomados */}
        <div className="text-center">
          <Progress
            type="circle"
            percent={porcentajeUsado}
            size={60}
            strokeColor="#6b7280"
            trailColor="#e5e7eb"
            format={() => (
              <span className="text-lg font-bold text-gray-600">
                {diasTomados}
              </span>
            )}
          />
          <Text className="block text-xs text-gray-500 mt-1">Tomados</Text>
        </div>

        {/* Pendientes */}
        <div className="text-center">
          <Progress
            type="circle"
            percent={diasPendientes > 0 ? 100 : 0}
            size={60}
            strokeColor="#f59e0b"
            format={() => (
              <span className="text-lg font-bold text-amber-500">
                {diasPendientes}
              </span>
            )}
          />
          <Text className="block text-xs text-gray-500 mt-1">Pendientes</Text>
        </div>
      </div>

      {/* Solicitudes recientes (colapsable) */}
      {solicitudes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            <Text className="text-xs font-medium text-gray-600">
              Solicitudes ({solicitudes.length})
            </Text>
            <RightOutlined 
              className={`text-gray-400 text-xs transition-transform ${expanded ? 'rotate-90' : ''}`} 
            />
          </div>
          
          {expanded && (
            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
              {solicitudes.map((sol) => (
                <div 
                  key={sol.cod_vacaciones}
                  className="p-2 bg-gray-50 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Text className="text-xs truncate flex-1 mr-2">
                      {sol.descripcion || "Vacaciones"}
                    </Text>
                    <Tag 
                      color={
                        sol.estado === "ACEPTADA" ? "success" :
                        sol.estado === "RECHAZADA" ? "error" :
                        "processing"
                      }
                      className="m-0 text-xs"
                    >
                      {sol.estado}
                    </Tag>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CalendarOutlined />
                    <span>{sol.fecha_inicio} → {sol.fecha_termino}</span>
                  </div>
                  
                  {/* Botón descargar documento */}
                  {sol.puede_descargar_documento && sol.url_documento && (
                    <Button
                      type="link"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={(e) => handleDownload(e, sol.url_documento)}
                      loading={descargarDocumento.isPending}
                      className="p-0 mt-1 text-xs h-auto"
                    >
                      Descargar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Botón solicitar */}
      {puedeSolicitar && diasDisponibles > 0 && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            setDrawerOpen(true);
          }}
          block
          className="mt-4"
          style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
        >
          Solicitar Vacaciones
        </Button>
      )}

      {/* Drawer de solicitud */}
      <VacationRequestDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        vacacionesData={vacacionesData}
      />
    </div>
  );
}

