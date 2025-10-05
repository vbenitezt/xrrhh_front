import dayjs from "dayjs";

const DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
const DEFAULT_TIME_FORMAT = "HH:mm:ss";
const DEFAULT_DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const OPERATORS = new Set(["+", "-", "*", "/", "(", ")"]);
const OPERATOR_PRECEDENCE = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};

const ensureArray = (maybeArray) => {
  if (!maybeArray) {
    return [];
  }
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }
  return [maybeArray];
};

const getNestedValue = (object, path) => {
  if (!path || typeof path !== "string") {
    return undefined;
  }
  return path.split(".").reduce((acc, key) => {
    if (acc === undefined || acc === null) {
      return acc;
    }
    return acc[key];
  }, object);
};

const coerceNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const tokenizeDefinition = (definition) => {
  if (!definition) {
    return [];
  }

  if (Array.isArray(definition)) {
    return definition;
  }

  if (typeof definition === "object") {
    return Object.keys(definition)
      .map((key) => Number(key))
      .sort((a, b) => a - b)
      .map((key) => definition[key]);
  }

  return [definition];
};

const normalizeBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return Boolean(value);
};

const normalizeOptions = (field) => {
  if (Array.isArray(field?.options)) {
    return field.options;
  }
  if (Array.isArray(field?.choices)) {
    return field.choices;
  }
  if (field?.options && typeof field.options === "object") {
    return Object.entries(field.options).map(([value, label]) => ({
      value,
      label,
    }));
  }
  return [];
};

const normalizeLabel = (fieldName, label) => {
  if (label) {
    return label;
  }
  if (!fieldName) {
    return "";
  }
  const withSpaces = String(fieldName)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

export const normalizeFieldConfig = (field = {}) => {
  const fieldName = field.field ?? field.name ?? field.column ?? field.key ?? "";
  const dataTypeRaw = field.data_type ?? field.type ?? field.widget ?? "string";
  const dataType = String(dataTypeRaw).toLowerCase();
  const widget = String(field.widget ?? dataType).toLowerCase();
  const visible = field.visible !== undefined ? Boolean(field.visible) : field.in_form !== false;
  const editable = field.editable !== undefined ? Boolean(field.editable) : !field.show_disabled;

  return {
    ...field,
    field: fieldName,
    name: fieldName,
    data_type: dataType,
    type: dataType,
    widget,
    label: normalizeLabel(fieldName, field.label),
    in_grid: normalizeBoolean(field.in_grid ?? field.in_table, false),
    in_table: normalizeBoolean(field.in_table ?? field.in_grid, false),
    visible: normalizeBoolean(visible, true),
    editable: normalizeBoolean(editable, true),
    not_null: normalizeBoolean(field.not_null ?? field.required, false),
    required: normalizeBoolean(field.required ?? field.not_null, false),
    persist: field.persist !== undefined ? Boolean(field.persist) : true,
    options: normalizeOptions(field),
    filter_by: field.filter_by ?? false,
    sort: field.sort ?? false,
    show_desc: field.show_desc !== undefined ? Boolean(field.show_desc) : true,
    precision: field.precision ?? null,
    func: field.func ?? null,
    func_agg: field.func_agg ?? null,
    fields_agg: field.fields_agg ?? null,
    agg_over_layout: field.agg_over_layout ?? null,
    default_value: field.default_value ?? null,
    expand: field.expand ?? false,
    show_cod: field.show_cod ?? false,
    tooltips: field.tooltips ?? field.tooltip ?? null,
  };
};

export const normalizeStructure = (structure) => {
  if (!structure) {
    return structure;
  }

  if (Array.isArray(structure)) {
    return structure.map((item) => {
      if (Array.isArray(item)) {
        return normalizeStructure(item);
      }
      if (item && typeof item === "object" && (item.field || item.name || item.widget || item.type)) {
        return normalizeFieldConfig(item);
      }
      return item;
    });
  }

  if (typeof structure === "object") {
    if (structure.field || structure.name || structure.widget || structure.type) {
      return normalizeFieldConfig(structure);
    }

    return Object.fromEntries(
      Object.entries(structure).map(([key, value]) => [key, normalizeStructure(value)])
    );
  }

  return structure;
};

const filterNormalizedStructure = (structure, predicate) => {
  if (!structure) {
    return structure;
  }

  if (Array.isArray(structure)) {
    const processed = structure
      .map((item) => {
        if (Array.isArray(item)) {
          return filterNormalizedStructure(item, predicate);
        }
        if (item && typeof item === "object" && (item.field || item.name)) {
          return predicate(item) ? item : null;
        }
        return null;
      })
      .filter((item) => {
        if (Array.isArray(item)) {
          return item.length > 0;
        }
        return item !== null && item !== undefined;
      });

    return processed;
  }

  if (typeof structure === "object") {
    if (structure.field || structure.name) {
      return predicate(structure) ? structure : null;
    }

    return Object.fromEntries(
      Object.entries(structure)
        .map(([key, value]) => [key, filterNormalizedStructure(value, predicate)])
        .filter(([, value]) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          if (value && typeof value === "object") {
            return Object.keys(value).length > 0;
          }
          return Boolean(value);
        })
    );
  }

  return null;
};

export const filterFormStructure = (structure) => {
  const normalized = normalizeStructure(structure);
  const predicate = (field) => (field.visible ?? true) && (field.in_form ?? true);
  return filterNormalizedStructure(normalized, predicate);
};

export const flattenStructure = (structure) => {
  const normalized = normalizeStructure(structure);
  const accumulator = [];

  const traverse = (node) => {
    if (!node) {
      return;
    }

    if (Array.isArray(node)) {
      node.forEach((item) => traverse(item));
      return;
    }

    if (typeof node === "object") {
      if (node.field || node.name) {
        accumulator.push(node);
        return;
      }

      Object.values(node).forEach((value) => traverse(value));
    }
  };

  traverse(normalized);

  return accumulator;
};

const getOperandValue = (token, context) => {
  if (typeof token === "number") {
    return token;
  }

  if (typeof token === "string") {
    if (OPERATORS.has(token)) {
      return token;
    }

    const numeric = Number(token);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }

    const value = getNestedValue(context, token);
    return coerceNumber(value);
  }

  return 0;
};

const applyOperator = (operator, right, left) => {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      if (right === 0) {
        return 0;
      }
      return left / right;
    default:
      return 0;
  }
};

export const evaluateExpression = (definition, context = {}) => {
  const tokens = tokenizeDefinition(definition);
  if (!tokens.length) {
    return undefined;
  }

  const values = [];
  const operators = [];

  const flush = () => {
    const operator = operators.pop();
    const right = values.pop();
    const left = values.pop();
    values.push(applyOperator(operator, right, left));
  };

  tokens.forEach((token) => {
    const operand = getOperandValue(token, context);

    if (typeof operand === "string" && OPERATORS.has(operand)) {
      if (operand === "(") {
        operators.push(operand);
        return;
      }

      if (operand === ")") {
        while (operators.length && operators[operators.length - 1] !== "(") {
          flush();
        }
        operators.pop();
        return;
      }

      while (
        operators.length &&
        operators[operators.length - 1] !== "(" &&
        OPERATOR_PRECEDENCE[operators[operators.length - 1]] >=
          OPERATOR_PRECEDENCE[operand]
      ) {
        flush();
      }
      operators.push(operand);
      return;
    }

    values.push(coerceNumber(operand));
  });

  while (operators.length) {
    flush();
  }

  if (!values.length) {
    return undefined;
  }

  const result = values.pop();
  return Number.isFinite(result) ? result : undefined;
};

export const evaluateAggregate = (fieldConfig, layoutsData = {}) => {
  if (!fieldConfig?.func_agg || !fieldConfig?.fields_agg || !fieldConfig?.agg_over_layout) {
    return undefined;
  }

  const layoutKey = fieldConfig.agg_over_layout;
  const rows = ensureArray(layoutsData[layoutKey]);

  if (!rows.length) {
    return 0;
  }

  const totals = rows.map((row) => {
    const value = evaluateExpression(fieldConfig.fields_agg, row);
    return coerceNumber(value);
  });

  const sum = totals.reduce((acc, value) => acc + value, 0);

  const aggregator = String(fieldConfig.func_agg).toLowerCase();
  if (aggregator === "avg" || aggregator === "average") {
    return rows.length ? sum / rows.length : 0;
  }

  return sum;
};

export const calculateFieldValues = ({ fields, values = {}, layouts = {} }) => {
  const fieldList = flattenStructure(fields);
  if (!fieldList.length) {
    return {};
  }

  const computed = {};
  const context = { ...values };

  fieldList.forEach((field) => {
    const fieldName = field.field ?? field.name;
    if (!fieldName) {
      return;
    }

    if (field.func) {
      const result = evaluateExpression(field.func, context);
      if (result !== undefined) {
        computed[fieldName] = result;
        context[fieldName] = result;
      }
    }

    if (field.func_agg && field.agg_over_layout) {
      const result = evaluateAggregate(field, layouts);
      if (result !== undefined) {
        computed[fieldName] = result;
        context[fieldName] = result;
      }
    }
  });

  return computed;
};

export const filterPersistentValues = (fields, values = {}) => {
  const fieldList = flattenStructure(fields);
  const fieldMap = new Map(fieldList.map((field) => [field.field ?? field.name, field]));

  return Object.entries(values).reduce((acc, [key, value]) => {
    const fieldConfig = fieldMap.get(key);
    if (!fieldConfig) {
      acc[key] = value;
      return acc;
    }

    if (fieldConfig.persist === false) {
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});
};

export const formatValueForSubmission = (field, value) => {
  if (value === null || value === undefined) {
    return value;
  }

  const dataType = field?.data_type ?? field?.type ?? "string";
  const normalizedType = String(dataType).toLowerCase();

  if (dayjs.isDayjs(value)) {
    if (normalizedType.includes("time") && !normalizedType.includes("date")) {
      return value.format(DEFAULT_TIME_FORMAT);
    }

    if (normalizedType.includes("datetime")) {
      return value.format(DEFAULT_DATETIME_FORMAT);
    }

    return value.format(DEFAULT_DATE_FORMAT);
  }

  if (normalizedType.includes("date") || normalizedType.includes("time")) {
    if (typeof value === "string") {
      return value;
    }
    const asDayjs = dayjs(value);
    if (asDayjs.isValid()) {
      if (normalizedType.includes("time") && !normalizedType.includes("date")) {
        return asDayjs.format(DEFAULT_TIME_FORMAT);
      }
      if (normalizedType.includes("datetime")) {
        return asDayjs.format(DEFAULT_DATETIME_FORMAT);
      }
      return asDayjs.format(DEFAULT_DATE_FORMAT);
    }
  }

  return value;
};

export const buildSubmissionPayload = ({ fields, values = {}, layouts = {} }) => {
  const computed = calculateFieldValues({ fields, values, layouts });
  const merged = { ...values, ...computed };
  const fieldList = flattenStructure(fields);
  const fieldMap = new Map(fieldList.map((field) => [field.field ?? field.name, field]));

  return Object.entries(merged).reduce((acc, [key, value]) => {
    const fieldConfig = fieldMap.get(key);
    if (!fieldConfig) {
      acc[key] = value;
      return acc;
    }

    if (fieldConfig.persist === false) {
      return acc;
    }

    acc[key] = formatValueForSubmission(fieldConfig, value);
    return acc;
  }, {});
};

export const buildLayoutsData = (detailTabs = [], data = {}) => {
  return detailTabs.reduce((acc, tab) => {
    const layoutKey = tab?.layout_mr ?? tab?.name ?? tab?.id ?? tab?.key;
    if (!layoutKey) {
      return acc;
    }
    acc[layoutKey] = data[tab.name] ?? data[layoutKey] ?? [];
    return acc;
  }, {});
};
