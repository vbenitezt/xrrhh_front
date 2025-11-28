import { Typography, Avatar, Tag, Empty } from "antd";
import { 
  GiftOutlined, 
  CrownOutlined, 
  UserOutlined,
  RightOutlined 
} from "@ant-design/icons";

const { Text } = Typography;

/**
 * Lista compacta de cumpleaños para móvil
 */
export default function BirthdayListMobile({
  cumpleanos = [],
  loading = false,
  maxItems = 3,
  onPress,
  onItemPress,
}) {
  if (loading) {
    return (
      <div className="mobile-card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        {[1, 2].map(i => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const displayCumpleanos = cumpleanos.slice(0, maxItems);
  const hayHoy = displayCumpleanos.some(c => c.es_hoy || c.dias_restantes === 0);

  return (
    <div className="mobile-card" onClick={onPress}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`mobile-icon-circle ${hayHoy ? 'bg-amber-100' : 'bg-purple-100'}`}>
            <GiftOutlined className={`text-lg ${hayHoy ? 'text-amber-500' : 'text-purple-500'}`} />
          </div>
          <div className="flex items-center gap-2">
            <Text className="mobile-card-title">Cumpleaños</Text>
            {hayHoy && (
              <Tag color="gold" className="m-0">¡Hoy!</Tag>
            )}
          </div>
        </div>
        <RightOutlined className="text-gray-400" />
      </div>

      {/* Lista */}
      {displayCumpleanos.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="Sin cumpleaños próximos"
          className="py-2"
        />
      ) : (
        <div className="space-y-2">
          {displayCumpleanos.map((item, index) => {
            const esHoy = item.es_hoy || item.dias_restantes === 0;
            
            return (
              <div 
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  esHoy ? 'bg-amber-50 border border-amber-200' : 'hover:bg-gray-50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onItemPress?.(item);
                }}
              >
                <Avatar 
                  size={40}
                  style={{ 
                    backgroundColor: item.es_jefatura ? '#1e40af' : '#8b5cf6',
                    flexShrink: 0
                  }}
                  icon={item.es_jefatura ? <CrownOutlined /> : <UserOutlined />}
                />
                <div className="flex-1 min-w-0">
                  <Text className="block truncate font-medium">
                    {item.nombre}
                  </Text>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text type="secondary" className="text-xs">
                      📅 {item.fecha}
                    </Text>
                    {item.es_jefatura && (
                      <Tag color="blue" className="m-0 text-xs">Jefe</Tag>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {esHoy ? (
                    <span className="text-2xl">🎂</span>
                  ) : (
                    <Text className="text-xs text-purple-600 font-medium">
                      {item.dias_restantes}d
                    </Text>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cumpleanos.length > maxItems && (
        <Text type="secondary" className="block text-center text-xs mt-2">
          +{cumpleanos.length - maxItems} más
        </Text>
      )}
    </div>
  );
}


