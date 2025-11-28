import { useState, useEffect } from "react";
import { 
  Modal, 
  Form, 
  DatePicker, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Tag, 
  Spin,
  Alert,
  Divider,
  message 
} from "antd";
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  SendOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { useCalcularDiasVacaciones, useSolicitarVacaciones } from "../../services/dashboard";

const { Text, Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

/**
 * Modal para solicitar vacaciones con preview en tiempo real
 */
export default function VacationRequestModal({
  open,
  onClose,
  vacacionesData,
}) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);
  const [fechas, setFechas] = useState(null);

  // Mutations
  const calcularDias = useCalcularDiasVacaciones();
  const solicitarVacaciones = useSolicitarVacaciones();

  // Configuración desde el backend
  const config = vacacionesData?.solicitud_config || {};
  const diasDisponibles = vacacionesData?.resumen?.dias_disponibles || 0;

  // Calcular días al cambiar fechas
  useEffect(() => {
    if (fechas && fechas[0] && fechas[1]) {
      const fecha_inicio = fechas[0];
      const fecha_termino = fechas[1];
      
      // Verificar que la fecha término sea posterior a la fecha inicio
      if (fecha_termino.isAfter(fecha_inicio, 'day')) {
        calcularDias.mutate(
          { 
            fecha_inicio: fecha_inicio.format("YYYY-MM-DD"), 
            fecha_termino: fecha_termino.format("YYYY-MM-DD") 
          },
          {
            onSuccess: (data) => {
              setPreview(data);
            },
            onError: () => {
              setPreview(null);
            },
          }
        );
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [fechas]);

  // Enviar solicitud
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const fecha_inicio = values.fechas[0].format("YYYY-MM-DD");
      const fecha_termino = values.fechas[1].format("YYYY-MM-DD");
      
      const result = await solicitarVacaciones.mutateAsync({
        fecha_inicio,
        fecha_termino,
        descripcion: values.descripcion || "",
      });

      if (result.success) {
        message.success(result.mensaje || "¡Solicitud enviada correctamente!");
        queryClient.invalidateQueries({ queryKey: ["dashboard-empleado"] });
        queryClient.invalidateQueries({ queryKey: ["mis-vacaciones"] });
        handleClose();
      } else {
        // Mostrar errores del backend
        if (result.errores && result.errores.length > 0) {
          result.errores.forEach(error => message.error(error));
        }
        if (result.advertencias && result.advertencias.length > 0) {
          result.advertencias.forEach(adv => message.warning(adv));
        }
      }
    } catch (error) {
      message.error("Error al enviar la solicitud");
    }
  };

  // Limpiar y cerrar
  const handleClose = () => {
    form.resetFields();
    setPreview(null);
    setFechas(null);
    onClose();
  };

  // Deshabilitar fechas pasadas y según config
  const disabledDate = (current) => {
    const today = dayjs().startOf("day");
    const minDate = config.fecha_minima ? dayjs(config.fecha_minima) : today;
    return current && current < minDate;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined style={{ color: "#10b981" }} />
          <span>Solicitar Vacaciones</span>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* Info de días disponibles */}
        <Alert
          message={
            <span>
              Tienes <strong>{diasDisponibles} días</strong> de vacaciones disponibles
            </span>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="mb-4"
        />

        {/* Selector de fechas */}
        <Form.Item
          name="fechas"
          label="Período de vacaciones"
          rules={[{ required: true, message: "Selecciona las fechas" }]}
        >
          <RangePicker
            className="w-full"
            format="DD/MM/YYYY"
            placeholder={["Fecha inicio", "Fecha término"]}
            disabledDate={disabledDate}
            onChange={(dates) => setFechas(dates)}
            size="large"
          />
        </Form.Item>

        {/* Preview de días */}
        {calcularDias.isPending && (
          <div className="text-center py-4">
            <Spin size="small" />
            <Text type="secondary" className="ml-2">Calculando días...</Text>
          </div>
        )}

        {preview && (
          <Card 
            size="small" 
            className={`mb-4 ${preview.es_valido ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <Text strong>📊 Vista Previa</Text>
              <Tag color={preview.es_valido ? "success" : "error"}>
                {preview.es_valido ? (
                  <><CheckCircleOutlined /> Válido</>
                ) : (
                  <><CloseCircleOutlined /> Sin saldo</>
                )}
              </Tag>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <Text type="secondary">Días hábiles:</Text>
                <Text strong className="ml-2">{preview.dias_habiles}</Text>
              </div>
              <div>
                <Text type="secondary">Días calendario:</Text>
                <Text className="ml-2">{preview.dias_totales}</Text>
              </div>
              <div>
                <Text type="secondary">Días inhábiles:</Text>
                <Text className="ml-2">{preview.dias_inhabiles}</Text>
              </div>
              <div>
                <Text type="secondary">Saldo restante:</Text>
                <Text 
                  strong 
                  className="ml-2"
                  style={{ color: preview.saldo_restante >= 0 ? "#10b981" : "#ef4444" }}
                >
                  {preview.saldo_restante} días
                </Text>
              </div>
            </div>
          </Card>
        )}

        {/* Motivo (opcional) */}
        <Form.Item
          name="descripcion"
          label="Motivo (opcional)"
        >
          <TextArea
            placeholder="Ej: Vacaciones de verano, viaje familiar..."
            rows={2}
            maxLength={200}
            showCount
          />
        </Form.Item>

        {/* Recomendación de anticipación */}
        {config.dias_anticipacion_recomendados && (
          <Text type="secondary" className="text-xs block mb-4">
            💡 Se recomienda solicitar con al menos {config.dias_anticipacion_recomendados} días de anticipación
          </Text>
        )}

        <Divider className="my-3" />

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmit}
            loading={solicitarVacaciones.isPending}
            disabled={!preview?.es_valido}
            style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
          >
            Enviar Solicitud
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

