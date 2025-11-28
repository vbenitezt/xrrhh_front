import { Card, Statistic, Typography, Skeleton } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Text } = Typography;

/**
 * Tarjeta de KPI con icono, valor y tendencia opcional
 */
export default function KPICard({
  icon,
  title,
  value,
  suffix,
  prefix,
  trend,
  trendType = "up", // 'up' | 'down' | 'neutral'
  color = "#1890ff",
  loading = false,
  precision = 0,
  formatter,
  className = "",
  onClick,
  size = "default", // 'small' | 'default' | 'large'
}) {
  const sizeStyles = {
    small: { padding: "12px", minHeight: "100px" },
    default: { padding: "20px", minHeight: "140px" },
    large: { padding: "28px", minHeight: "180px" },
  };

  const iconSizes = {
    small: "1.5rem",
    default: "2rem",
    large: "2.5rem",
  };

  const titleLevels = {
    small: 5,
    default: 4,
    large: 3,
  };

  if (loading) {
    return (
      <Card style={sizeStyles[size]} className={className}>
        <Skeleton active paragraph={{ rows: 2 }} />
      </Card>
    );
  }

  return (
    <Card
      style={{ 
        ...sizeStyles[size],
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
      }}
      className={`hover:shadow-lg ${className}`}
      onClick={onClick}
      hoverable={!!onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col flex-1">
          {icon && (
            <div 
              className="mb-2"
              style={{ fontSize: iconSizes[size], color }}
            >
              {icon}
            </div>
          )}
          
          <Statistic
            title={<span className="text-gray-500">{title}</span>}
            value={value}
            precision={precision}
            prefix={prefix}
            suffix={suffix}
            formatter={formatter}
            valueStyle={{ 
              color: color,
              fontSize: size === "small" ? "1.25rem" : size === "large" ? "2rem" : "1.5rem",
              fontWeight: 600,
            }}
          />
          
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trendType === "up" && (
                <ArrowUpOutlined style={{ color: "#10b981", fontSize: "0.875rem" }} />
              )}
              {trendType === "down" && (
                <ArrowDownOutlined style={{ color: "#ef4444", fontSize: "0.875rem" }} />
              )}
              <Text 
                type={trendType === "up" ? "success" : trendType === "down" ? "danger" : "secondary"}
                style={{ fontSize: "0.875rem" }}
              >
                {trend}
              </Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

