import { useState, useEffect } from "react";
import { 
  Drawer, 
  Form, 
  DatePicker, 
  Input, 
  Button, 
  Typography, 
  Tag, 
  Spin,
  message 
} from "antd";
import { 
  CalendarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  SendOutlined
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

import { useCalcularDiasVacaciones, useSolicitarVacaciones } from "../../../services/dashboard";

const { Text } = Typography;
const { TextArea } = Input;

/**
 * Drawer móvil para solicitar vacaciones
 */
export default function VacationRequestDrawer({
  open,
  onClose,
  vacacionesData,
}) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaTermino, setFechaTermino] = useState(null);

  // Mutations
  const calcularDias = useCalcularDiasVacaciones();
  const solicitarVacaciones = useSolicitarVacaciones();

  // Configuración
  const config = vacacionesData?.solicitud_config || {};
  const diasDisponibles = vacacionesData?.resumen?.dias_disponibles || 0;

  // Limpiar fecha término si fecha inicio cambia y queda inválida
  useEffect(() => {
    if (fechaInicio && fechaTermino && fechaTermino.isBefore(fechaInicio)) {
      setFechaTermino(null);
      form.setFieldValue("fecha_termino", null);
      setPreview(null);
    }
  }, [fechaInicio]);

  // Calcular días al cambiar fechas
  useEffect(() => {
    if (fechaInicio && fechaTermino && fechaTermino.isAfter(fechaInicio)) {
      calcularDias.mutate(
        { 
          fecha_inicio: fechaInicio.format("YYYY-MM-DD"), 
          fecha_termino: fechaTermino.format("YYYY-MM-DD") 
        },
        {
          onSuccess: (data) => setPreview(data),
          onError: () => setPreview(null),
        }
      );
    } else {
      setPreview(null);
    }
  }, [fechaInicio, fechaTermino]);

  // Enviar solicitud
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const result = await solicitarVacaciones.mutateAsync({
        fecha_inicio: fechaInicio.format("YYYY-MM-DD"),
        fecha_termino: fechaTermino.format("YYYY-MM-DD"),
        descripcion: values.descripcion || "",
      });

      if (result.success) {
        message.success("¡Solicitud enviada!");
        queryClient.invalidateQueries({ queryKey: ["dashboard-empleado"] });
        handleClose();
      } else {
        result.errores?.forEach(error => message.error(error));
      }
    } catch (error) {
      message.error("Error al enviar");
    }
  };

  // Limpiar y cerrar
  const handleClose = () => {
    form.resetFields();
    setPreview(null);
    setFechaInicio(null);
    setFechaTermino(null);
    onClose();
  };

  // Deshabilitar fechas pasadas
  const disabledDate = (current) => {
    const today = dayjs().startOf("day");
    const minDate = config.fecha_minima ? dayjs(config.fecha_minima) : today;
    return current && current < minDate;
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined style={{ color: "#10b981" }} />
          <span>Solicitar Vacaciones</span>
        </div>
      }
      placement="bottom"
      height="auto"
      open={open}
      onClose={handleClose}
      styles={{ body: { paddingBottom: 80 } }}
    >
      <Form form={form} layout="vertical">
        {/* Días disponibles */}
        <div className="mobile-info-banner mb-4">
          <Text>Tienes <strong>{diasDisponibles} días</strong> disponibles</Text>
        </div>

        {/* Fecha inicio */}
        <Form.Item
          name="fecha_inicio"
          label="Desde"
          rules={[{ required: true, message: "Requerido" }]}
        >
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            placeholder="Selecciona fecha"
            disabledDate={disabledDate}
            onChange={setFechaInicio}
            size="large"
            inputReadOnly
          />
        </Form.Item>

        {/* Fecha término */}
        <Form.Item
          name="fecha_termino"
          label="Hasta"
          rules={[{ required: true, message: "Requerido" }]}
        >
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            placeholder={fechaInicio ? "Selecciona fecha" : "Primero selecciona fecha inicio"}
            disabled={!fechaInicio}
            defaultPickerValue={fechaInicio || undefined}
            disabledDate={(current) => {
              if (!fechaInicio) return true;
              // No permitir el mismo día ni días anteriores (debe ser posterior)
              return current && !current.isAfter(fechaInicio, 'day');
            }}
            onChange={setFechaTermino}
            size="large"
            inputReadOnly
          />
        </Form.Item>

        {/* Preview */}
        {calcularDias.isPending && (
          <div className="text-center py-3">
            <Spin size="small" />
            <Text type="secondary" className="ml-2 text-sm">Calculando...</Text>
          </div>
        )}

        {preview && (
          <div className={`mobile-preview-card mb-4 ${preview.es_valido ? 'valid' : 'invalid'}`}>
            <div className="flex justify-between items-center mb-2">
              <Text strong className="text-sm">Vista Previa</Text>
              <Tag color={preview.es_valido ? "success" : "error"} className="m-0">
                {preview.es_valido ? <><CheckCircleOutlined /> OK</> : <><CloseCircleOutlined /> Sin saldo</>}
              </Tag>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <Text type="secondary">Días hábiles:</Text>
                <Text strong className="ml-1">{preview.dias_habiles}</Text>
              </div>
              <div>
                <Text type="secondary">Saldo restante:</Text>
                <Text strong className="ml-1" style={{ color: preview.saldo_restante >= 0 ? "#10b981" : "#ef4444" }}>
                  {preview.saldo_restante}
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Motivo */}
        <Form.Item name="descripcion" label="Motivo (opcional)">
          <TextArea
            placeholder="Ej: Vacaciones de verano"
            rows={2}
            maxLength={100}
          />
        </Form.Item>

        {/* Botón enviar */}
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSubmit}
          loading={solicitarVacaciones.isPending}
          disabled={!preview?.es_valido}
          block
          size="large"
          style={{ backgroundColor: "#10b981", borderColor: "#10b981" }}
        >
          Enviar Solicitud
        </Button>
      </Form>

      <style jsx>{`
        .mobile-info-banner {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          text-align: center;
        }
        .mobile-preview-card {
          padding: 12px;
          border-radius: 12px;
          border: 1px solid;
        }
        .mobile-preview-card.valid {
          background: #f0fdf4;
          border-color: #86efac;
        }
        .mobile-preview-card.invalid {
          background: #fef2f2;
          border-color: #fecaca;
        }
      `}</style>
    </Drawer>
  );
}

