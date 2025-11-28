import { Card, Typography, Statistic, Row, Col, Divider, Skeleton, Button, Tag } from "antd";
import { 
  DollarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  FilePdfOutlined,
  EyeOutlined
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
 * Tarjeta de última liquidación para empleados
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
      <Card 
        title={
          <span className="flex items-center gap-2">
            <DollarOutlined style={{ color: "#3b82f6" }} />
            Última Liquidación
          </span>
        }
        className={className}
      >
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (!liquidacion) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <DollarOutlined style={{ color: "#3b82f6" }} />
            Última Liquidación
          </span>
        }
        className={className}
      >
        <div className="text-center py-8">
          <Text type="secondary">No hay liquidaciones disponibles</Text>
        </div>
      </Card>
    );
  }

  const { fecha, monto_liquido, total_haberes, total_descuentos, cod_liquidacion } = liquidacion;

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarOutlined style={{ color: "#3b82f6" }} />
            Última Liquidación
          </span>
          <Tag color="blue">
            {dayjs(fecha).format("MMMM YYYY")}
          </Tag>
        </div>
      }
      className={className}
      extra={
        <div className="flex gap-2">
          {onViewDetail && (
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => onViewDetail(cod_liquidacion)}
              size="small"
            >
              Ver
            </Button>
          )}
          {onViewPDF && (
            <Button 
              type="primary" 
              icon={<FilePdfOutlined />} 
              onClick={() => onViewPDF(cod_liquidacion)}
              size="small"
            >
              PDF
            </Button>
          )}
        </div>
      }
    >
      {/* Monto líquido destacado */}
      <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-4">
        <Text type="secondary" className="text-sm">Líquido a Pagar</Text>
        <Title 
          level={2} 
          style={{ 
            color: "#3b82f6", 
            margin: "8px 0 0 0",
            fontWeight: 700 
          }}
        >
          {formatCurrency(monto_liquido)}
        </Title>
      </div>

      {/* Desglose */}
      <Row gutter={16}>
        <Col span={12}>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <ArrowUpOutlined style={{ color: "#10b981", fontSize: "1.25rem" }} />
            <div>
              <Text type="secondary" className="text-xs block">Total Haberes</Text>
              <Text strong style={{ color: "#10b981" }}>
                {formatCurrency(total_haberes)}
              </Text>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
            <ArrowDownOutlined style={{ color: "#ef4444", fontSize: "1.25rem" }} />
            <div>
              <Text type="secondary" className="text-xs block">Total Descuentos</Text>
              <Text strong style={{ color: "#ef4444" }}>
                {formatCurrency(total_descuentos)}
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}

