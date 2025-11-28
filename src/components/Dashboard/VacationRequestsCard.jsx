import { Card, Avatar, Tag, Button, Typography, Empty, Skeleton, Popconfirm } from "antd";
import { 
  SunOutlined, 
  CheckOutlined, 
  CloseOutlined,
  CalendarOutlined,
  UserOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

/**
 * Tarjeta de solicitudes de vacaciones pendientes para administradores
 */
export default function VacationRequestsCard({
  solicitudes = [],
  loading = false,
  onApprove,
  onReject,
  approvingId = null,
  rejectingId = null,
  maxItems = 5,
  className = "",
}) {
  if (loading) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <SunOutlined style={{ color: "#10b981" }} />
            Solicitudes de Vacaciones
          </span>
        }
        className={className}
      >
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </Card>
    );
  }

  const displaySolicitudes = solicitudes.slice(0, maxItems);
  const pendientes = solicitudes.filter(s => s.estado === "Pendiente" || s.estado === "SOLICITUD").length;

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <SunOutlined style={{ color: "#10b981" }} />
            Solicitudes de Vacaciones
          </span>
          {pendientes > 0 && (
            <Tag color="warning">
              {pendientes} pendiente{pendientes > 1 ? "s" : ""}
            </Tag>
          )}
        </div>
      }
      className={className}
      styles={{ body: { padding: "12px" } }}
    >
      {displaySolicitudes.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No hay solicitudes pendientes"
        />
      ) : (
        <div className="space-y-3">
          {displaySolicitudes.map((solicitud) => {
            const isPending = solicitud.estado === "Pendiente" || solicitud.estado === "SOLICITUD";
            const isApproving = approvingId === solicitud.cod_vacaciones;
            const isRejecting = rejectingId === solicitud.cod_vacaciones;
            
            return (
              <div 
                key={solicitud.cod_vacaciones}
                className="p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all"
              >
                {/* Header: Avatar + Nombre + Estado */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Avatar 
                      size={36}
                      style={{ backgroundColor: "#10b981", flexShrink: 0 }}
                      icon={<UserOutlined />}
                    />
                    <div className="min-w-0 flex-1">
                      <Text strong className="block truncate text-sm" title={solicitud.empleado}>
                        {solicitud.empleado}
                      </Text>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <CalendarOutlined />
                        <span className="whitespace-nowrap">
                          {dayjs(solicitud.fecha_inicio).format("DD/MM/YYYY")} → {dayjs(solicitud.fecha_termino).format("DD/MM/YYYY")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Tag 
                    color={
                      solicitud.estado === "Aprobada" || solicitud.estado === "APROBADA" ? "success" :
                      solicitud.estado === "Rechazada" || solicitud.estado === "RECHAZADA" ? "error" :
                      "processing"
                    }
                    className="m-0 flex-shrink-0"
                  >
                    {solicitud.estado}
                  </Tag>
                </div>

                {/* Footer: Días + Acciones */}
                <div className="flex items-center justify-between">
                  <Tag color="blue">
                    {solicitud.dias} días
                  </Tag>
                  
                  {isPending && (
                    <div className="flex gap-1">
                      <Popconfirm
                        title="¿Aprobar esta solicitud?"
                        onConfirm={() => onApprove?.(solicitud.cod_vacaciones)}
                        okText="Sí"
                        cancelText="No"
                      >
                        <Button 
                          type="primary" 
                          size="small" 
                          icon={<CheckOutlined />}
                          loading={isApproving}
                          style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
                        />
                      </Popconfirm>
                      <Popconfirm
                        title="¿Rechazar esta solicitud?"
                        onConfirm={() => onReject?.(solicitud.cod_vacaciones)}
                        okText="Sí"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Button 
                          danger 
                          size="small" 
                          icon={<CloseOutlined />}
                          loading={isRejecting}
                        />
                      </Popconfirm>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
