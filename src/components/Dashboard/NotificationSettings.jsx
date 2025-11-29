import { useState } from 'react';
import { Card, Button, Switch, Typography, Space, Alert, message } from 'antd';
import { 
  BellOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  LoadingOutlined 
} from '@ant-design/icons';
import { usePushNotifications } from '@xsolutioncl/ruibernate';
import { useAxios } from '@xsolutioncl/ruibernate';
import config from '@/config/config';

const { Text, Title } = Typography;

/**
 * Componente para configurar notificaciones push
 */
export default function NotificationSettings({ compact = false }) {
  const axios = useAxios();
  const [testLoading, setTestLoading] = useState(false);
  
  const {
    permission,
    isSubscribed,
    isSupported,
    loading,
    error,
    subscribe,
    unsubscribe,
    requestPermission,
    showLocalNotification
  } = usePushNotifications({
    vapidPublicKey: config.pwa?.vapidPublicKey,
    subscribeEndpoint: config.pwa?.pushEndpoint || '/api/push/subscribe',
    unsubscribeEndpoint: config.pwa?.pushUnsubscribeEndpoint || '/api/push/unsubscribe',
  });

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      const result = await unsubscribe(axios);
      if (result) {
        message.success('Notificaciones desactivadas');
      }
    } else {
      const result = await subscribe(axios);
      if (result) {
        message.success('¡Notificaciones activadas!');
        // Mostrar notificación de prueba
        setTimeout(() => {
          showLocalNotification('¡Bienvenido!', {
            body: 'Las notificaciones están activadas correctamente.',
            icon: '/icons/icon-192x192.png'
          });
        }, 1000);
      }
    }
  };

  const handleTestNotification = async () => {
    setTestLoading(true);
    try {
      await showLocalNotification('Notificación de prueba', {
        body: 'Esta es una notificación de prueba local.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png'
      });
      message.success('Notificación enviada');
    } catch (err) {
      message.error('Error al enviar notificación');
    }
    setTestLoading(false);
  };

  // Si no hay soporte para notificaciones
  if (!isSupported) {
    if (compact) return null;
    return (
      <Alert
        message="Notificaciones no soportadas"
        description="Tu navegador no soporta notificaciones push."
        type="warning"
        showIcon
      />
    );
  }

  // Si no hay clave VAPID configurada
  if (!config.pwa?.vapidPublicKey) {
    if (compact) return null;
    return (
      <Alert
        message="Notificaciones no configuradas"
        description="Las notificaciones push no están configuradas en este momento."
        type="info"
        showIcon
      />
    );
  }

  // Versión compacta (solo switch)
  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <Space>
          <BellOutlined className={isSubscribed ? 'text-blue-500' : 'text-gray-400'} />
          <Text>Notificaciones</Text>
        </Space>
        <Switch
          checked={isSubscribed}
          loading={loading}
          onChange={handleToggleNotifications}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      </div>
    );
  }

  // Versión completa (card)
  return (
    <Card 
      className="shadow-sm"
      title={
        <Space>
          <BellOutlined className="text-blue-500" />
          <span>Notificaciones Push</span>
        </Space>
      }
    >
      <Space direction="vertical" className="w-full" size="middle">
        {/* Estado actual */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <Space direction="vertical" size={0}>
            <Text strong>Estado de notificaciones</Text>
            <Text type="secondary" className="text-sm">
              {isSubscribed 
                ? 'Recibirás notificaciones en este dispositivo' 
                : 'Activa las notificaciones para no perderte nada'}
            </Text>
          </Space>
          <Space>
            {isSubscribed ? (
              <CheckCircleOutlined className="text-green-500 text-xl" />
            ) : (
              <CloseCircleOutlined className="text-gray-400 text-xl" />
            )}
            <Switch
              checked={isSubscribed}
              loading={loading}
              onChange={handleToggleNotifications}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </Space>
        </div>

        {/* Permiso del navegador */}
        {permission === 'denied' && (
          <Alert
            message="Notificaciones bloqueadas"
            description="Has bloqueado las notificaciones en tu navegador. Para activarlas, ve a la configuración de tu navegador."
            type="error"
            showIcon
          />
        )}

        {/* Error */}
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
          />
        )}

        {/* Botón de prueba */}
        {isSubscribed && (
          <Button 
            icon={testLoading ? <LoadingOutlined /> : <BellOutlined />}
            onClick={handleTestNotification}
            loading={testLoading}
            block
          >
            Enviar notificación de prueba
          </Button>
        )}

        {/* Botón principal si no está suscrito */}
        {!isSubscribed && permission !== 'denied' && (
          <Button 
            type="primary"
            icon={<BellOutlined />}
            onClick={handleToggleNotifications}
            loading={loading}
            block
            size="large"
          >
            Activar notificaciones
          </Button>
        )}
      </Space>
    </Card>
  );
}

