# 📋 Backend - Editor de Plantillas de Contratos Laborales

## Resumen

El módulo de contratos laborales permite:
1. **Crear plantillas** de documentos usando un editor visual tipo Word
2. **Arrastrar variables** desde un panel lateral al documento
3. **Guardar plantillas** en el backend
4. **Generar documentos** reemplazando las variables con datos reales del empleado

---

## 1. Modelo de Datos

### Tabla: `plantilla_documento`

```sql
CREATE TABLE plantilla_documento (
    id_plantilla SERIAL PRIMARY KEY,
    cod_empresa INTEGER NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('contrato', 'finiquito', 'anexo', 'certificado')),
    modalidad VARCHAR(50) CHECK (modalidad IN ('indefinido', 'plazo_fijo', 'obra_faena', NULL)),
    contenido_html TEXT NOT NULL,
    variables_usadas JSONB DEFAULT '[]',
    version INTEGER DEFAULT 1,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion INTEGER,
    usuario_modificacion INTEGER,
    
    UNIQUE(cod_empresa, nombre, version)
);
```

### Tabla: `documento_generado`

```sql
CREATE TABLE documento_generado (
    id_documento SERIAL PRIMARY KEY,
    cod_empresa INTEGER NOT NULL,
    id_plantilla INTEGER REFERENCES plantilla_documento(id_plantilla),
    cod_empleado INTEGER NOT NULL,
    datos_variables JSONB NOT NULL,
    contenido_html_final TEXT,
    url_pdf VARCHAR(500),
    hash_documento VARCHAR(64),
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_generador INTEGER,
    estado VARCHAR(20) DEFAULT 'generado'
);
```

### Tabla: `variable_contrato` (Catálogo)

```sql
CREATE TABLE variable_contrato (
    id_variable SERIAL PRIMARY KEY,
    nombre_variable VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(50) NOT NULL,
    tipo_dato VARCHAR(20) NOT NULL,
    requerido_legal BOOLEAN DEFAULT false,
    descripcion TEXT,
    opciones JSONB,
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true
);
```

---

## 2. Endpoints API

### 2.1 Obtener Variables Disponibles

```
GET /api/contratos/variables
```

**Response:**
```json
{
  "categorias": [
    {
      "nombre": "empleador",
      "label": "Datos del Empleador",
      "variables": [
        {
          "nombre_variable": "empleador_razon_social",
          "tipo_dato": "string",
          "requerido_legal": true,
          "descripcion": "Nombre o razón social del empleador"
        },
        {
          "nombre_variable": "empleador_rut",
          "tipo_dato": "string",
          "requerido_legal": true,
          "descripcion": "RUT del empleador"
        }
      ]
    },
    {
      "nombre": "trabajador",
      "label": "Datos del Trabajador",
      "variables": [
        {
          "nombre_variable": "trabajador_nombre_completo",
          "tipo_dato": "string",
          "requerido_legal": true,
          "descripcion": "Nombre completo del trabajador"
        },
        {
          "nombre_variable": "trabajador_rut",
          "tipo_dato": "string",
          "requerido_legal": true,
          "descripcion": "RUT del trabajador"
        }
      ]
    },
    {
      "nombre": "contrato",
      "label": "Datos del Contrato",
      "variables": [...]
    },
    {
      "nombre": "jornada",
      "label": "Jornada Laboral",
      "variables": [...]
    },
    {
      "nombre": "remuneracion",
      "label": "Remuneración",
      "variables": [...]
    }
  ]
}
```

---

### 2.2 Listar Plantillas

```
GET /api/contratos/plantillas
```

**Query Params:**
- `tipo` (opcional): filtrar por tipo de documento
- `modalidad` (opcional): filtrar por modalidad
- `activo` (opcional): filtrar por estado

**Response:**
```json
{
  "data": [
    {
      "id_plantilla": 1,
      "nombre": "Contrato Indefinido Estándar",
      "tipo": "contrato",
      "modalidad": "indefinido",
      "version": 1,
      "activo": true,
      "fecha_modificacion": "2025-01-20T14:30:00Z"
    }
  ],
  "total": 5
}
```

---

### 2.3 Obtener Plantilla por ID

```
GET /api/contratos/plantillas/{id_plantilla}
```

**Response:**
```json
{
  "id_plantilla": 1,
  "nombre": "Contrato Indefinido Estándar",
  "tipo": "contrato",
  "modalidad": "indefinido",
  "contenido_html": "<h1>CONTRATO DE TRABAJO</h1><p>En <span class=\"variable-tag\" data-variable=\"contrato_lugar_firma\">{{contrato_lugar_firma}}</span>...</p>",
  "variables_usadas": [
    "contrato_lugar_firma",
    "contrato_fecha_firma",
    "empleador_razon_social",
    "empleador_rut",
    "trabajador_nombre_completo",
    "trabajador_rut"
  ],
  "version": 1,
  "activo": true,
  "fecha_creacion": "2025-01-15T10:00:00Z",
  "fecha_modificacion": "2025-01-20T14:30:00Z"
}
```

---

### 2.4 Crear Plantilla

```
POST /api/contratos/plantillas
```

**Request:**
```json
{
  "nombre": "Contrato Indefinido 2025",
  "tipo": "contrato",
  "modalidad": "indefinido",
  "contenido_html": "<h1>CONTRATO DE TRABAJO</h1>..."
}
```

**Notas:**
- El `contenido_html` contiene el HTML del editor con las variables como spans:
  ```html
  <span class="variable-tag" data-variable="empleador_razon_social" contenteditable="false">
    {{empleador_razon_social}}
  </span>
  ```
- El backend debe extraer las variables usadas del HTML (buscar `data-variable="..."`)

**Response:**
```json
{
  "id_plantilla": 5,
  "nombre": "Contrato Indefinido 2025",
  "version": 1,
  "message": "Plantilla creada exitosamente"
}
```

---

### 2.5 Actualizar Plantilla

```
PUT /api/contratos/plantillas/{id_plantilla}
```

**Request:**
```json
{
  "nombre": "Contrato Indefinido 2025 (Actualizado)",
  "tipo": "contrato",
  "modalidad": "indefinido",
  "contenido_html": "<h1>CONTRATO DE TRABAJO</h1>..."
}
```

**Response:**
```json
{
  "id_plantilla": 5,
  "version": 2,
  "message": "Plantilla actualizada exitosamente"
}
```

---

### 2.6 Generar Documento

Este endpoint toma una plantilla y los datos de un empleado, reemplaza las variables y genera el PDF.

```
POST /api/contratos/generar
```

**Request:**
```json
{
  "id_plantilla": 1,
  "cod_empleado": 123,
  "datos_variables": {
    "empleador_razon_social": "Empresa Demo SpA",
    "empleador_rut": "76.123.456-7",
    "empleador_domicilio_legal": "Av. Providencia 1234, Santiago",
    "trabajador_nombre_completo": "Juan Pérez González",
    "trabajador_rut": "12.345.678-9",
    "trabajador_nacionalidad": "Chilena",
    "trabajador_fecha_nacimiento": "15 de Mayo de 1990",
    "trabajador_domicilio": "Los Leones 567, Providencia",
    "contrato_lugar_firma": "Santiago",
    "contrato_fecha_firma": "20 de Enero de 2025",
    "contrato_fecha_inicio": "1 de Febrero de 2025",
    "contrato_funciones": "Desarrollador de Software",
    "contrato_lugar_prestacion": "Av. Providencia 1234, Santiago",
    "jornada_dias_trabajo": "Lunes a Viernes",
    "jornada_horario": "09:00 a 18:00 hrs",
    "jornada_horas_semanales": "45",
    "remuneracion_monto": "$2.500.000",
    "remuneracion_forma_pago": "transferencia bancaria",
    "remuneracion_periodo_pago": "mensualmente"
  }
}
```

**Proceso en el Backend:**
1. Obtener la plantilla con `id_plantilla`
2. Obtener el `contenido_html` de la plantilla
3. Reemplazar cada `{{variable}}` con el valor de `datos_variables`
4. Convertir HTML a PDF (WeasyPrint, wkhtmltopdf, etc.)
5. Guardar el documento generado en la BD
6. Guardar el PDF en storage
7. Retornar URL del PDF

**Response:**
```json
{
  "id_documento": 456,
  "url_pdf": "/api/documentos/456/pdf",
  "nombre_archivo": "contrato_12345678-9_20250120.pdf",
  "hash_documento": "sha256:abc123...",
  "message": "Documento generado exitosamente"
}
```

---

### 2.7 Preview de Documento (sin guardar)

```
POST /api/contratos/preview
```

**Request:**
```json
{
  "contenido_html": "<h1>CONTRATO</h1><p>{{empleador_razon_social}}...</p>",
  "datos_variables": {
    "empleador_razon_social": "Empresa Demo SpA"
  }
}
```

**Response:**
```json
{
  "html": "<h1>CONTRATO</h1><p>Empresa Demo SpA...</p>"
}
```

---

### 2.8 Obtener Datos del Empleado (Autocompletar)

Para llenar automáticamente las variables del trabajador al generar un documento:

```
GET /api/contratos/empleado/{cod_empleado}/datos
```

**Response:**
```json
{
  "trabajador_nombre_completo": "Juan Pérez González",
  "trabajador_rut": "12.345.678-9",
  "trabajador_nacionalidad": "Chilena",
  "trabajador_fecha_nacimiento": "15 de Mayo de 1990",
  "trabajador_domicilio": "Los Leones 567, Providencia",
  "trabajador_correo": "juan.perez@email.com",
  "trabajador_estado_civil": "Soltero",
  "contrato_funciones": "Desarrollador de Software",
  "contrato_fecha_inicio": "1 de Marzo de 2023"
}
```

---

### 2.9 Obtener Datos de la Empresa (Autocompletar)

```
GET /api/contratos/empresa/datos
```

**Response:**
```json
{
  "empleador_razon_social": "Empresa Demo SpA",
  "empleador_rut": "76.123.456-7",
  "empleador_domicilio_legal": "Av. Providencia 1234, Santiago",
  "empleador_domicilio_empresa": "Av. Providencia 1234, Of. 501, Santiago",
  "empleador_representante_legal": "Pedro Martínez Soto",
  "empleador_correo": "contacto@empresa.cl"
}
```

---

## 3. Flujo de Uso

### 3.1 Crear una Plantilla

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  1. Usuario abre Editor de Plantillas (/contratos/editor)       │
│  2. GET /api/contratos/variables → Carga panel de variables     │
│  3. Usuario escribe el documento y arrastra variables           │
│  4. Usuario hace clic en "Guardar"                              │
│  5. POST /api/contratos/plantillas                              │
│     Body: { nombre, tipo, modalidad, contenido_html }           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. Recibe el contenido_html con las variables                  │
│  2. Extrae variables usadas (regex: data-variable="([^"]+)")    │
│  3. Guarda en tabla plantilla_documento                         │
│  4. Retorna id_plantilla                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Generar un Documento

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  1. Usuario selecciona plantilla y empleado                     │
│  2. GET /api/contratos/empleado/{id}/datos → Autocompletar      │
│  3. GET /api/contratos/empresa/datos → Autocompletar            │
│  4. Usuario puede editar/completar datos faltantes              │
│  5. POST /api/contratos/generar                                 │
│     Body: { id_plantilla, cod_empleado, datos_variables }       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. Obtener plantilla por id_plantilla                          │
│  2. Obtener contenido_html de la plantilla                      │
│  3. Para cada variable en datos_variables:                      │
│     html = html.replace("{{variable}}", valor)                  │
│  4. Limpiar tags de variable (quitar spans decorativos)         │
│  5. Convertir HTML a PDF                                        │
│  6. Guardar PDF en storage (local/S3)                           │
│  7. Guardar registro en documento_generado                      │
│  8. Retornar URL del PDF                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Formato del HTML de Plantilla

El editor genera HTML con las variables marcadas como spans:

```html
<h1>CONTRATO DE TRABAJO</h1>

<p>En <span class="variable-tag" data-variable="contrato_lugar_firma" contenteditable="false">{{contrato_lugar_firma}}</span>, 
a <span class="variable-tag" data-variable="contrato_fecha_firma" contenteditable="false">{{contrato_fecha_firma}}</span>, entre:</p>

<h2>EL EMPLEADOR:</h2>
<p>
  <strong>Razón Social:</strong> 
  <span class="variable-tag" data-variable="empleador_razon_social" contenteditable="false">{{empleador_razon_social}}</span><br/>
  <strong>RUT:</strong> 
  <span class="variable-tag" data-variable="empleador_rut" contenteditable="false">{{empleador_rut}}</span>
</p>
```

### Proceso de Reemplazo en Backend (Python)

```python
import re
from bs4 import BeautifulSoup

def procesar_plantilla(contenido_html: str, datos_variables: dict) -> str:
    """
    Reemplaza las variables en el HTML de la plantilla.
    """
    html = contenido_html
    
    # Método 1: Reemplazar {{variable}} directamente
    for nombre, valor in datos_variables.items():
        html = html.replace(f"{{{{{nombre}}}}}", str(valor) if valor else "")
    
    # Método 2: Limpiar los spans de variable (opcional, para PDF limpio)
    soup = BeautifulSoup(html, 'html.parser')
    for span in soup.find_all('span', class_='variable-tag'):
        # Reemplazar el span por su contenido de texto
        span.replace_with(span.get_text())
    
    return str(soup)


def extraer_variables_usadas(contenido_html: str) -> list:
    """
    Extrae las variables usadas en la plantilla.
    """
    pattern = r'data-variable="([^"]+)"'
    return list(set(re.findall(pattern, contenido_html)))
```

---

## 5. Variables Estándar (Catálogo)

Insertar en la tabla `variable_contrato`:

```sql
INSERT INTO variable_contrato (nombre_variable, categoria, tipo_dato, requerido_legal, descripcion, orden) VALUES
-- Empleador
('empleador_razon_social', 'empleador', 'string', true, 'Nombre o razón social del empleador', 1),
('empleador_rut', 'empleador', 'string', true, 'RUT del empleador', 2),
('empleador_domicilio_legal', 'empleador', 'string', true, 'Domicilio legal del empleador', 3),
('empleador_domicilio_empresa', 'empleador', 'string', true, 'Domicilio del centro de trabajo', 4),
('empleador_representante_legal', 'empleador', 'string', false, 'Representante legal', 5),
('empleador_correo', 'empleador', 'string', false, 'Correo del empleador', 6),

-- Trabajador
('trabajador_nombre_completo', 'trabajador', 'string', true, 'Nombre completo del trabajador', 10),
('trabajador_rut', 'trabajador', 'string', true, 'RUT del trabajador', 11),
('trabajador_nacionalidad', 'trabajador', 'string', true, 'Nacionalidad', 12),
('trabajador_fecha_nacimiento', 'trabajador', 'date', true, 'Fecha de nacimiento', 13),
('trabajador_domicilio', 'trabajador', 'string', true, 'Domicilio del trabajador', 14),
('trabajador_correo', 'trabajador', 'string', false, 'Correo del trabajador', 15),
('trabajador_estado_civil', 'trabajador', 'select', false, 'Estado civil', 16),

-- Contrato
('contrato_lugar_firma', 'contrato', 'string', true, 'Lugar de firma', 20),
('contrato_fecha_firma', 'contrato', 'date', true, 'Fecha de firma', 21),
('contrato_tipo', 'contrato', 'select', true, 'Tipo de contrato', 22),
('contrato_fecha_inicio', 'contrato', 'date', true, 'Fecha de inicio', 23),
('contrato_fecha_termino', 'contrato', 'date', false, 'Fecha de término', 24),
('contrato_funciones', 'contrato', 'string', true, 'Cargo y funciones', 25),
('contrato_lugar_prestacion', 'contrato', 'string', true, 'Lugar de prestación', 26),

-- Jornada
('jornada_dias_trabajo', 'jornada', 'string', true, 'Días de trabajo', 30),
('jornada_horario', 'jornada', 'string', true, 'Horario', 31),
('jornada_horas_semanales', 'jornada', 'number', true, 'Horas semanales', 32),
('jornada_colacion', 'jornada', 'string', false, 'Colación', 33),

-- Remuneración
('remuneracion_monto', 'remuneracion', 'currency', true, 'Monto remuneración', 40),
('remuneracion_forma_pago', 'remuneracion', 'select', true, 'Forma de pago', 41),
('remuneracion_periodo_pago', 'remuneracion', 'select', true, 'Período de pago', 42),
('remuneracion_beneficios', 'remuneracion', 'string', false, 'Beneficios', 43),
('remuneracion_gratificacion', 'remuneracion', 'string', false, 'Gratificación', 44),

-- Otros
('clausulas_especiales', 'otros', 'string', false, 'Cláusulas especiales', 50);
```

---

## 6. Rutas del Frontend

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/contratos/editor` | `EditorPlantilla` | Crear nueva plantilla |
| `/contratos/editor/:id` | `EditorPlantilla` | Editar plantilla existente |

---

## 7. Permisos Sugeridos

| Permiso | Descripción |
|---------|-------------|
| `contratos.plantillas.ver` | Ver lista de plantillas |
| `contratos.plantillas.crear` | Crear nuevas plantillas |
| `contratos.plantillas.editar` | Editar plantillas existentes |
| `contratos.plantillas.eliminar` | Eliminar/desactivar plantillas |
| `contratos.documentos.generar` | Generar documentos desde plantillas |
| `contratos.documentos.ver` | Ver documentos generados |

---

## 8. Resumen de Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/contratos/variables` | Obtener catálogo de variables |
| GET | `/api/contratos/plantillas` | Listar plantillas |
| GET | `/api/contratos/plantillas/{id}` | Obtener plantilla |
| POST | `/api/contratos/plantillas` | Crear plantilla |
| PUT | `/api/contratos/plantillas/{id}` | Actualizar plantilla |
| DELETE | `/api/contratos/plantillas/{id}` | Eliminar plantilla |
| POST | `/api/contratos/generar` | Generar documento |
| POST | `/api/contratos/preview` | Preview sin guardar |
| GET | `/api/contratos/empleado/{id}/datos` | Datos del empleado |
| GET | `/api/contratos/empresa/datos` | Datos de la empresa |

---

**Versión:** 1.0  
**Fecha:** Diciembre 2025
