# PRD: Módulo de Contratos Laborales (MJML → PDF) para Chile — Backend pyBernate

## 1. Resumen Ejecutivo  
Construir un módulo de generación de documentos legales (contratos, anexos, finiquitos, certificados) compatible con la normativa chilena, mediante plantillas MJML, con backend en pyBernate.  

El módulo debe permitir:  
- Capturar los datos necesarios conforme al Código del Trabajo.  
- Definir plantillas con variables.  
- Renderizar MJML → HTML → PDF.  
- Garantizar que los contratos generados cumplen requisitos legales mínimos.  

## 2. Objetivos  
- Automatizar la generación de contratos laborales conforme a la ley chilena.  
- Reducir errores manuales en la redacción.  
- Mantener trazabilidad (versión de plantilla, fecha, quien generó, etc.).  

## 3. Alcance  
### Incluye  
- Gestión de plantillas (MJML + variables + metadatos).  
- Formulario de datos necesarios por tipo de contrato.  
- Render MJML → HTML → PDF usando backend PyBernate.  
- Validación de campos obligatorios conforme normativa.  
- Soporte para diferentes modalidades: contrato indefinido, plazo fijo, por obra/faena; contratos para extranjeros si corresponde.  
- Registro del documento generado (con datos completos).  

### No incluye (por ahora)  
- Firma electrónica.  
- Workflow de aprobación.  
- Editor visual drag & drop.  

## 4. Roles y Permisos  
- **Administrador RRHH** — crea y edita plantillas.  
- **Analista RRHH** — genera contratos / documentos para empleados.  
- **Operador Legal** — revisa cumplimiento normativo (opcional).  

## 5. Datos / Variables obligatorias para contrato laboral en Chile  
Se deben capturar como variables en la plantilla y llenar al generar:  

**Datos del empleador**  
- Nombre o razón social, RUT, domicilio legal, domicilio de la empresa/centro de trabajo, correo electrónico (si aplica).  

**Datos del trabajador**  
- Nombre completo, RUT, nacionalidad, fecha de nacimiento, domicilio, correo (si aplica), fecha de ingreso.  

**Datos del contrato**  
- Lugar y fecha de firma.  
- Tipo de contrato (indefinido / plazo fijo / obra/faena u otro).  
- Fecha de inicio (y término si aplica).  
- Funciones / cargo / descripción del servicio.  
- Lugar de prestación del servicio (dirección o ciudad).  
- Jornada laboral: días de trabajo, horario diario, horas semanales, colación si corresponde.  
- Remuneración: monto, forma de pago, período de pago.  
- Beneficios adicionales o en especie (si hay).  

**Cláusulas adicionales / condiciones especiales** — si aplica: por ejemplo, contrato a plazo, contratos extranjeros, cláusulas de terminación, beneficios, régimen especial, etc.  

## 6. Requerimientos funcionales  

### Gestión de plantillas  
- Crear, editar, duplicar, eliminar plantillas.  
- Definir variables obligatorias (lista de variables del contrato).  
- Asociar metadatos de plantilla (tipo de documento, descripción, versión, modalidad de contrato).  

### Generación de contrato  
- Formulario para llenar todas las variables obligatorias.  
- Validación de campos obligatorios: si falta alguno, impedir generación.  
- Render MJML → HTML → PDF vía backend pyBernate.  
- Producción de PDF listo para firma física o digital.  
- Registro del contrato generado con todos sus datos (empleador, trabajador, tipo contrato, fecha de generación, ruta PDF, datos de variables, etc.).  

### Cumplimiento normativo  
- Las plantillas base deben incluir las cláusulas mínimas requeridas por la ley.  
- El sistema debe verificar que los campos obligatorios estén presentes antes de generar.  
- Soporte para distintas modalidades de contrato (indefinido, plazo fijo, obra/faena, contratos a extranjeros si corresponde).  

## 7. Modelo de Datos (simplificado)  

### Tabla: plantilla_documento  
- id_plantilla (PK)  
- nombre_plantilla  
- tipo_documento (contrato, finiquito, anexo, certificado)  
- modalidad_contrato (indefinido, plazo_fijo, obra_faena, otro)  
- descripcion  
- mjml_base (TEXT)  
- variables_definidas (JSON)  
- version  
- activo (bool)  
- fecha_creacion  
- fecha_modificacion  

### Tabla: documento_generado  
- id_documento (PK)  
- id_plantilla (FK)  
- id_empleado (FK)  
- datos_variables (JSON)  
- mjml_final (TEXT)  
- html_final (TEXT)  
- ruta_pdf (o blob_pdf)  
- tipo_contrato / modalidad  
- fecha_generacion  
- usuario_generador  

## 8. Endpoints / Servicios (Backend pyBernate)  

- GET /templates  
- GET /templates/{id}  
- POST /templates  
- PUT /templates/{id}  
- DELETE /templates/{id}  

- POST /generate-html  → recibe MJML + datos variables → devuelve HTML.  
- POST /generate-pdf   → recibe MJML + datos variables → devuelve PDF.  

- POST /documents  → generar y guardar documento generado.  
- GET /documents/{id}  

## 9. Flujo de Generación de Contrato  

1. Analista / Admin selecciona plantilla de contrato (modalidad).  
2. Completa formulario con datos del empleador + datos del trabajador + datos del contrato (tipo, remuneración, jornada, funciones, etc.).  
3. El sistema valida que todos campos requeridos estén completos.  
4. Render MJML → HTML → muestra preview.  
5. Si todo OK → invoca backend para generar PDF.  
6. Guarda registro en `documento_generado`.  
7. PDF queda disponible para descarga / firma.  

## 10. Criterios de Aceptación / Validación Legal  

- El contrato generado contiene **todas** las cláusulas mínimas exigidas por la ley (identificación de las partes, funciones, remuneración, jornada, tipo/duración, fecha, lugar).  
- No se puede generar contrato si falta algún dato obligatorio.  
- La plantilla permite adaptarse a distintas modalidades de contrato según el tipo de relación laboral.  
- El PDF generado debe ser idéntico al HTML de preview y tener formato legible, imprimible.  

## 11. Supuestos y Reglas de Negocio  

- Los datos del empleado provienen de la base de datos de RRHH (o se ingresan manualmente si no existen).  
- Para contratos de extranjeros: se debe permitir capturar nacionalidad, domicilio legal del empleador, y otros campos especiales si aplica.  
- Las plantillas deben mantenerse “oficiales”: solo usuarios con permisos pueden crearlas/modificarlas.  
- El sistema no asume firma electrónica — la firma puede realizarse fuera del sistema (física o por otro medio).  

## 12. Roadmap de Entrega  

- Fase 1: Diseño de modelo de datos y APIs backend en pyBernate.  
- Fase 2: Desarrollo de plantillas base de contrato conforme normativa.  
- Fase 3: Formularios para ingreso de datos + validaciones.  
- Fase 4: Render MJML → HTML + preview.  
- Fase 5: Generación PDF + guardado de documentos.  
- Fase 6: Pruebas de cumplimiento legal + QA.  

## 13. Entregables para el Agente / Desarrollador  

- Esquema base de base de datos (DDL).  
- Endpoints especificados + contratos de API (input/output).  
- Plantillas MJML base (contrato indefinido, contrato a plazo fijo, contrato obra/faena).  
- Lógica de validación de campos obligatorios.  
- Servicio de render (MJML → HTML → PDF).  
- Manual de uso básico para usuario final (instrucciones para generar contrato).  
