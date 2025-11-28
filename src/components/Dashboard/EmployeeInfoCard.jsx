import { Card, Typography, Descriptions, Tag, Skeleton, Avatar, Divider } from "antd";
import { 
  UserOutlined, 
  IdcardOutlined, 
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;

/**
 * Formateador de moneda chilena
 */
const formatCurrency = (value) => {
  if (value == null) return "-";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Tarjeta de información personal del empleado
 */
export default function EmployeeInfoCard({
  informacion,
  loading = false,
  className = "",
}) {
  if (loading) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <UserOutlined style={{ color: "#3b82f6" }} />
            Mi Información
          </span>
        }
        className={className}
      >
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (!informacion) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <UserOutlined style={{ color: "#3b82f6" }} />
            Mi Información
          </span>
        }
        className={className}
      >
        <div className="text-center py-8">
          <Text type="secondary">No hay información disponible</Text>
        </div>
      </Card>
    );
  }

  const {
    nombre,
    cargo,
    departamento,
    fecha_ingreso,
    antiguedad_meses,
    tipo_contrato,
    sueldo_base,
    foto_url,  // Avatar desde la API
  } = informacion;

  // Calcular años y meses de antigüedad
  const años = Math.floor(antiguedad_meses / 12);
  const meses = antiguedad_meses % 12;
  const antiguedadTexto = años > 0 
    ? `${años} año${años > 1 ? "s" : ""} y ${meses} mes${meses !== 1 ? "es" : ""}` 
    : `${meses} mes${meses !== 1 ? "es" : ""}`;

  // Color del tag según tipo de contrato
  const contratoColor = {
    "INDEFINIDO": "success",
    "PLAZO FIJO": "warning",
    "HONORARIOS": "default",
  }[tipo_contrato?.toUpperCase()] || "default";

  return (
    <Card 
      title={
        <span className="flex items-center gap-2">
          <UserOutlined style={{ color: "#3b82f6" }} />
          Mi Información
        </span>
      }
      className={className}
    >
      {/* Encabezado con avatar y nombre */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
        <Avatar 
          size={72}
          src={foto_url}
          icon={!foto_url && <UserOutlined />}
          style={{ 
            backgroundColor: foto_url ? "transparent" : "#3b82f6",
            boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
            border: foto_url ? "3px solid #e5e7eb" : "none",
          }}
        />
        <div>
          <Title level={4} style={{ margin: 0 }}>{nombre}</Title>
          {cargo && (
            <Text type="secondary" className="text-lg">{cargo}</Text>
          )}
        </div>
      </div>

      {/* Información en grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {departamento && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <TeamOutlined style={{ color: "#6b7280", fontSize: "1.25rem" }} />
            <div>
              <Text type="secondary" className="text-xs block">Departamento</Text>
              <Text strong>{departamento}</Text>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <CalendarOutlined style={{ color: "#3b82f6", fontSize: "1.25rem" }} />
          <div>
            <Text type="secondary" className="text-xs block">Ingreso</Text>
            <Text strong>{dayjs(fecha_ingreso).format("DD/MM/YYYY")}</Text>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
          <IdcardOutlined style={{ color: "#8b5cf6", fontSize: "1.25rem" }} />
          <div>
            <Text type="secondary" className="text-xs block">Antigüedad</Text>
            <Text strong>{antiguedadTexto}</Text>
          </div>
        </div>

        {tipo_contrato && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <FileTextOutlined style={{ color: "#10b981", fontSize: "1.25rem" }} />
            <div>
              <Text type="secondary" className="text-xs block">Contrato</Text>
              <Tag color={contratoColor} style={{ margin: 0 }}>
                {tipo_contrato}
              </Tag>
            </div>
          </div>
        )}

        {sueldo_base && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg col-span-2 md:col-span-1">
            <DollarOutlined style={{ color: "#f59e0b", fontSize: "1.25rem" }} />
            <div>
              <Text type="secondary" className="text-xs block">Sueldo Base</Text>
              <Text strong style={{ color: "#f59e0b" }}>
                {formatCurrency(sueldo_base)}
              </Text>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

