import { Card, Typography, Tag, Skeleton, Avatar, Button, Divider } from "antd";
import { 
  UserOutlined, 
  IdcardOutlined, 
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  DownloadOutlined,
  WalletOutlined
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
 * Tarjeta de información personal del empleado con liquidación integrada
 */
export default function EmployeeInfoCard({
  informacion,
  liquidacion,
  loading = false,
  className = "",
  onDownloadLiquidacion,
}) {
  if (loading) {
    return (
      <Card className={`overflow-hidden ${className}`} styles={{ body: { padding: 0 } }}>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <Skeleton.Avatar active size={80} />
          <Skeleton active paragraph={{ rows: 1 }} className="mt-4" />
        </div>
        <div className="p-6">
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      </Card>
    );
  }

  if (!informacion) {
    return (
      <Card className={className}>
        <div className="text-center py-8">
          <UserOutlined style={{ fontSize: 48, color: "#d1d5db" }} />
          <Text type="secondary" className="block mt-2">No hay información disponible</Text>
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
    foto_url,
  } = informacion;

  // Calcular años y meses de antigüedad
  const años = Math.floor(antiguedad_meses / 12);
  const meses = antiguedad_meses % 12;
  const antiguedadTexto = años > 0 
    ? `${años} año${años > 1 ? "s" : ""} y ${meses} mes${meses !== 1 ? "es" : ""}` 
    : `${meses} mes${meses !== 1 ? "es" : ""}`;

  // Color del tag según tipo de contrato
  const getContratoStyle = (tipo) => {
    const styles = {
      "INDEFINIDO": { bg: "#dcfce7", color: "#166534", border: "#86efac" },
      "PLAZO FIJO": { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
      "HONORARIOS": { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" },
    };
    return styles[tipo?.toUpperCase()] || styles["HONORARIOS"];
  };

  const contratoStyle = getContratoStyle(tipo_contrato);

  // Obtener iniciales
  const iniciales = nombre
    ?.split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("") || "?";

  return (
    <Card 
      className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header con gradiente */}
      <div 
        className="relative p-6"
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 50%, #3d5a80 100%)",
        }}
      >
        {/* Patrón decorativo */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative flex items-start gap-5">
          {/* Avatar */}
          <Avatar 
            size={90}
            src={foto_url}
            icon={!foto_url && <UserOutlined style={{ fontSize: 40 }} />}
            style={{ 
              backgroundColor: foto_url ? "transparent" : "rgba(255,255,255,0.15)",
              border: "4px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              fontSize: "2rem",
              color: "white",
              flexShrink: 0,
            }}
          >
            {!foto_url && iniciales}
          </Avatar>
          
          {/* Info principal */}
          <div className="flex-1 min-w-0">
            <Title level={3} style={{ margin: 0, color: "white", fontWeight: 600 }}>
              {nombre}
            </Title>
            {cargo && (
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", display: "block", marginTop: 4 }}>
                {cargo}
              </Text>
            )}
            {departamento && (
              <div className="flex items-center gap-1 mt-2">
                <EnvironmentOutlined style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }} />
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                  {departamento}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats y Liquidación */}
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Ingreso */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <CalendarOutlined style={{ color: "#3b82f6", fontSize: 18 }} />
              <Text type="secondary" className="text-xs">Ingreso</Text>
            </div>
            <Text strong className="text-sm">
              {dayjs(fecha_ingreso).format("DD/MM/YYYY")}
            </Text>
          </div>

          {/* Antigüedad */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <IdcardOutlined style={{ color: "#8b5cf6", fontSize: 18 }} />
              <Text type="secondary" className="text-xs">Antigüedad</Text>
            </div>
            <Text strong className="text-sm">
              {antiguedadTexto}
            </Text>
          </div>

          {/* Contrato */}
          {tipo_contrato && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <FileTextOutlined style={{ color: "#10b981", fontSize: 18 }} />
                <Text type="secondary" className="text-xs">Contrato</Text>
              </div>
              <Tag 
                style={{ 
                  margin: 0,
                  backgroundColor: contratoStyle.bg,
                  color: contratoStyle.color,
                  border: `1px solid ${contratoStyle.border}`,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                {tipo_contrato}
              </Tag>
            </div>
          )}

          {/* Sueldo */}
          {sueldo_base && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarOutlined style={{ color: "#f59e0b", fontSize: 18 }} />
                <Text type="secondary" className="text-xs">Sueldo Base</Text>
              </div>
              <Text strong className="text-sm" style={{ color: "#059669" }}>
                {formatCurrency(sueldo_base)}
              </Text>
            </div>
          )}

          {/* Última Liquidación */}
          <div 
            className="rounded-xl p-4 border md:col-span-1 col-span-2"
            style={{ 
              background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
              borderColor: "#93c5fd",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <WalletOutlined style={{ color: "#3b82f6", fontSize: 18 }} />
              <Text type="secondary" className="text-xs">Última Liquidación</Text>
            </div>
            {liquidacion ? (
              <div className="flex items-center justify-between">
                <div>
                  <Text strong className="text-lg block" style={{ color: "#1e40af" }}>
                    {formatCurrency(liquidacion.monto_liquido)}
                  </Text>
                  <Text type="secondary" className="text-xs" style={{ textTransform: "capitalize" }}>
                    {dayjs(liquidacion.fecha).format("MMMM YYYY")}
                  </Text>
                </div>
                {onDownloadLiquidacion && (
                  <Button
                    type="primary"
                    size="small"
                    icon={<DownloadOutlined />}
                    onClick={() => onDownloadLiquidacion(liquidacion.cod_liquidacion)}
                    style={{ 
                      backgroundColor: "#3b82f6",
                      borderColor: "#3b82f6",
                    }}
                  />
                )}
              </div>
            ) : (
              <Text type="secondary" className="text-sm">No disponible</Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
