import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  Layout,
  Card,
  Button,
  Space,
  Typography,
  Tooltip,
  Divider,
  Collapse,
  Tag,
  Input,
  Select,
  Row,
  Col,
  message,
  Modal,
  Dropdown,
  Popover,
  ColorPicker,
  Drawer,
  List,
  Empty,
  Spin,
} from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
  EyeOutlined,
  FileTextOutlined,
  DragOutlined,
  FontSizeOutlined,
  BgColorsOutlined,
  TableOutlined,
  PictureOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  CopyOutlined,
  ScissorOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  FolderOpenOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { 
  useVariablesContrato, 
  useGuardarPlantilla,
  useTiposDocumento,
  usePlantillas,
  useObtenerPlantilla,
} from "../../services/contratos";
import PreviewContrato from "./PreviewContrato";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// Estilos del editor
const editorStyles = `
  .editor-content {
    min-height: 800px;
    padding: 60px 80px;
    background: white;
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.6;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    outline: none;
  }
  
  .editor-content:focus {
    outline: 2px solid #8b5cf6;
    outline-offset: -2px;
  }
  
  .editor-content h1 {
    font-size: 18pt;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .editor-content h2 {
    font-size: 14pt;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .editor-content p {
    margin-bottom: 12px;
    text-align: justify;
  }
  
  .variable-tag {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
    cursor: default;
    user-select: none;
    margin: 0 2px;
    vertical-align: baseline;
  }
  
  .variable-tag:hover {
    filter: brightness(1.1);
  }
  
  .variable-tag.required {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  
  .draggable-variable {
    cursor: grab;
    transition: all 0.2s;
  }
  
  .draggable-variable:active {
    cursor: grabbing;
  }
  
  .draggable-variable.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }
  
  .editor-content.drag-over {
    background: linear-gradient(to bottom, rgba(139, 92, 246, 0.05), rgba(139, 92, 246, 0.1));
    outline: 2px dashed #8b5cf6 !important;
    outline-offset: -4px;
  }
  
  /* Indicador de inserción durante drag */
  .drop-caret {
    display: inline-block;
    width: 2px;
    height: 1.2em;
    background: #8b5cf6;
    animation: caret-blink 0.8s infinite;
    vertical-align: text-bottom;
    margin: 0 1px;
    border-radius: 1px;
    box-shadow: 0 0 4px #8b5cf6, 0 0 8px rgba(139, 92, 246, 0.5);
  }
  
  @keyframes caret-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  
  /* Preview de variable durante drag */
  .drop-preview {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 11px;
    opacity: 0.7;
    border: 2px dashed white;
    animation: pulse-preview 1s infinite;
  }
  
  @keyframes pulse-preview {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @media print {
    .editor-content {
      padding: 0;
      box-shadow: none;
    }
    .variable-tag {
      background: #e0e0e0 !important;
      color: #333 !important;
      border: 1px solid #999;
    }
  }
`;

/**
 * Editor Visual de Plantillas de Contratos
 * Permite editar documentos como Word y arrastrar variables
 */
export default function EditorPlantilla() {
  const editorRef = useRef(null);
  const [content, setContent] = useState(getDefaultTemplate());
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [plantillaInfo, setPlantillaInfo] = useState({
    nombre: "Nueva Plantilla",
    tipo: null,        // cod_tipo_documento_laboral
    descripcion: "",   // descripción opcional
  });
  const [fontSize, setFontSize] = useState("12pt");
  const [savedContent, setSavedContent] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [plantillaActualId, setPlantillaActualId] = useState(null);
  const [searchVariable, setSearchVariable] = useState("");

  // ==========================================
  // HOOKS DEL BACKEND
  // ==========================================
  const { data: variablesData, isLoading: loadingVariables, isError: errorVariables } = useVariablesContrato();
  const { data: tiposData } = useTiposDocumento();
  const { data: plantillasData, isLoading: loadingPlantillas } = usePlantillas(plantillaInfo.tipo);
  const guardarPlantilla = useGuardarPlantilla();
  const obtenerPlantilla = useObtenerPlantilla();

  // Datos del backend
  const categorias = variablesData?.categorias || [];
  const tiposDocumento = tiposData?.tipos || [];
  const plantillas = plantillasData?.data || plantillasData || [];

  // Cargar plantilla en el editor
  const handleCargarPlantilla = async (plantillaResumen) => {
    const id = plantillaResumen.id_plantilla || plantillaResumen.cod_plantilla;
    
    try {
      // Llamar al endpoint para obtener el detalle completo
      const plantilla = await obtenerPlantilla.mutateAsync(id);
      console.log("Plantilla cargada:", plantilla); // DEBUG
      
      setPlantillaActualId(id);
      setPlantillaInfo({
        nombre: plantilla.nombre_plantilla || plantilla.nombre || "Sin nombre",
        tipo: plantilla.cod_tipo_documento_laboral || plantilla.tipo,
        descripcion: plantilla.descripcion || "",
      });
      
      // Cargar contenido en el editor
      const contenido = plantilla.mjml_base || plantilla.contenido_html || "";
      
      if (editorRef.current) {
        editorRef.current.innerHTML = contenido;
      }
      setContent(contenido);
      setSavedContent(contenido);
      setDrawerVisible(false);
      message.success(`Plantilla "${plantilla.nombre_plantilla || plantilla.nombre}" cargada`);
    } catch (error) {
      console.error("Error al cargar plantilla:", error);
      message.error("Error al cargar la plantilla");
    }
  };

  // Nueva plantilla
  const handleNuevaPlantilla = () => {
    setPlantillaActualId(null);
    setPlantillaInfo({
      nombre: "Nueva Plantilla",
      tipo: null,
      descripcion: "",
    });
    const defaultContent = getDefaultTemplate();
    if (editorRef.current) {
      editorRef.current.innerHTML = defaultContent;
    }
    setContent(defaultContent);
    setSavedContent("");
    setDrawerVisible(false);
    message.info("Nueva plantilla creada");
  };

  // Inyectar estilos
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = editorStyles;
    document.head.appendChild(styleEl);
    return () => styleEl.remove();
  }, []);

  // Ejecutar comando de formato
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  // Insertar variable en la posición del cursor
  const insertVariable = useCallback((variable) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) {
      editorRef.current?.focus();
      return;
    }

    const range = selection.getRangeAt(0);
    
    // Crear el tag de variable
    const varSpan = document.createElement("span");
    varSpan.className = `variable-tag ${variable.requerido_legal ? "required" : ""}`;
    varSpan.setAttribute("data-variable", variable.nombre_variable);
    varSpan.setAttribute("contenteditable", "false");
    varSpan.textContent = `{{${variable.nombre_variable}}}`;
    varSpan.title = variable.descripcion;
    
    // Insertar en la posición del cursor
    range.deleteContents();
    range.insertNode(varSpan);
    
    // Mover el cursor después del tag
    range.setStartAfter(varSpan);
    range.setEndAfter(varSpan);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Insertar un espacio después
    const space = document.createTextNode(" ");
    range.insertNode(space);
    range.setStartAfter(space);
    range.setEndAfter(space);
    
    editorRef.current?.focus();
    message.success(`Variable "${variable.nombre_variable}" insertada`);
  }, []);

  // Manejar drag start de variable
  const handleDragStart = (e, variable) => {
    e.stopPropagation();
    setIsDragging(true);
    
    // Usar currentTarget para obtener el div contenedor, no el elemento hijo
    const dragElement = e.currentTarget;
    dragElement.classList.add("dragging");
    
    // Guardar la variable en dataTransfer con un tipo específico
    e.dataTransfer.setData("application/json", JSON.stringify(variable));
    e.dataTransfer.setData("text/plain", `{{${variable.nombre_variable}}}`);
    e.dataTransfer.effectAllowed = "copy";
    
    // Guardar referencia para el dragEnd
    e.dataTransfer.setData("variable-id", variable.nombre_variable);
  };

  // Manejar drag end
  const handleDragEnd = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    // Usar currentTarget para obtener el div contenedor
    e.currentTarget.classList.remove("dragging");
  };

  // Eliminar el caret de inserción anterior
  const removeDropCaret = useCallback(() => {
    const existingCaret = editorRef.current?.querySelector(".drop-caret");
    if (existingCaret) {
      existingCaret.remove();
    }
  }, []);

  // Manejar drag over en el editor - muestra indicador de posición
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    editorRef.current?.classList.add("drag-over");
    
    // Obtener la posición del cursor basada en las coordenadas del mouse
    const range = document.caretRangeFromPoint(e.clientX, e.clientY);
    if (range && editorRef.current?.contains(range.startContainer)) {
      // Eliminar caret anterior
      removeDropCaret();
      
      // Crear indicador de inserción
      const caret = document.createElement("span");
      caret.className = "drop-caret";
      caret.setAttribute("data-drop-caret", "true");
      
      // Insertar el caret en la posición
      try {
        range.insertNode(caret);
      } catch (err) {
        // Si falla, no hacer nada
      }
    }
  };

  // Manejar drag leave
  const handleDragLeave = (e) => {
    // Solo remover si realmente salimos del editor
    if (!editorRef.current?.contains(e.relatedTarget)) {
      editorRef.current?.classList.remove("drag-over");
      removeDropCaret();
    }
  };

  // Manejar drop en el editor
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    editorRef.current?.classList.remove("drag-over");
    setIsDragging(false);
    
    // Remover el caret de inserción
    removeDropCaret();

    try {
      // Intentar obtener los datos JSON primero
      let variableData = null;
      const jsonData = e.dataTransfer.getData("application/json");
      
      if (jsonData) {
        variableData = JSON.parse(jsonData);
      } else {
        // Fallback a text/plain
        const textData = e.dataTransfer.getData("text/plain");
        if (textData && textData.startsWith("{")) {
          variableData = JSON.parse(textData);
        }
      }
      
      if (!variableData || !variableData.nombre_variable) {
        console.error("Datos de variable inválidos:", variableData);
        return;
      }
      
      // Obtener posición del drop
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        insertVariable(variableData);
      }
    } catch (error) {
      console.error("Error al procesar drop:", error);
      message.error("Error al insertar la variable");
    }
  };

  // Extraer variables del contenido HTML
  const extractVariables = (html) => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = {};
    let match;
    while ((match = regex.exec(html)) !== null) {
      variables[match[1]] = true;
    }
    return variables;
  };

  // Guardar contenido
  const handleSave = async () => {
    const html = editorRef.current?.innerHTML || "";
    
    // Validaciones
    if (!plantillaInfo.nombre?.trim()) {
      message.error("El nombre de la plantilla es requerido");
      return;
    }
    if (!plantillaInfo.tipo) {
      message.error("Debe seleccionar un tipo de documento");
      return;
    }
    if (!html?.trim()) {
      message.error("El contenido de la plantilla no puede estar vacío");
      return;
    }
    
    setSavedContent(html);
    setContent(html);
    
    // Extraer variables usadas en el documento
    const variablesUsadas = extractVariables(html);
    
    // Llamar al backend para guardar
    try {
      const result = await guardarPlantilla.mutateAsync({
        id: plantillaActualId, // Si existe, actualiza; si no, crea
        nombre_plantilla: plantillaInfo.nombre,
        cod_tipo_documento_laboral: plantillaInfo.tipo,
        descripcion: plantillaInfo.descripcion || null,
        mjml_base: html,
        variables_definidas: variablesUsadas,
      });
      // Si es nueva, guardar el ID devuelto
      if (!plantillaActualId && result?.id_plantilla) {
        setPlantillaActualId(result.id_plantilla);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // Ver preview
  const handlePreview = () => {
    const html = editorRef.current?.innerHTML || "";
    // Convertir variables a formato de preview
    const previewContent = html.replace(
      /<span[^>]*class="variable-tag[^"]*"[^>]*data-variable="([^"]*)"[^>]*>[^<]*<\/span>/g,
      '<span style="background:#e0e0e0;padding:2px 6px;border-radius:3px;font-family:monospace;font-size:11px;">{{$1}}</span>'
    );
    setPreviewHtml(`
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; padding: 40px;">
        ${previewContent}
      </div>
    `);
    setPreviewVisible(true);
  };

  // Insertar tabla
  const insertTable = () => {
    const table = `
      <table style="width:100%;border-collapse:collapse;margin:15px 0;">
        <tr>
          <td style="border:1px solid #ddd;padding:8px;"></td>
          <td style="border:1px solid #ddd;padding:8px;"></td>
        </tr>
        <tr>
          <td style="border:1px solid #ddd;padding:8px;"></td>
          <td style="border:1px solid #ddd;padding:8px;"></td>
        </tr>
      </table>
    `;
    execCommand("insertHTML", table);
  };

  // Barra de herramientas
  const Toolbar = () => (
    <div className="bg-white border-b sticky top-0 z-10 px-4 py-2">
      <Space wrap size="small">
        {/* Formato de texto */}
        <Space.Compact>
          <Tooltip title="Negrita (Ctrl+B)">
            <Button icon={<BoldOutlined />} onClick={() => execCommand("bold")} />
          </Tooltip>
          <Tooltip title="Cursiva (Ctrl+I)">
            <Button icon={<ItalicOutlined />} onClick={() => execCommand("italic")} />
          </Tooltip>
          <Tooltip title="Subrayado (Ctrl+U)">
            <Button icon={<UnderlineOutlined />} onClick={() => execCommand("underline")} />
          </Tooltip>
        </Space.Compact>

        <Divider type="vertical" />

        {/* Tamaño de fuente */}
        <Select
          value={fontSize}
          onChange={(v) => {
            setFontSize(v);
            execCommand("fontSize", v.replace("pt", ""));
          }}
          style={{ width: 90 }}
          options={[
            { value: "10pt", label: "10pt" },
            { value: "11pt", label: "11pt" },
            { value: "12pt", label: "12pt" },
            { value: "14pt", label: "14pt" },
            { value: "16pt", label: "16pt" },
            { value: "18pt", label: "18pt" },
          ]}
        />

        <Divider type="vertical" />

        {/* Alineación */}
        <Space.Compact>
          <Tooltip title="Alinear izquierda">
            <Button icon={<AlignLeftOutlined />} onClick={() => execCommand("justifyLeft")} />
          </Tooltip>
          <Tooltip title="Centrar">
            <Button icon={<AlignCenterOutlined />} onClick={() => execCommand("justifyCenter")} />
          </Tooltip>
          <Tooltip title="Alinear derecha">
            <Button icon={<AlignRightOutlined />} onClick={() => execCommand("justifyRight")} />
          </Tooltip>
        </Space.Compact>

        <Divider type="vertical" />

        {/* Listas */}
        <Space.Compact>
          <Tooltip title="Lista numerada">
            <Button icon={<OrderedListOutlined />} onClick={() => execCommand("insertOrderedList")} />
          </Tooltip>
          <Tooltip title="Lista con viñetas">
            <Button icon={<UnorderedListOutlined />} onClick={() => execCommand("insertUnorderedList")} />
          </Tooltip>
        </Space.Compact>

        <Divider type="vertical" />

        {/* Deshacer/Rehacer */}
        <Space.Compact>
          <Tooltip title="Deshacer (Ctrl+Z)">
            <Button icon={<UndoOutlined />} onClick={() => execCommand("undo")} />
          </Tooltip>
          <Tooltip title="Rehacer (Ctrl+Y)">
            <Button icon={<RedoOutlined />} onClick={() => execCommand("redo")} />
          </Tooltip>
        </Space.Compact>

        <Divider type="vertical" />

        {/* Insertar */}
        <Tooltip title="Insertar tabla">
          <Button icon={<TableOutlined />} onClick={insertTable} />
        </Tooltip>

        <Divider type="vertical" />

        {/* Acciones */}
        <Space>
          <Tooltip title="Vista previa">
            <Button icon={<EyeOutlined />} onClick={handlePreview} />
          </Tooltip>
          <Tooltip title="Pantalla completa">
            <Button 
              icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} 
              onClick={() => setFullscreen(!fullscreen)}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Nueva plantilla">
            <Button icon={<PlusOutlined />} onClick={handleNuevaPlantilla} />
          </Tooltip>
          <Tooltip title="Abrir plantilla">
            <Button icon={<FolderOpenOutlined />} onClick={() => setDrawerVisible(true)} />
          </Tooltip>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={guardarPlantilla.isPending}
          >
            {plantillaActualId ? "Actualizar" : "Guardar"}
          </Button>
        </Space>
      </Space>
    </div>
  );

  // Filtrar variables basado en búsqueda
  const filteredCategorias = useMemo(() => {
    if (!searchVariable.trim()) return categorias;
    
    const searchLower = searchVariable.toLowerCase();
    return categorias
      .map(categoria => ({
        ...categoria,
        variables: categoria.variables.filter(v => 
          v.nombre_variable.toLowerCase().includes(searchLower) ||
          v.descripcion?.toLowerCase().includes(searchLower)
        )
      }))
      .filter(categoria => categoria.variables.length > 0);
  }, [categorias, searchVariable]);

  // Contar total de variables filtradas
  const totalFiltered = useMemo(() => {
    return filteredCategorias.reduce((acc, cat) => acc + cat.variables.length, 0);
  }, [filteredCategorias]);


  return (
    <div className={`h-screen ${fullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FileTextOutlined className="text-2xl text-violet-500" />
          <div>
            <Input
              value={plantillaInfo.nombre}
              onChange={(e) => setPlantillaInfo({ ...plantillaInfo, nombre: e.target.value })}
              placeholder="Nombre de la plantilla *"
              className="text-lg font-semibold"
              style={{ width: 350 }}
              size="large"
            />
            <div className="flex gap-2 mt-1">
              <Select
                value={plantillaInfo.tipo}
                onChange={(v) => setPlantillaInfo({ ...plantillaInfo, tipo: v })}
                size="small"
                style={{ width: 180 }}
                options={tiposDocumento}
                placeholder="Tipo documento *"
              />
              <Input
                value={plantillaInfo.descripcion}
                onChange={(e) => setPlantillaInfo({ ...plantillaInfo, descripcion: e.target.value })}
                size="small"
                style={{ width: 250 }}
                placeholder="Descripción (opcional)"
              />
            </div>
          </div>
        </div>
        <Space>
          <Tooltip title="Información">
            <Popover
              title="Atajos de teclado"
              content={
                <div className="text-sm">
                  <p><kbd>Ctrl</kbd> + <kbd>B</kbd> = Negrita</p>
                  <p><kbd>Ctrl</kbd> + <kbd>I</kbd> = Cursiva</p>
                  <p><kbd>Ctrl</kbd> + <kbd>U</kbd> = Subrayado</p>
                  <p><kbd>Ctrl</kbd> + <kbd>Z</kbd> = Deshacer</p>
                  <p><kbd>Ctrl</kbd> + <kbd>S</kbd> = Guardar</p>
                </div>
              }
            >
              <Button icon={<InfoCircleOutlined />} />
            </Popover>
          </Tooltip>
        </Space>
      </div>

      <Layout className="h-[calc(100%-60px)]">
        {/* Panel de variables */}
        <Sider
          width={320}
          theme="light"
          className="border-r overflow-hidden"
          collapsible
          collapsedWidth={0}
        >
          {/* Contenido del panel de variables */}
          <div className="h-full overflow-auto">
            <div className="p-4">
              <Title level={5} className="flex items-center gap-2 mb-3">
                <DragOutlined />
                Variables Disponibles
              </Title>
              
              {/* Buscador de variables */}
              <Input
                placeholder="Buscar variable..."
                prefix={<SearchOutlined className="text-gray-400" />}
                suffix={
                  searchVariable && (
                    <CloseCircleOutlined 
                      className="text-gray-400 cursor-pointer hover:text-gray-600"
                      onClick={() => setSearchVariable("")}
                    />
                  )
                }
                value={searchVariable}
                onChange={(e) => setSearchVariable(e.target.value)}
                className="mb-3"
              />
              
              {searchVariable && (
                <div className="text-xs text-gray-500 mb-3">
                  {totalFiltered} variable{totalFiltered !== 1 ? 's' : ''} encontrada{totalFiltered !== 1 ? 's' : ''}
                </div>
              )}
              
              <Paragraph type="secondary" className="text-xs mb-4">
                Arrastra o haz doble clic para insertar.
              </Paragraph>

              {loadingVariables ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando variables...
                </div>
              ) : errorVariables ? (
                <div className="text-center py-8 text-red-500">
                  Error al cargar variables.
                </div>
              ) : filteredCategorias.length === 0 ? (
                <Empty 
                  description={`No se encontraron variables con "${searchVariable}"`}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Collapse 
                  defaultActiveKey={searchVariable ? filteredCategorias.map(c => c.nombre) : ["empleador", "trabajador", "contrato"]}
                  size="small"
                  className="bg-transparent"
                >
                  {filteredCategorias.map((categoria) => (
                    <Panel 
                      header={
                        <span className="font-medium text-sm">
                          {categoria.label}
                          <Tag className="ml-2" size="small">
                            {categoria.variables.length}
                          </Tag>
                        </span>
                      }
                      key={categoria.nombre}
                    >
                      <div className="space-y-2">
                        {categoria.variables.map((variable) => (
                          <div
                            key={variable.nombre_variable}
                            id={`var-${variable.nombre_variable}`}
                            className="draggable-variable p-2 bg-gray-50 rounded border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all select-none"
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, variable)}
                            onDragEnd={handleDragEnd}
                            onDoubleClick={() => insertVariable(variable)}
                          >
                            <div className="flex items-center justify-between mb-1 pointer-events-none">
                              <code className="text-xs text-violet-600 font-medium pointer-events-none">
                                {`{{${variable.nombre_variable}}}`}
                              </code>
                              {variable.requerido_legal && (
                                <Tag color="red" className="text-xs pointer-events-none">
                                  Obligatorio
                                </Tag>
                              )}
                            </div>
                            <Text type="secondary" className="text-xs pointer-events-none">
                              {variable.descripcion}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </Panel>
                  ))}
                </Collapse>
              )}
            </div>
          </div>
        </Sider>

        {/* Área del editor */}
        <Content className="bg-gray-100 overflow-hidden flex flex-col">
          <Toolbar />
          
          {/* Editor */}
          <div className="flex-1 overflow-auto p-6">
            <div
              className={`max-w-[21cm] mx-auto transition-all ${isDragging ? "ring-2 ring-violet-400 ring-dashed" : ""}`}
            >
              <div
                ref={editorRef}
                className="editor-content"
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: content }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onKeyDown={(e) => {
                  // Ctrl+S para guardar
                  if (e.ctrlKey && e.key === "s") {
                    e.preventDefault();
                    handleSave();
                  }
                }}
              />
            </div>
          </div>
        </Content>
      </Layout>

      {/* Modal de Preview */}
      <PreviewContrato
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        html={previewHtml}
        titulo="Vista Previa de la Plantilla"
      />

      {/* Drawer de Plantillas */}
      <Drawer
        title={
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <FolderOpenOutlined />
              <span>Plantillas Guardadas</span>
            </div>
            {plantillaInfo.tipo && (
              <Tag color="blue" className="mt-1 w-fit">
                {tiposDocumento.find(t => t.value === plantillaInfo.tipo)?.label || ""}
              </Tag>
            )}
          </div>
        }
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNuevaPlantilla}>
            Nueva
          </Button>
        }
      >
        {!plantillaInfo.tipo ? (
          <Empty 
            description="Seleccione un tipo de documento para ver las plantillas"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : loadingPlantillas || obtenerPlantilla.isPending ? (
          <div className="flex justify-center items-center h-40">
            <Spin tip={obtenerPlantilla.isPending ? "Cargando plantilla..." : "Cargando plantillas..."} />
          </div>
        ) : plantillas.length === 0 ? (
          <Empty 
            description="No hay plantillas guardadas"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={handleNuevaPlantilla}>
              Crear primera plantilla
            </Button>
          </Empty>
        ) : (
          <List
            dataSource={plantillas}
            renderItem={(plantilla) => (
              <List.Item
                className={`cursor-pointer hover:bg-gray-50 rounded transition-colors ${
                  plantillaActualId === (plantilla.id_plantilla || plantilla.cod_plantilla) 
                    ? "bg-violet-50 border-l-4 border-violet-500" 
                    : ""
                }`}
                onClick={() => handleCargarPlantilla(plantilla)}
                actions={[
                  <Button 
                    key="edit"
                    type="text" 
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCargarPlantilla(plantilla);
                    }}
                  />
                ]}
              >
                <List.Item.Meta
                  title={
                    <span className="font-medium">
                      {plantilla.nombre_plantilla || plantilla.nombre || "Sin nombre"}
                    </span>
                  }
                  description={
                    <div className="text-xs text-gray-500">
                      {plantilla.descripcion && (
                        <div className="truncate mb-1">{plantilla.descripcion}</div>
                      )}
                      <div className="flex items-center gap-2">
                        <Tag color="blue" className="text-xs">
                          {tiposDocumento.find(t => t.value === plantilla.cod_tipo_documento_laboral)?.label || "Sin tipo"}
                        </Tag>
                        {plantilla.fecha_creacion && (
                          <span className="text-gray-400">
                            {new Date(plantilla.fecha_creacion).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  );
}

/**
 * Plantilla por defecto para nuevos documentos
 */
function getDefaultTemplate() {
  return `
    <h1>CONTRATO INDIVIDUAL DE TRABAJO</h1>
    <p style="text-align: center;">(Artículos 7, 8 y 10 del Código del Trabajo)</p>
    
    <p>En <span class="variable-tag" data-variable="contrato_lugar_firma" contenteditable="false">{{contrato_lugar_firma}}</span>, a <span class="variable-tag" data-variable="contrato_fecha_firma" contenteditable="false">{{contrato_fecha_firma}}</span>, entre:</p>
    
    <h2>EL EMPLEADOR:</h2>
    <p>
      <strong>Razón Social:</strong> <span class="variable-tag" data-variable="empleador_razon_social" contenteditable="false">{{empleador_razon_social}}</span><br/>
      <strong>RUT:</strong> <span class="variable-tag" data-variable="empleador_rut" contenteditable="false">{{empleador_rut}}</span><br/>
      <strong>Domicilio:</strong> <span class="variable-tag" data-variable="empleador_domicilio_legal" contenteditable="false">{{empleador_domicilio_legal}}</span><br/>
      <strong>Representante Legal:</strong> <span class="variable-tag" data-variable="empleador_representante_legal" contenteditable="false">{{empleador_representante_legal}}</span>
    </p>
    
    <h2>EL TRABAJADOR:</h2>
    <p>
      <strong>Nombre:</strong> <span class="variable-tag" data-variable="trabajador_nombre_completo" contenteditable="false">{{trabajador_nombre_completo}}</span><br/>
      <strong>RUT:</strong> <span class="variable-tag required" data-variable="trabajador_rut" contenteditable="false">{{trabajador_rut}}</span><br/>
      <strong>Nacionalidad:</strong> <span class="variable-tag" data-variable="trabajador_nacionalidad" contenteditable="false">{{trabajador_nacionalidad}}</span><br/>
      <strong>Fecha de Nacimiento:</strong> <span class="variable-tag" data-variable="trabajador_fecha_nacimiento" contenteditable="false">{{trabajador_fecha_nacimiento}}</span><br/>
      <strong>Domicilio:</strong> <span class="variable-tag" data-variable="trabajador_domicilio" contenteditable="false">{{trabajador_domicilio}}</span>
    </p>
    
    <p><strong>Han convenido el siguiente contrato de trabajo:</strong></p>
    
    <p><strong>PRIMERO:</strong> El trabajador se compromete a prestar servicios como <span class="variable-tag" data-variable="contrato_funciones" contenteditable="false">{{contrato_funciones}}</span>, u otras labores similares, en <span class="variable-tag" data-variable="contrato_lugar_prestacion" contenteditable="false">{{contrato_lugar_prestacion}}</span>.</p>
    
    <p><strong>SEGUNDO:</strong> La jornada de trabajo será de <span class="variable-tag" data-variable="jornada_horas_semanales" contenteditable="false">{{jornada_horas_semanales}}</span> horas semanales, distribuidas de <span class="variable-tag" data-variable="jornada_dias_trabajo" contenteditable="false">{{jornada_dias_trabajo}}</span>, en horario de <span class="variable-tag" data-variable="jornada_horario" contenteditable="false">{{jornada_horario}}</span>.</p>
    
    <p><strong>TERCERO:</strong> El empleador se compromete a remunerar los servicios del trabajador con un sueldo mensual de <span class="variable-tag required" data-variable="remuneracion_monto" contenteditable="false">{{remuneracion_monto}}</span>, que será liquidado y pagado <span class="variable-tag" data-variable="remuneracion_periodo_pago" contenteditable="false">{{remuneracion_periodo_pago}}</span>, mediante <span class="variable-tag" data-variable="remuneracion_forma_pago" contenteditable="false">{{remuneracion_forma_pago}}</span>.</p>
    
    <p><strong>CUARTO:</strong> El presente contrato tendrá una duración <strong>INDEFINIDA</strong>, comenzando a regir el <span class="variable-tag" data-variable="contrato_fecha_inicio" contenteditable="false">{{contrato_fecha_inicio}}</span>.</p>
    
    <p style="text-align: center; margin-top: 40px;">El presente contrato se firma en dos ejemplares, quedando uno en poder de cada parte contratante.</p>
    
    <table style="width: 100%; margin-top: 60px; border: none;">
      <tr>
        <td style="width: 45%; text-align: center; border: none; padding-top: 50px; border-top: 1px solid black;">
          <strong><span class="variable-tag" data-variable="empleador_razon_social" contenteditable="false">{{empleador_razon_social}}</span></strong><br/>
          RUT: <span class="variable-tag" data-variable="empleador_rut" contenteditable="false">{{empleador_rut}}</span><br/>
          EMPLEADOR
        </td>
        <td style="width: 10%; border: none;"></td>
        <td style="width: 45%; text-align: center; border: none; padding-top: 50px; border-top: 1px solid black;">
          <strong><span class="variable-tag" data-variable="trabajador_nombre_completo" contenteditable="false">{{trabajador_nombre_completo}}</span></strong><br/>
          RUT: <span class="variable-tag" data-variable="trabajador_rut" contenteditable="false">{{trabajador_rut}}</span><br/>
          TRABAJADOR
        </td>
      </tr>
    </table>
  `;
}

