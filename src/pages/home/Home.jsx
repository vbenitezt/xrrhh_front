import { Typography, Card, Row, Col } from "antd";
import { 
  RocketOutlined, 
  ApiOutlined, 
  LayoutOutlined,
  ThunderboltOutlined 
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="p-6">
      <Title level={2}>¡Bienvenido a ruiBernate! 🚀</Title>
      
      <Paragraph className="text-lg mb-6">
        Esta es una aplicación construida con <strong>ruiBernate</strong>, 
        una librería de componentes React para aplicaciones ERP.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <RocketOutlined style={{ fontSize: '2rem', color: '#1890ff' }} />
            <Title level={4}>Listo para usar</Title>
            <Paragraph>
              Tu aplicación ya está configurada con login, layout y rutas dinámicas.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <ApiOutlined style={{ fontSize: '2rem', color: '#52c41a' }} />
            <Title level={4}>Rutas dinámicas</Title>
            <Paragraph>
              Los menús se generan automáticamente desde tu API backend.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <LayoutOutlined style={{ fontSize: '2rem', color: '#722ed1' }} />
            <Title level={4}>Componentes listos</Title>
            <Paragraph>
              GenericMaster y GenericMasterDetail para CRUD rápido.
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <ThunderboltOutlined style={{ fontSize: '2rem', color: '#fa8c16' }} />
            <Title level={4}>Desarrollo rápido</Title>
            <Paragraph>
              Enfócate en tu lógica de negocio, no en la infraestructura.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Card className="mt-6" title="Próximos pasos">
        <ol className="list-decimal list-inside space-y-2">
          <li>Configura tu archivo <code>.env</code> con la URL de tu API</li>
          <li>Personaliza <code>src/config/config.js</code> con el nombre de tu app</li>
          <li>Agrega tus componentes en <code>src/pages</code></li>
          <li>Registra tus componentes en <code>src/utils/routeMapper.js</code></li>
          <li>Configura tus rutas en el backend API</li>
          <li>¡Empieza a desarrollar!</li>
        </ol>
      </Card>

      <Card className="mt-6" title="Recursos útiles">
        <ul className="space-y-2">
          <li>
            📚 <a href="https://ruibernate.xsolution.cl/docs" target="_blank" rel="noopener noreferrer">
              Documentación de ruiBernate
            </a>
          </li>
          <li>
            🐛 <a href="https://github.com/xsolution/ruibernate/issues" target="_blank" rel="noopener noreferrer">
              Reportar problemas
            </a>
          </li>
          <li>
            💬 <a href="https://github.com/xsolution/ruibernate/discussions" target="_blank" rel="noopener noreferrer">
              Comunidad y soporte
            </a>
          </li>
        </ul>
      </Card>
    </div>
  );
}

