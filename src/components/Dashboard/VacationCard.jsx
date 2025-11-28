import { useState } from "react";
import { Card, Progress, Typography, Tag, Skeleton, Button, message, Tooltip } from "antd";
import { 
  SunOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CalendarOutlined,
  PlusOutlined,
  DownloadOutlined,
  RightOutlined
} from "@ant-design/icons";
import VacationRequestModal from "./VacationRequestModal";
import { useDescargarDocumentoVacaciones } from "../../services/dashboard";

const { Text, Title } = Typography;

/**
 * Tarjeta de resumen de vacaciones - Diseño moderno
 */
export default function VacationCard({
  diasDisponibles = 0,
  diasTomados = 0,
  diasPendientes = 0,
  solicitudes = [],
  loading = false,
  className = "",
  vacacionesData = null,
  puedeSolicitar = true,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const descargarDocumento = useDescargarDocumentoVacaciones();
  const totalDias = diasDisponibles + diasTomados;
  const porcentajeUsado = totalDias > 0 ? Math.round((diasTomados / totalDias) * 100) : 0;

  const handleDownload = async (url_documento) => {
    try {
      await descargarDocumento.mutateAsync(url_documento);
      message.success("Documento descargado");
    } catch (error) {
      message.error("Error al descargar el documento");
    }
  };

  // Obtener el estilo del estado
  const getEstadoStyle = (estado) => {
    const styles = {
      "ACEPTADA": { bg: "#dcfce7", color: "#166534", border: "#86efac", icon: "✓" },
      "APROBADA": { bg: "#dcfce7", color: "#166534", border: "#86efac", icon: "✓" },
      "GENERADO": { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd", icon: "📄" },
      "RECHAZADA": { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5", icon: "✗" },
      "PENDIENTE": { bg: "#fef3c7", color: "#92400e", border: "#fcd34d", icon: "⏳" },
      "SOLICITUD": { bg: "#e0e7ff", color: "#3730a3", border: "#a5b4fc", icon: "📝" },
    };
    return styles[estado?.toUpperCase()] || styles["PENDIENTE"];
  };

  if (loading) {
    return (
      <Card className={`overflow-hidden ${className}`} styles={{ body: { padding: 0 } }}>
        <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600">
          <Skeleton.Avatar active size={40} />
        </div>
        <div className="p-6">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </Card>
    );
  }

  return (
    <>
    <Card 
      className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header con gradiente */}
      <div 
        className="p-5"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <SunOutlined style={{ fontSize: 20, color: "white" }} />
            </div>
            <Title level={5} style={{ margin: 0, color: "white" }}>
              Mis Vacaciones
            </Title>
          </div>
          {puedeSolicitar && diasDisponibles > 0 && (
            <Button 
              type="primary"
              ghost
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
              style={{ 
                borderColor: "white", 
                color: "white",
              }}
              size="small"
            >
              Solicitar
            </Button>
          )}
        </div>

        {/* Días disponibles destacado */}
        <div className="mt-4 text-center">
          <div 
            className="inline-flex items-baseline gap-1 px-6 py-3 rounded-2xl"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <span className="text-4xl font-bold text-white">{diasDisponibles}</span>
            <span className="text-white/80">días disponibles</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-3 bg-gray-50 border-b">
        <div className="flex justify-between mb-1">
          <Text type="secondary" className="text-xs">Progreso anual</Text>
          <Text className="text-xs font-medium">{diasTomados} de {totalDias} días</Text>
        </div>
        <Progress 
          percent={porcentajeUsado} 
          strokeColor={{
            '0%': '#10b981',
            '100%': '#059669',
          }}
          trailColor="#e5e7eb"
          showInfo={false}
          size="small"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        <div className="p-4 text-center">
          <CheckCircleOutlined style={{ fontSize: 18, color: "#10b981" }} />
          <div className="text-xl font-bold text-emerald-600 mt-1">{diasDisponibles}</div>
          <Text type="secondary" className="text-xs">Disponibles</Text>
        </div>
        <div className="p-4 text-center">
          <CalendarOutlined style={{ fontSize: 18, color: "#6b7280" }} />
          <div className="text-xl font-bold text-gray-600 mt-1">{diasTomados}</div>
          <Text type="secondary" className="text-xs">Tomados</Text>
        </div>
        <div className="p-4 text-center">
          <ClockCircleOutlined style={{ fontSize: 18, color: "#f59e0b" }} />
          <div className="text-xl font-bold text-amber-600 mt-1">{diasPendientes}</div>
          <Text type="secondary" className="text-xs">Pendientes</Text>
        </div>
      </div>

      {/* Solicitudes recientes */}
      {solicitudes.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-5 py-3 bg-gray-50 flex justify-between items-center">
            <Text strong className="text-sm">Solicitudes Recientes</Text>
            <Text type="secondary" className="text-xs">{solicitudes.length} solicitud(es)</Text>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {solicitudes.map((sol, index) => {
              const estadoStyle = getEstadoStyle(sol.estado);
              return (
                <div 
                  key={sol.cod_vacaciones || index}
                  className="px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: estadoStyle.bg }}
                    >
                      <CalendarOutlined style={{ fontSize: 14, color: estadoStyle.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <Text strong className="text-sm truncate block">
                          {sol.descripcion || "Vacaciones"}
                        </Text>
                        <Tag 
                          style={{ 
                            margin: 0,
                            backgroundColor: estadoStyle.bg,
                            color: estadoStyle.color,
                            border: `1px solid ${estadoStyle.border}`,
                            fontSize: "0.65rem",
                            padding: "0 6px",
                          }}
                        >
                          {sol.estado}
                        </Tag>
                      </div>
                      <Text type="secondary" className="text-xs block mt-0.5">
                        {sol.fecha_inicio} → {sol.fecha_termino}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {sol.dias} días
                      </Text>
                      
                      {/* Botón de descarga */}
                      {sol.puede_descargar_documento && sol.url_documento && (
                        <Button
                          type="link"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(sol.url_documento)}
                          loading={descargarDocumento.isPending}
                          className="p-0 h-auto mt-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Descargar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
    
    <VacationRequestModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      vacacionesData={vacacionesData}
    />
    </>
  );
}
