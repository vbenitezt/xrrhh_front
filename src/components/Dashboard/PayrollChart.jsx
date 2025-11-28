import { Card, Typography, Skeleton, Segmented } from "antd";
import { LineChartOutlined, BarChartOutlined, DollarOutlined } from "@ant-design/icons";
import { Line, Column, DualAxes } from "@ant-design/charts";
import { useState } from "react";

const { Text, Title } = Typography;

/**
 * Formateador de moneda compacta
 */
const formatCompactCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

/**
 * Gráfico de evolución de nómina
 */
export default function PayrollChart({
  data = [],
  loading = false,
  className = "",
}) {
  const [chartType, setChartType] = useState("dual");

  if (loading) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <LineChartOutlined style={{ color: "#3b82f6" }} />
            Evolución de Nómina
          </span>
        }
        className={className}
      >
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <LineChartOutlined style={{ color: "#3b82f6" }} />
            Evolución de Nómina
          </span>
        }
        className={className}
      >
        <div className="text-center py-8">
          <Text type="secondary">No hay datos de nómina</Text>
        </div>
      </Card>
    );
  }

  const lineConfig = {
    data,
    xField: "mes",
    yField: "total",
    smooth: true,
    color: "#3b82f6",
    point: {
      size: 4,
      shape: "circle",
      style: {
        fill: "#fff",
        stroke: "#3b82f6",
        lineWidth: 2,
      },
    },
    area: {
      style: {
        fill: "l(270) 0:#ffffff 0.5:#d1e5ff 1:#3b82f6",
      },
    },
    yAxis: {
      label: {
        formatter: (v) => formatCompactCurrency(v),
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: "Total Nómina",
        value: new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
          minimumFractionDigits: 0,
        }).format(datum.total),
      }),
    },
  };

  const columnConfig = {
    data,
    xField: "mes",
    yField: "total",
    color: "#3b82f6",
    label: {
      position: "top",
      formatter: (datum) => formatCompactCurrency(datum.total),
      style: {
        fill: "#666",
        fontSize: 10,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => formatCompactCurrency(v),
      },
    },
    tooltip: {
      formatter: (datum) => ({
        name: "Total Nómina",
        value: new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
          minimumFractionDigits: 0,
        }).format(datum.total),
      }),
    },
  };

  const dualConfig = {
    data: [data, data],
    xField: "mes",
    yField: ["total", "cantidad"],
    geometryOptions: [
      {
        geometry: "column",
        color: "#3b82f6",
      },
      {
        geometry: "line",
        color: "#10b981",
        lineStyle: {
          lineWidth: 3,
        },
        point: {
          size: 4,
          shape: "circle",
          style: {
            fill: "#fff",
            stroke: "#10b981",
            lineWidth: 2,
          },
        },
      },
    ],
    yAxis: {
      total: {
        label: {
          formatter: (v) => formatCompactCurrency(v),
        },
      },
      cantidad: {
        label: {
          formatter: (v) => `${v} emp.`,
        },
      },
    },
    legend: {
      position: "top",
      itemName: {
        formatter: (text) => (text === "total" ? "Monto Total" : "Empleados"),
      },
    },
    tooltip: {
      formatter: (datum) => {
        if (datum.total !== undefined) {
          return {
            name: "Total Nómina",
            value: new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
              minimumFractionDigits: 0,
            }).format(datum.total),
          };
        }
        return {
          name: "Empleados",
          value: datum.cantidad,
        };
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return <Line {...lineConfig} />;
      case "bar":
        return <Column {...columnConfig} />;
      case "dual":
      default:
        return <DualAxes {...dualConfig} />;
    }
  };

  return (
    <Card 
      title={
        <span className="flex items-center gap-2">
          <DollarOutlined style={{ color: "#3b82f6" }} />
          Evolución de Nómina
        </span>
      }
      extra={
        <Segmented
          size="small"
          value={chartType}
          onChange={setChartType}
          options={[
            { value: "dual", icon: <BarChartOutlined />, label: "Combinado" },
            { value: "line", icon: <LineChartOutlined />, label: "Línea" },
            { value: "bar", icon: <BarChartOutlined />, label: "Barras" },
          ]}
        />
      }
      className={className}
    >
      <div style={{ height: 300 }}>
        {renderChart()}
      </div>
    </Card>
  );
}

