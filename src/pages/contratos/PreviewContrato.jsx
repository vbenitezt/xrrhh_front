import { useState, useRef, useEffect } from "react";
import {
  Modal,
  Button,
  Space,
  Spin,
  Tooltip,
  Dropdown,
  message,
  Select,
  Divider,
  Alert,
} from "antd";
import {
  PrinterOutlined,
  DownloadOutlined,
  ExpandOutlined,
  CompressOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  MailOutlined,
  CopyOutlined,
  UserOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useBuscarEmpleados, useDatosEmpleadoContrato } from "../../services/contratos";

/**
 * Componente de Preview para visualizar contratos generados
 * Muestra el HTML renderizado en un iframe con opciones de zoom, impresión y descarga
 */
export default function PreviewContrato({ 
  visible, 
  onClose, 
  html, 
  loading = false,
  titulo = "Vista Previa del Contrato",
  onDownload,
  onSendEmail,
  mostrarSelectorEmpleado = true,
}) {
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [htmlConDatos, setHtmlConDatos] = useState(html);
  const [searching, setSearching] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const iframeRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Hooks
  const buscarEmpleados = useBuscarEmpleados();
  const obtenerDatosEmpleado = useDatosEmpleadoContrato();

  // Actualizar HTML cuando cambie el prop
  useEffect(() => {
    if (!empleadoSeleccionado) {
      setHtmlConDatos(html);
    }
  }, [html, empleadoSeleccionado]);

  // Limpiar debounce al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Buscar empleados con debounce (500ms)
  const doBuscarEmpleados = async (value) => {
    if (!value || value.length < 2) {
      return;
    }
    
    try {
      const result = await buscarEmpleados.mutateAsync(value);
      console.log("API result:", result);
      
      const empleadosFormateados = (result || []).map(emp => {
        const item = {
          value: String(emp.cod_contrato), // Convertir a string
          label: `${emp.nombre_completo} - ${emp.rut}`,
          cod_contrato: emp.cod_contrato,
        };
        console.log("Item formateado:", item);
        return item;
      });
      
      console.log("Empleados para Select:", empleadosFormateados);
      setEmpleados(empleadosFormateados);
    } catch (error) {
      console.error("Error buscando empleados:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchEmpleados = (value) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (!value || value.length < 2) {
      setSearching(false);
      return;
    }
    
    setSearching(true);
    debounceRef.current = setTimeout(() => doBuscarEmpleados(value), 500);
  };

  // Generar tabla HTML a partir de un array de objetos
  const generarTablaHtml = (array, nombreVariable) => {
    if (!Array.isArray(array) || array.length === 0) {
      return '<p><em>Sin datos</em></p>';
    }
    
    // Obtener las columnas del primer objeto
    const columnas = Object.keys(array[0]).filter(col => !col.includes('_id') && !col.startsWith('cod_'));
    
    // Generar encabezados (convertir snake_case a título)
    const encabezados = columnas.map(col => {
      // Excluir columnas con "formateado" si existe la versión sin formatear
      if (col.endsWith('_formateado')) return null;
      return col
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }).filter(Boolean);
    
    // Filtrar columnas para mostrar (preferir formateadas)
    const columnasAMostrar = columnas.filter(col => {
      if (col.endsWith('_formateado')) return true;
      // Si existe versión formateada, excluir la original
      const tieneFormateada = columnas.includes(col + '_formateado');
      return !tieneFormateada;
    });
    
    let html = `
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
        <thead>
          <tr style="background: #f5f5f5;">
            ${columnasAMostrar.map(col => `
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">
                ${col.replace('_formateado', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${array.map(item => `
            <tr>
              ${columnasAMostrar.map(col => `
                <td style="border: 1px solid #ddd; padding: 8px;">
                  ${item[col] ?? ''}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    return html;
  };

  // Aplanar objeto anidado para obtener todas las variables
  const flattenObject = (obj, prefix = '') => {
    let result = {};
    for (const key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;
      
      if (Array.isArray(value)) {
        // Si es un array, generar tabla HTML
        result[key] = generarTablaHtml(value, key);
        result[newKey] = result[key];
      } else if (value && typeof value === 'object') {
        // Si es un objeto, aplanar recursivamente
        Object.assign(result, flattenObject(value, newKey));
        // También agregar las propiedades directamente sin prefijo
        Object.assign(result, flattenObject(value, ''));
      } else {
        result[newKey] = value;
        // También agregar sin prefijo
        result[key] = value;
      }
    }
    return result;
  };

  // Cargar datos del empleado seleccionado
  const cargarDatosEmpleado = async (codEmpleado, labelEmpleado) => {
    console.log("Cargando datos para empleado:", codEmpleado);
    setCargandoDatos(true);
    
    try {
      const respuesta = await obtenerDatosEmpleado.mutateAsync(codEmpleado);
      console.log("Datos recibidos:", respuesta);
      
      // Aplanar los datos anidados (ej: {datos: {...}, contrato: {...}})
      const datosAplanados = flattenObject(respuesta);
      console.log("Datos aplanados:", datosAplanados);
      
      let htmlReemplazado = html;
      Object.entries(datosAplanados || {}).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
          htmlReemplazado = htmlReemplazado.replace(regex, String(val));
        }
      });
      
      console.log("Variables reemplazadas");
      setHtmlConDatos(htmlReemplazado);
      message.success(`Datos de ${labelEmpleado} cargados`);
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al cargar datos del empleado");
    } finally {
      setCargandoDatos(false);
    }
  };

  // Limpiar selección
  const handleClearEmpleado = () => {
    setEmpleadoSeleccionado(null);
    setHtmlConDatos(html);
  };

  // Manejar zoom
  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  // Manejar impresión
  const handlePrint = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  // Copiar al portapapeles (como HTML)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlConDatos);
      message.success("HTML copiado al portapapeles");
    } catch (error) {
      message.error("Error al copiar");
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Menú de más opciones
  const moreOptionsItems = [
    {
      key: "copy",
      icon: <CopyOutlined />,
      label: "Copiar HTML",
      onClick: handleCopy,
    },
    {
      key: "email",
      icon: <MailOutlined />,
      label: "Enviar por correo",
      onClick: onSendEmail,
      disabled: !onSendEmail,
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center justify-between pr-8">
          <span>{titulo}</span>
          <Space size="small">
            <Tooltip title="Alejar">
              <Button
                icon={<ZoomOutOutlined />}
                size="small"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              />
            </Tooltip>
            <Button size="small" onClick={handleResetZoom}>
              {zoom}%
            </Button>
            <Tooltip title="Acercar">
              <Button
                icon={<ZoomInOutlined />}
                size="small"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              />
            </Tooltip>
          </Space>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={fullscreen ? "100%" : 900}
      style={fullscreen ? { top: 0, padding: 0, maxWidth: "100vw" } : { top: 20 }}
      bodyStyle={{ 
        height: fullscreen ? "calc(100vh - 110px)" : "70vh", 
        padding: 0,
        overflow: "hidden",
        background: "#f5f5f5",
      }}
      footer={
        <div className="flex justify-between items-center">
          <Space>
            <Tooltip title={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
              <Button
                icon={fullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                onClick={toggleFullscreen}
              >
                {fullscreen ? "Salir" : "Expandir"}
              </Button>
            </Tooltip>
            <Dropdown menu={{ items: moreOptionsItems }} placement="topLeft">
              <Button>Más opciones</Button>
            </Dropdown>
          </Space>
          <Space>
            <Button 
              icon={<PrinterOutlined />} 
              onClick={handlePrint}
            >
              Imprimir
            </Button>
            {onDownload && (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={onDownload}
              >
                Descargar PDF
              </Button>
            )}
          </Space>
        </div>
      }
      destroyOnClose
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spin size="large" tip="Generando vista previa..." />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Selector de empleado */}
          {mostrarSelectorEmpleado && (
            <div className="bg-white border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <UserOutlined className="text-gray-400" />
                <span className="text-sm text-gray-600">Probar con empleado:</span>
                <Select
                  showSearch
                  allowClear
                  placeholder="Buscar empleado por nombre o RUT..."
                  style={{ width: 350 }}
                  value={empleadoSeleccionado?.value}
                  onSearch={handleSearchEmpleados}
                  onSelect={(value, option) => {
                    console.log("onSelect disparado - value:", value, "option:", option);
                    // Buscar el empleado en la lista para obtener cod_contrato numérico
                    const emp = empleados.find(e => e.value === value);
                    console.log("Empleado encontrado:", emp);
                    const codContrato = emp?.cod_contrato || parseInt(value);
                    const label = option.children || option.label || emp?.label;
                    
                    setEmpleadoSeleccionado({ value: value, label: label });
                    cargarDatosEmpleado(codContrato, label);
                  }}
                  onClear={() => {
                    console.log("onClear disparado");
                    handleClearEmpleado();
                  }}
                  loading={searching}
                  filterOption={false}
                  notFoundContent={
                    searching ? (
                      <Spin size="small" />
                    ) : empleados.length === 0 ? (
                      <span className="text-gray-400">Escribe al menos 2 caracteres para buscar</span>
                    ) : null
                  }
                >
                  {empleados.map((emp) => (
                    <Select.Option key={emp.value} value={emp.value}>
                      {emp.label}
                    </Select.Option>
                  ))}
                </Select>
                {empleadoSeleccionado?.value && (
                  <Tooltip title="Recargar datos">
                    <Button 
                      icon={<ReloadOutlined />} 
                      size="small"
                      onClick={() => cargarDatosEmpleado(empleadoSeleccionado.value, empleadoSeleccionado.label)}
                      loading={cargandoDatos}
                    />
                  </Tooltip>
                )}
              </div>
              {empleadoSeleccionado?.value && (
                <Alert
                  message={`Vista previa con datos de: ${empleadoSeleccionado.label}`}
                  type="info"
                  showIcon
                  className="mt-2"
                  closable
                  onClose={handleClearEmpleado}
                />
              )}
            </div>
          )}
          
          {/* Área de preview */}
          <div 
            className="flex-1 overflow-auto bg-gray-200 p-4"
            style={{ 
              display: "flex", 
              justifyContent: "center",
            }}
          >
            {cargandoDatos ? (
              <div className="flex items-center justify-center h-full">
                <Spin size="large" tip="Cargando datos del empleado..." />
              </div>
            ) : (
              <div 
                className="bg-white shadow-lg"
                style={{
                  width: "210mm", // A4 width
                  minHeight: "297mm", // A4 height
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                  transition: "transform 0.2s ease",
                }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlConDatos}
                  title="Preview del contrato"
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "297mm",
                    border: "none",
                    background: "white",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

/**
 * Componente simplificado para preview inline (sin modal)
 */
export function PreviewContratoInline({ html, zoom = 100, className = "" }) {
  if (!html) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded ${className}`}>
        <span className="text-gray-400">Sin contenido para mostrar</span>
      </div>
    );
  }

  return (
    <div 
      className={`overflow-auto bg-gray-200 p-4 rounded ${className}`}
      style={{ maxHeight: "500px" }}
    >
      <div 
        className="bg-white shadow-lg mx-auto"
        style={{
          width: "210mm",
          minHeight: "297mm",
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top center",
        }}
      >
        <iframe
          srcDoc={html}
          title="Preview del contrato"
          style={{
            width: "100%",
            height: "100%",
            minHeight: "297mm",
            border: "none",
            background: "white",
          }}
        />
      </div>
    </div>
  );
}
