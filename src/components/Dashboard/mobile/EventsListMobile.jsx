import { Typography, Tag, Empty } from "antd";
import { 
  CalendarOutlined, 
  StarOutlined,
  SunOutlined,
  GiftOutlined,
  RightOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

/**
 * Configuración de iconos y colores por tipo
 */
const eventConfig = {
  feriado: { icon: <StarOutlined />, color: "#f59e0b", bg: "bg-amber-100" },
  vacaciones: { icon: <SunOutlined />, color: "#10b981", bg: "bg-green-100" },
  cumpleanos: { icon: <GiftOutlined />, color: "#8b5cf6", bg: "bg-purple-100" },
  default: { icon: <CalendarOutlined />, color: "#3b82f6", bg: "bg-blue-100" },
};

/**
 * Lista compacta de eventos para móvil
 */
export default function EventsListMobile({
  eventos = [],
  loading = false,
  maxItems = 4,
  onPress,
}) {
  if (loading) {
    return (
      <div className="mobile-card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const displayEventos = eventos.slice(0, maxItems);

  return (
    <div className="mobile-card" onClick={onPress}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="mobile-icon-circle bg-blue-100">
            <CalendarOutlined className="text-blue-500 text-lg" />
          </div>
          <Text className="mobile-card-title">Próximos Eventos</Text>
        </div>
        <RightOutlined className="text-gray-400" />
      </div>

      {/* Lista */}
      {displayEventos.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="Sin eventos próximos"
          className="py-2"
        />
      ) : (
        <div className="space-y-2">
          {displayEventos.map((evento, index) => {
            const config = eventConfig[evento.tipo] || eventConfig.default;
            const fechaEvento = dayjs(evento.fecha);
            const hoy = dayjs();
            const diasRestantes = fechaEvento.diff(hoy, "day");
            
            return (
              <div 
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all"
              >
                {/* Icono con emoji o icono */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}
                  style={{ flexShrink: 0 }}
                >
                  {evento.icono ? (
                    <span className="text-lg">{evento.icono}</span>
                  ) : (
                    <span style={{ color: config.color }}>{config.icon}</span>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <Text className="block truncate font-medium">
                    {evento.titulo}
                  </Text>
                  <Text type="secondary" className="text-xs">
                    {fechaEvento.format("ddd, D MMM")}
                  </Text>
                </div>

                {/* Días restantes */}
                <Tag 
                  color={diasRestantes <= 7 ? "warning" : "default"}
                  className="m-0 flex-shrink-0"
                >
                  {diasRestantes === 0 
                    ? "Hoy" 
                    : diasRestantes === 1 
                      ? "Mañana" 
                      : `${diasRestantes}d`
                  }
                </Tag>
              </div>
            );
          })}
        </div>
      )}

      {eventos.length > maxItems && (
        <Text type="secondary" className="block text-center text-xs mt-2">
          +{eventos.length - maxItems} más
        </Text>
      )}
    </div>
  );
}


