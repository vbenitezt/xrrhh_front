import { Card, Avatar, Tag, Empty, Skeleton, Typography, Badge, List } from "antd";
import { GiftOutlined, CrownOutlined, UserOutlined } from "@ant-design/icons";
import confetti from "canvas-confetti";
import { useEffect } from "react";

const { Text, Title } = Typography;

/**
 * Componente para mostrar un ítem de cumpleaños
 */
function BirthdayItem({ nombre, fecha, diasRestantes, esHoy, esJefatura, edad, cargo, fotoUrl }) {
  // Lanzar confetti si es cumpleaños hoy
  useEffect(() => {
    if (esHoy) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [esHoy]);

  return (
    <List.Item
      className={`rounded-lg mb-2 transition-all ${
        esHoy 
          ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400" 
          : "hover:bg-gray-50"
      }`}
      style={{ padding: "12px 16px" }}
    >
      <List.Item.Meta
        avatar={
          <Badge
            count={esHoy ? "🎂" : diasRestantes}
            offset={[-5, 5]}
            style={{
              backgroundColor: esHoy ? "transparent" : diasRestantes <= 7 ? "#f59e0b" : "#8b5cf6",
              fontSize: esHoy ? "1.2rem" : "0.75rem",
            }}
          >
            <Avatar 
              size={48}
              src={fotoUrl}
              style={{ 
                backgroundColor: fotoUrl ? "transparent" : (esJefatura ? "#1e40af" : "#8b5cf6"),
                boxShadow: esHoy ? "0 0 0 3px #fbbf24" : "none",
                border: fotoUrl ? "2px solid #e5e7eb" : "none",
              }}
              icon={!fotoUrl && (esJefatura ? <CrownOutlined /> : <UserOutlined />)}
            />
          </Badge>
        }
        title={
          <div className="flex items-center gap-2 flex-wrap">
            <Text strong className={esHoy ? "text-amber-700" : ""}>
              {nombre}
            </Text>
            {esJefatura && (
              <Tag color="blue" style={{ marginRight: 0 }}>
                Jefatura
              </Tag>
            )}
            {esHoy && (
              <Tag color="gold" style={{ marginRight: 0 }}>
                ¡HOY! 🎉
              </Tag>
            )}
          </div>
        }
        description={
          <div className="flex flex-col gap-1">
            {cargo && <Text type="secondary" className="text-xs">{cargo}</Text>}
            <div className="flex items-center gap-2">
              <Text type="secondary" className="text-sm">
                📅 {fecha}
              </Text>
              {edad && (
                <Text type="secondary" className="text-sm">
                  • Cumple {edad} años
                </Text>
              )}
            </div>
            {!esHoy && (
              <Text 
                className="text-sm"
                style={{ color: diasRestantes <= 7 ? "#d97706" : "#6b7280" }}
              >
                {diasRestantes === 1 ? "¡Mañana!" : `En ${diasRestantes} días`}
              </Text>
            )}
          </div>
        }
      />
    </List.Item>
  );
}

/**
 * Tarjeta de cumpleaños con lista de personas
 */
export default function BirthdayCard({
  cumpleanos = [],
  title = "Próximos Cumpleaños",
  loading = false,
  showJefatura = true,
  maxItems = 5,
  emptyText = "No hay cumpleaños próximos",
  className = "",
}) {
  if (loading) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <GiftOutlined style={{ color: "#8b5cf6" }} />
            {title}
          </span>
        }
        className={className}
      >
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </Card>
    );
  }

  // Filtrar por jefatura si es necesario y limitar items
  const filteredCumpleanos = showJefatura 
    ? cumpleanos 
    : cumpleanos.filter(c => !c.es_jefatura);
  
  const displayCumpleanos = filteredCumpleanos.slice(0, maxItems);
  const hasMore = filteredCumpleanos.length > maxItems;
  
  // Verificar si hay cumpleaños hoy
  const hayHoy = displayCumpleanos.some(c => c.es_hoy || c.dias_restantes === 0);

  return (
    <Card 
      title={
        <span className="flex items-center gap-2">
          <GiftOutlined style={{ color: hayHoy ? "#f59e0b" : "#8b5cf6" }} />
          {title}
          {hayHoy && (
            <Tag color="gold" className="ml-2">
              ¡Celebración hoy!
            </Tag>
          )}
        </span>
      }
      className={className}
      styles={{ body: { padding: "12px" } }}
    >
      {displayCumpleanos.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={emptyText}
        />
      ) : (
        <>
          <List
            dataSource={displayCumpleanos}
            renderItem={(item) => (
              <BirthdayItem
                nombre={item.nombre}
                fecha={item.fecha}
                diasRestantes={item.dias_restantes}
                esHoy={item.es_hoy || item.dias_restantes === 0}
                esJefatura={item.es_jefatura}
                edad={item.edad || item.edad_cumple}
                cargo={item.cargo}
                fotoUrl={item.foto_url}
              />
            )}
          />
          {hasMore && (
            <Text type="secondary" className="text-center block mt-2">
              +{filteredCumpleanos.length - maxItems} más...
            </Text>
          )}
        </>
      )}
    </Card>
  );
}

