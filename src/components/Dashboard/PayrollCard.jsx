import { Card, Typography, Skeleton, Button, Empty } from "antd";
import { 
  DollarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  FilePdfOutlined,
  EyeOutlined,
  WalletOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;

/**
 * Formateador de moneda chilena
 */
const formatCurrency = (value) => {
  if (value == null) return "$0";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Tarjeta de última liquidación - Diseño moderno
 */
export default function PayrollCard({
  liquidacion,
  loading = false,
  onViewPDF,
  onViewDetail,
  className = "",
}) {
  if (loading) {
    return (
      <Card className={`overflow-hidden ${className}`} styles={{ body: { padding: 0 } }}>
        <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600">
          <Skeleton.Avatar active size={40} />
        </div>
        <div className="p-6">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
      </Card>
    );
  }

  if (!liquidacion) {
    return (
      <Card 
        className={`shadow-lg ${className}`}
        styles={{ body: { padding: "2rem" } }}
      >
        <Empty
          image={<WalletOutlined style={{ fontSize: 48, color: "#d1d5db" }} />}
          imageStyle={{ height: 60 }}
          description={
            <Text type="secondary">No hay liquidaciones disponibles</Text>
          }
        />
      </Card>
    );
  }

  const { fecha, monto_liquido, total_haberes, total_descuentos, cod_liquidacion } = liquidacion;
  const mesFormateado = dayjs(fecha).format("MMMM YYYY");

  return (
    <Card 
      className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header con gradiente */}
      <div 
        className="p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
        }}
      >
        {/* Círculo decorativo */}
        <div 
          className="absolute -right-10 -top-10 w-32 h-32 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />
        <div 
          className="absolute -right-5 -bottom-10 w-24 h-24 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <DollarOutlined style={{ fontSize: 20, color: "white" }} />
              </div>
              <div>
                <Title level={5} style={{ margin: 0, color: "white" }}>
                  Última Liquidación
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", textTransform: "capitalize" }}>
                  {mesFormateado}
                </Text>
              </div>
            </div>
          </div>

          {/* Monto líquido */}
          <div className="text-center py-2">
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
              Líquido a Pagar
            </Text>
            <div 
              className="text-3xl font-bold text-white mt-1"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
            >
              {formatCurrency(monto_liquido)}
            </div>
          </div>
        </div>
      </div>

      {/* Desglose */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Haberes */}
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: "#f0fdf4" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <ArrowUpOutlined style={{ color: "#16a34a", fontSize: 14 }} />
              </div>
              <Text type="secondary" className="text-xs">Haberes</Text>
            </div>
            <Text strong className="text-lg" style={{ color: "#16a34a" }}>
              {formatCurrency(total_haberes)}
            </Text>
          </div>

          {/* Descuentos */}
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: "#fef2f2" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#fee2e2" }}
              >
                <ArrowDownOutlined style={{ color: "#dc2626", fontSize: 14 }} />
              </div>
              <Text type="secondary" className="text-xs">Descuentos</Text>
            </div>
            <Text strong className="text-lg" style={{ color: "#dc2626" }}>
              {formatCurrency(total_descuentos)}
            </Text>
          </div>
        </div>

        {/* Botones */}
        {(onViewPDF || onViewDetail) && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            {onViewDetail && (
              <Button 
                block
                icon={<EyeOutlined />} 
                onClick={() => onViewDetail(cod_liquidacion)}
              >
                Ver Detalle
              </Button>
            )}
            {onViewPDF && (
              <Button 
                type="primary"
                block
                icon={<FilePdfOutlined />} 
                onClick={() => onViewPDF(cod_liquidacion)}
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
              >
                Descargar PDF
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
