import { Card, Avatar, Typography, Tooltip, Empty } from "antd";
import { GiftOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;

/**
 * Banner de cumpleaños con avatares
 * Muestra los cumpleañeros del mes en formato horizontal
 */
export default function BirthdayBanner({
  cumpleanos = [],
  title = "🎂 Cumpleaños del Mes",
  loading = false,
  className = "",
}) {
  if (loading) {
    return (
      <Card className={`mb-4 ${className}`}>
        <div className="flex items-center gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="w-20 h-3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!cumpleanos || cumpleanos.length === 0) {
    return null; // No mostrar si no hay cumpleaños
  }

  // Ordenar por fecha más cercana
  const sortedCumpleanos = [...cumpleanos].sort((a, b) => {
    const fechaA = dayjs(a.fecha_cumpleanos);
    const fechaB = dayjs(b.fecha_cumpleanos);
    return fechaA.diff(fechaB);
  });

  // Determinar si es hoy
  const isToday = (fecha) => dayjs(fecha).isSame(dayjs(), 'day');
  
  // Determinar si ya pasó este año
  const hasPassed = (fecha) => dayjs(fecha).isBefore(dayjs(), 'day');

  return (
    <Card 
      className={`mb-4 overflow-hidden ${className}`}
      styles={{ 
        body: { 
          padding: "16px 24px",
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)"
        } 
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <GiftOutlined style={{ fontSize: 24, color: "#d97706" }} />
        <Title level={5} style={{ margin: 0, color: "#92400e" }}>
          {title}
        </Title>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
        {sortedCumpleanos.map((persona, index) => {
          const isBirthdayToday = isToday(persona.fecha_cumpleanos);
          const passed = hasPassed(persona.fecha_cumpleanos);
          
          return (
            <Tooltip 
              key={persona.cod_empleado || index}
              title={
                <div className="text-center">
                  <div className="font-medium">{persona.nombre}</div>
                  <div className="text-xs opacity-80">{persona.cargo || persona.departamento}</div>
                  <div className="text-xs mt-1">
                    {dayjs(persona.fecha_cumpleanos).format("DD [de] MMMM")}
                  </div>
                  <div className="text-xs font-medium mt-1">
                    Cumple {persona.edad_cumple} años
                  </div>
                </div>
              }
            >
              <div 
                className={`flex flex-col items-center min-w-[80px] p-2 rounded-xl transition-all hover:scale-105 cursor-pointer ${
                  isBirthdayToday 
                    ? "bg-gradient-to-b from-pink-400 to-rose-500 shadow-lg" 
                    : passed 
                      ? "opacity-60" 
                      : "bg-white/50 hover:bg-white/80"
                }`}
              >
                {/* Avatar con borde especial si es hoy */}
                <div className={`relative ${isBirthdayToday ? "animate-bounce" : ""}`}>
                  <Avatar
                    size={56}
                    src={persona.foto_url}
                    icon={!persona.foto_url && <UserOutlined />}
                    style={{
                      border: isBirthdayToday 
                        ? "3px solid #fff" 
                        : "2px solid #fbbf24",
                      boxShadow: isBirthdayToday 
                        ? "0 4px 12px rgba(236, 72, 153, 0.4)" 
                        : "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  {isBirthdayToday && (
                    <div className="absolute -top-2 -right-2 text-xl">🎉</div>
                  )}
                </div>

                {/* Nombre (truncado) */}
                <Text 
                  className={`text-xs font-medium mt-2 text-center truncate w-full ${
                    isBirthdayToday ? "text-white" : "text-amber-900"
                  }`}
                  style={{ maxWidth: 80 }}
                >
                  {persona.nombre?.split(" ")[0]}
                </Text>

                {/* Fecha */}
                <Text 
                  className={`text-xs ${
                    isBirthdayToday ? "text-white/90" : "text-amber-700"
                  }`}
                >
                  {isBirthdayToday 
                    ? "¡Hoy!" 
                    : dayjs(persona.fecha_cumpleanos).format("DD MMM")
                  }
                </Text>

                {/* Edad que cumple */}
                <div 
                  className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                    isBirthdayToday 
                      ? "bg-white text-pink-600" 
                      : "bg-amber-200 text-amber-800"
                  }`}
                >
                  {persona.edad_cumple} años
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </Card>
  );
}

