import { Typography, Avatar, Tag } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import config from "@/config/config";

const { Text, Title } = Typography;

/**
 * Header de empleado para móvil con información resumida
 */
export default function EmployeeHeaderMobile({
  informacion,
  loading = false,
}) {
  const appName = config.app.name;
  if (loading) {
    return (
      <div className="mobile-header-card animate-pulse">
        <Text className="text-white/70 text-xs font-medium uppercase tracking-wider mb-3 block">
          {appName}
        </Text>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-white/30 rounded-full"></div>
          <div className="flex-1">
            <div className="h-5 bg-white/30 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/30 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!informacion) {
    return (
      <div className="mobile-header-card">
        <Text className="text-white/70 text-xs font-medium uppercase tracking-wider block">
          {appName}
        </Text>
      </div>
    );
  }

  const { nombre, cargo, departamento, antiguedad_meses, tipo_contrato, foto_url } = informacion;
  
  // Formatear antigüedad
  const años = Math.floor(antiguedad_meses / 12);
  const meses = antiguedad_meses % 12;
  const antiguedadTexto = años > 0 
    ? `${años}a ${meses}m` 
    : `${meses} meses`;

  // Obtener iniciales
  const iniciales = nombre
    ?.split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("") || "?";

  return (
    <div className="mobile-header-card">
      {/* Nombre de la aplicación */}
      <Text className="text-white/70 text-xs font-medium uppercase tracking-wider mb-3 block">
        {appName}
      </Text>

      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Avatar 
          size={64}
          src={foto_url}
          icon={!foto_url && <UserOutlined />}
          style={{ 
            backgroundColor: foto_url ? "transparent" : "#3b82f6",
            fontSize: "1.5rem",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            border: foto_url ? "2px solid white" : "none",
          }}
        >
          {!foto_url && iniciales}
        </Avatar>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Title level={5} className="m-0 truncate text-white">
            {nombre}
          </Title>
          {cargo && (
            <Text className="block text-blue-100 text-sm truncate">
              {cargo}
            </Text>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {tipo_contrato && (
              <Tag 
                color={tipo_contrato === "INDEFINIDO" ? "green" : "orange"}
                className="m-0 text-xs"
              >
                {tipo_contrato}
              </Tag>
            )}
            <Tag className="m-0 text-xs bg-white/20 border-0 text-white">
              <CalendarOutlined className="mr-1" />
              {antiguedadTexto}
            </Tag>
          </div>
        </div>
      </div>

      {/* Departamento */}
      {departamento && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <Text className="text-blue-100 text-sm">
            📍 {departamento}
          </Text>
        </div>
      )}
    </div>
  );
}


