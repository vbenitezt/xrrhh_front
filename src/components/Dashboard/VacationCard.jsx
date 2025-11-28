import { useState } from "react";
import { Card, Progress, Typography, Tag, Statistic, Row, Col, Skeleton, Button, message } from "antd";
import { 
  SunOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CalendarOutlined,
  PlusOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import VacationRequestModal from "./VacationRequestModal";
import { useDescargarDocumentoVacaciones } from "../../services/dashboard";

const { Text } = Typography;

/**
 * Tarjeta de resumen de vacaciones para empleados
 */
export default function VacationCard({
  diasDisponibles = 0,
  diasTomados = 0,
  diasPendientes = 0,
  solicitudes = [],
  loading = false,
  className = "",
  vacacionesData = null, // Datos completos de mis-vacaciones para el modal
  puedeSolicitar = true,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const descargarDocumento = useDescargarDocumentoVacaciones();
  const totalDias = diasDisponibles + diasTomados;
  const porcentajeUsado = totalDias > 0 ? Math.round((diasTomados / totalDias) * 100) : 0;

  // Manejar descarga de documento
  const handleDownload = async (url_documento) => {
    try {
      await descargarDocumento.mutateAsync(url_documento);
      message.success("Documento descargado");
    } catch (error) {
      message.error("Error al descargar el documento");
    }
  };

  if (loading) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <SunOutlined style={{ color: "#10b981" }} />
            Mis Vacaciones
          </span>
        }
        className={className}
      >
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  return (
    <>
    <Card 
      title={
        <span className="flex items-center gap-2">
          <SunOutlined style={{ color: "#10b981" }} />
          Mis Vacaciones
        </span>
      }
      extra={
        puedeSolicitar && diasDisponibles > 0 && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
            size="small"
          >
            Solicitar
          </Button>
        )
      }
      className={className}
    >
      {/* Progreso visual */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <Text type="secondary">Días utilizados</Text>
          <Text strong>{diasTomados} de {totalDias}</Text>
        </div>
        <Progress 
          percent={porcentajeUsado} 
          strokeColor={{
            '0%': '#10b981',
            '100%': '#059669',
          }}
          trailColor="#e5e7eb"
          showInfo={false}
        />
      </div>

      {/* Estadísticas */}
      <Row gutter={16} className="text-center">
        <Col span={8}>
          <Statistic
            title={<Text type="secondary" className="text-xs">Disponibles</Text>}
            value={diasDisponibles}
            suffix="días"
            valueStyle={{ color: "#10b981", fontSize: "1.25rem" }}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={<Text type="secondary" className="text-xs">Tomados</Text>}
            value={diasTomados}
            suffix="días"
            valueStyle={{ color: "#6b7280", fontSize: "1.25rem" }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title={<Text type="secondary" className="text-xs">Pendientes</Text>}
            value={diasPendientes}
            suffix="días"
            valueStyle={{ color: "#f59e0b", fontSize: "1.25rem" }}
            prefix={<ClockCircleOutlined />}
          />
        </Col>
      </Row>

      {/* Solicitudes activas */}
      {solicitudes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Text strong className="block mb-2">Solicitudes Recientes</Text>
          {solicitudes.map((sol) => (
            <div 
              key={sol.cod_vacaciones} 
              className="py-2 px-3 bg-gray-50 rounded-lg mb-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <CalendarOutlined style={{ color: "#6b7280" }} />
                  <div className="min-w-0">
                    <Text className="block text-sm truncate">{sol.descripcion || "Solicitud de vacaciones"}</Text>
                    <Text type="secondary" className="text-xs">
                      {sol.fecha_inicio} → {sol.fecha_termino} ({sol.dias} días)
                    </Text>
                  </div>
                </div>
                <Tag 
                  color={
                    sol.estado === "ACEPTADA" || sol.estado === "Aprobada" ? "success" :
                    sol.estado === "RECHAZADA" || sol.estado === "Rechazada" ? "error" :
                    "processing"
                  }
                  className="flex-shrink-0"
                >
                  {sol.estado}
                </Tag>
              </div>
              
              {/* Botón de descarga si está disponible */}
              {sol.puede_descargar_documento && sol.url_documento && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <Button
                    type="link"
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(sol.url_documento)}
                    loading={descargarDocumento.isPending}
                    className="p-0"
                  >
                    Descargar Comprobante
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
    
    {/* Modal de solicitud de vacaciones */}
    <VacationRequestModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      vacacionesData={vacacionesData}
    />
    </>
  );
}

