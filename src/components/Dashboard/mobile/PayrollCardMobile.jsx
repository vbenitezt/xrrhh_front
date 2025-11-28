import { Typography, Tag } from "antd";
import { 
  DollarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  RightOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

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
 * Card de liquidación compacto para móvil
 */
export default function PayrollCardMobile({
  liquidacion,
  loading = false,
  onPress,
}) {
  if (loading) {
    return (
      <div className="mobile-card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!liquidacion) {
    return (
      <div className="mobile-card" onClick={onPress}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="mobile-icon-circle bg-blue-100">
              <DollarOutlined className="text-blue-500 text-lg" />
            </div>
            <div>
              <Text className="mobile-card-title">Última Liquidación</Text>
              <Text type="secondary" className="text-sm block">
                Sin liquidaciones
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { fecha, monto_liquido, total_haberes, total_descuentos } = liquidacion;

  return (
    <div className="mobile-card" onClick={onPress}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="mobile-icon-circle bg-blue-100">
            <DollarOutlined className="text-blue-500 text-lg" />
          </div>
          <div>
            <Text className="mobile-card-title">Última Liquidación</Text>
            <Tag color="blue" className="m-0 mt-1">
              {dayjs(fecha).format("MMM YYYY")}
            </Tag>
          </div>
        </div>
        <RightOutlined className="text-gray-400" />
      </div>

      {/* Monto principal */}
      <div className="text-center py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-3">
        <Text type="secondary" className="text-xs">Líquido a Pagar</Text>
        <div className="text-2xl font-bold text-blue-600">
          {formatCurrency(monto_liquido)}
        </div>
      </div>

      {/* Desglose compacto */}
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpOutlined className="text-green-500 text-xs" />
          <Text className="text-xs text-green-600">
            {formatCurrency(total_haberes)}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownOutlined className="text-red-500 text-xs" />
          <Text className="text-xs text-red-500">
            {formatCurrency(total_descuentos)}
          </Text>
        </div>
      </div>
    </div>
  );
}


