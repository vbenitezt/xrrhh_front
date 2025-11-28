import { Card, Badge, Typography, List, Tag, Empty, Skeleton, Collapse } from "antd";
import { 
  WarningOutlined, 
  FileExclamationOutlined,
  UserDeleteOutlined,
  FormOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;

/**
 * Tarjeta de alertas del sistema para administradores
 */
export default function AlertsCard({
  alertas,
  loading = false,
  className = "",
}) {
  if (loading) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <WarningOutlined style={{ color: "#ef4444" }} />
            Alertas del Sistema
          </span>
        }
        className={className}
      >
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (!alertas) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <WarningOutlined style={{ color: "#ef4444" }} />
            Alertas del Sistema
          </span>
        }
        className={className}
      >
        <Empty description="No hay alertas" />
      </Card>
    );
  }

  const {
    contratos_por_vencer = [],
    ausencias_hoy = 0,
    solicitudes_pendientes = 0,
    total_alertas = 0,
  } = alertas;

  const collapseItems = [];

  // Contratos por vencer
  if (contratos_por_vencer.length > 0) {
    collapseItems.push({
      key: "contratos",
      label: (
        <div className="flex items-center justify-between w-full pr-4">
          <span className="flex items-center gap-2">
            <FileExclamationOutlined style={{ color: "#dc2626" }} />
            <Text strong>Contratos por vencer</Text>
          </span>
          <Badge 
            count={contratos_por_vencer.length} 
            style={{ backgroundColor: "#dc2626" }}
          />
        </div>
      ),
      children: (
        <List
          size="small"
          dataSource={contratos_por_vencer}
          renderItem={(contrato) => (
            <List.Item className="hover:bg-red-50 rounded px-2">
              <List.Item.Meta
                title={contrato.nombre}
                description={
                  <div className="flex items-center gap-2">
                    <Text type="secondary">
                      Vence: {dayjs(contrato.fecha_termino).format("DD/MM/YYYY")}
                    </Text>
                    <Tag color={contrato.dias_restantes <= 7 ? "error" : "warning"}>
                      {contrato.dias_restantes} días
                    </Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ),
    });
  }

  // Ausencias hoy
  if (ausencias_hoy > 0) {
    collapseItems.push({
      key: "ausencias",
      label: (
        <div className="flex items-center justify-between w-full pr-4">
          <span className="flex items-center gap-2">
            <UserDeleteOutlined style={{ color: "#f59e0b" }} />
            <Text strong>Ausencias hoy</Text>
          </span>
          <Badge 
            count={ausencias_hoy} 
            style={{ backgroundColor: "#f59e0b" }}
          />
        </div>
      ),
      children: (
        <div className="p-4 text-center">
          <Title level={3} style={{ color: "#f59e0b", margin: 0 }}>
            {ausencias_hoy}
          </Title>
          <Text type="secondary">empleados ausentes hoy</Text>
        </div>
      ),
    });
  }

  // Solicitudes pendientes
  if (solicitudes_pendientes > 0) {
    collapseItems.push({
      key: "solicitudes",
      label: (
        <div className="flex items-center justify-between w-full pr-4">
          <span className="flex items-center gap-2">
            <FormOutlined style={{ color: "#3b82f6" }} />
            <Text strong>Solicitudes pendientes</Text>
          </span>
          <Badge 
            count={solicitudes_pendientes} 
            style={{ backgroundColor: "#3b82f6" }}
          />
        </div>
      ),
      children: (
        <div className="p-4 text-center">
          <Title level={3} style={{ color: "#3b82f6", margin: 0 }}>
            {solicitudes_pendientes}
          </Title>
          <Text type="secondary">solicitudes de vacaciones pendientes</Text>
        </div>
      ),
    });
  }

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <WarningOutlined style={{ color: total_alertas > 0 ? "#ef4444" : "#10b981" }} />
            Alertas del Sistema
          </span>
          {total_alertas > 0 && (
            <Badge 
              count={total_alertas} 
              style={{ backgroundColor: "#ef4444" }}
            />
          )}
        </div>
      }
      className={className}
      styles={{ body: { padding: collapseItems.length > 0 ? "0" : "24px" } }}
    >
      {collapseItems.length === 0 ? (
        <div className="text-center py-8">
          <ExclamationCircleOutlined 
            style={{ fontSize: "3rem", color: "#10b981" }} 
          />
          <Title level={4} style={{ color: "#10b981", marginTop: 16 }}>
            ¡Todo en orden!
          </Title>
          <Text type="secondary">No hay alertas pendientes</Text>
        </div>
      ) : (
        <Collapse 
          items={collapseItems}
          defaultActiveKey={["contratos"]}
          ghost
          expandIconPosition="end"
        />
      )}
    </Card>
  );
}

