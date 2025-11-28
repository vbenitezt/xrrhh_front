import { Card, List, Avatar, Tag, Typography, Empty, Skeleton } from "antd";
import { 
  UserAddOutlined, 
  UserOutlined,
  TeamOutlined,
  IdcardOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title } = Typography;

/**
 * Tarjeta de nuevos ingresos para administradores
 */
export default function NewEmployeesCard({
  empleados = [],
  loading = false,
  maxItems = 5,
  className = "",
}) {
  if (loading) {
    return (
      <Card 
        title={
          <span className="flex items-center gap-2">
            <UserAddOutlined style={{ color: "#10b981" }} />
            Nuevos Ingresos
          </span>
        }
        className={className}
      >
        <Skeleton active avatar paragraph={{ rows: 2 }} />
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </Card>
    );
  }

  const displayEmpleados = empleados.slice(0, maxItems);

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <UserAddOutlined style={{ color: "#10b981" }} />
            Nuevos Ingresos
          </span>
          {empleados.length > 0 && (
            <Tag color="success">
              +{empleados.length} este mes
            </Tag>
          )}
        </div>
      }
      className={className}
      styles={{ body: { padding: "12px" } }}
    >
      {displayEmpleados.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No hay ingresos recientes"
        />
      ) : (
        <List
          dataSource={displayEmpleados}
          renderItem={(empleado) => (
            <List.Item
              className="rounded-lg mb-2 hover:bg-green-50 transition-all border-l-4 border-green-400"
              style={{ padding: "12px 16px" }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    style={{ 
                      backgroundColor: "#34d399",
                      boxShadow: "0 0 0 3px rgba(52, 211, 153, 0.2)"
                    }}
                    icon={<UserOutlined />}
                  />
                }
                title={
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text strong>{empleado.nombre}</Text>
                    <Tag color="green" style={{ marginRight: 0 }}>
                      Nuevo
                    </Tag>
                  </div>
                }
                description={
                  <div className="flex flex-col gap-1">
                    {empleado.cargo && (
                      <div className="flex items-center gap-1">
                        <IdcardOutlined style={{ color: "#6b7280" }} />
                        <Text type="secondary" className="text-sm">
                          {empleado.cargo}
                        </Text>
                      </div>
                    )}
                    {empleado.departamento && (
                      <div className="flex items-center gap-1">
                        <TeamOutlined style={{ color: "#6b7280" }} />
                        <Text type="secondary" className="text-sm">
                          {empleado.departamento}
                        </Text>
                      </div>
                    )}
                    <Text type="secondary" className="text-xs">
                      📅 Ingresó el {dayjs(empleado.fecha_ingreso).format("DD/MM/YYYY")}
                      {empleado.dias_en_empresa && (
                        <span className="ml-1">
                          ({empleado.dias_en_empresa} días en la empresa)
                        </span>
                      )}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}

