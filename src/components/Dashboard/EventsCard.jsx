import { Card, Timeline, Typography, Tag, Empty, Skeleton } from "antd";
import { 
  CalendarOutlined, 
  GiftOutlined,
  SunOutlined,
  StarOutlined,
  BellOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

/**
 * Mapeo de iconos y colores por tipo de evento
 */
const eventConfig = {
  feriado: {
    icon: <StarOutlined />,
    color: "#f59e0b",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  vacaciones: {
    icon: <SunOutlined />,
    color: "#10b981",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  cumpleanos: {
    icon: <GiftOutlined />,
    color: "#8b5cf6",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  reunion: {
    icon: <CalendarOutlined />,
    color: "#3b82f6",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  default: {
    icon: <BellOutlined />,
    color: "#6b7280",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
};

/**
 * Tarjeta de próximos eventos
 */
export default function EventsCard({
  eventos = [],
  title = "Próximos Eventos",
  loading = false,
  maxItems = 5,
  className = "",
}) {
  if (loading) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <CalendarOutlined style={{ color: "#3b82f6" }} />
            {title}
          </span>
        }
        className={className}
      >
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  const displayEventos = eventos.slice(0, maxItems);

  return (
    <Card 
      title={
        <span className="flex items-center gap-2">
          <CalendarOutlined style={{ color: "#3b82f6" }} />
          {title}
        </span>
      }
      className={className}
      styles={{ body: { padding: "16px" } }}
    >
      {displayEventos.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No hay eventos próximos"
        />
      ) : (
        <Timeline
          items={displayEventos.map((evento) => {
            const config = eventConfig[evento.tipo] || eventConfig.default;
            const fechaEvento = dayjs(evento.fecha);
            const hoy = dayjs();
            const diasRestantes = fechaEvento.diff(hoy, "day");
            
            return {
              color: config.color,
              dot: (
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor}`}
                  style={{ border: `2px solid ${config.color}` }}
                >
                  {evento.icono || config.icon}
                </div>
              ),
              children: (
                <div className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                  <div className="flex items-center justify-between mb-1">
                    <Text strong>{evento.titulo}</Text>
                    <Tag 
                      color={diasRestantes <= 7 ? "warning" : "default"}
                      style={{ marginRight: 0 }}
                    >
                      {diasRestantes === 0 
                        ? "Hoy" 
                        : diasRestantes === 1 
                          ? "Mañana" 
                          : `${diasRestantes} días`
                      }
                    </Tag>
                  </div>
                  <Text type="secondary" className="text-sm">
                    📅 {fechaEvento.format("dddd, D [de] MMMM")}
                  </Text>
                </div>
              ),
            };
          })}
        />
      )}
    </Card>
  );
}

