import { Card, Typography, Skeleton, Tabs } from "antd";
import { PieChartOutlined, TeamOutlined, IdcardOutlined } from "@ant-design/icons";
import { Pie, Column } from "@ant-design/charts";

const { Text, Title } = Typography;

/**
 * Gráfico de distribución por cargo/departamento
 */
export default function DistributionChart({
  distribucion,
  loading = false,
  chartType = "pie", // 'pie' | 'bar'
  className = "",
}) {
  if (loading) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <PieChartOutlined style={{ color: "#8b5cf6" }} />
            Distribución de Personal
          </span>
        }
        className={className}
      >
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!distribucion) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <PieChartOutlined style={{ color: "#8b5cf6" }} />
            Distribución de Personal
          </span>
        }
        className={className}
      >
        <div className="text-center py-8">
          <Text type="secondary">No hay datos de distribución</Text>
        </div>
      </Card>
    );
  }

  const { por_cargo = [], por_departamento = [] } = distribucion;

  // Colores para los gráficos
  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16"
  ];

  const pieConfig = {
    appendPadding: 10,
    angleField: "cantidad",
    colorField: "nombre",
    radius: 0.9,
    innerRadius: 0.6,
    color: colors,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        fill: "#fff",
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
      },
    },
    legend: {
      position: "bottom",
      layout: "horizontal",
    },
    statistic: {
      title: {
        customHtml: () => '<div style="font-size:14px;color:#666">Total</div>',
      },
      content: {
        customHtml: (_, __, datum, data) => {
          const total = data?.reduce((acc, item) => acc + item.cantidad, 0) || 0;
          return `<div style="font-size:24px;font-weight:bold;color:#1f2937">${total}</div>`;
        },
      },
    },
    interactions: [
      { type: "element-active" },
      { type: "pie-statistic-active" },
    ],
  };

  const barConfig = {
    xField: "nombre",
    yField: "cantidad",
    color: (datum, index) => colors[index % colors.length],
    label: {
      position: "top",
      style: {
        fill: "#666",
        fontWeight: "bold",
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
      },
    },
    meta: {
      cantidad: {
        alias: "Empleados",
      },
    },
  };

  const tabItems = [
    {
      key: "cargo",
      label: (
        <span className="flex items-center gap-1">
          <IdcardOutlined />
          Por Cargo
        </span>
      ),
      children: (
        <div style={{ height: 300 }}>
          {chartType === "pie" ? (
            <Pie {...pieConfig} data={por_cargo} />
          ) : (
            <Column {...barConfig} data={por_cargo} />
          )}
        </div>
      ),
    },
    {
      key: "departamento",
      label: (
        <span className="flex items-center gap-1">
          <TeamOutlined />
          Por Departamento
        </span>
      ),
      children: (
        <div style={{ height: 300 }}>
          {chartType === "pie" ? (
            <Pie {...pieConfig} data={por_departamento} />
          ) : (
            <Column {...barConfig} data={por_departamento} />
          )}
        </div>
      ),
    },
  ];

  return (
    <Card 
      title={
        <span className="flex items-center gap-2">
          <PieChartOutlined style={{ color: "#8b5cf6" }} />
          Distribución de Personal
        </span>
      }
      className={className}
    >
      <Tabs items={tabItems} defaultActiveKey="cargo" />
    </Card>
  );
}

