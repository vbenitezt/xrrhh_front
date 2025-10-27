import React from "react";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Switch,
  TimePicker,
  Upload,
  Button,
} from "antd";
import DinamycSelect from "../Select/DinamycSelect";
import ChileanRutify from "chilean-rutify";
import { UploadOutlined } from "@ant-design/icons";
import { v4 } from "uuid";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normalizeCandidate = (value) => {
  if (!value && value !== 0) {
    return "";
  }
  return String(value).toLowerCase();
};

const resolveFieldType = (field) => {
  const candidates = [
    field.widget,
    field.component,
    field.control,
    field.data_type,
    field.type,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeCandidate(candidate);
    if (!normalized) {
      continue;
    }

    if (normalized.includes("daterange") || (normalized.includes("date") && normalized.includes("range"))) {
      return "dateRange";
    }
    if (normalized.includes("datetime")) {
      return "datetime";
    }
    if (normalized.includes("date")) {
      return "date";
    }
    if (normalized.includes("time")) {
      return "time";
    }
    if (normalized.includes("textarea") || normalized.includes("text_area")) {
      return "textarea";
    }
    if (
      normalized.includes("select") ||
      normalized.includes("combo") ||
      normalized.includes("entry") ||
      normalized.includes("completion")
    ) {
      return "select";
    }
    if (normalized.includes("boolean") || normalized.includes("switch") || normalized.includes("checkbox")) {
      return "boolean";
    }
    if (normalized.includes("password")) {
      return "password";
    }
    if (normalized.includes("email")) {
      return "email";
    }
    if (normalized.includes("rut")) {
      return "rut";
    }
    if (normalized.includes("file") || normalized.includes("upload")) {
      return "file";
    }
    if (normalized.includes("integer")) {
      return "integer";
    }
    if (normalized.includes("decimal") || normalized.includes("float")) {
      return "number";
    }
    if (normalized.includes("number")) {
      return "number";
    }
  }

  return "string";
};

const isVisibleField = (field) => {
  if (field?.visible === false) {
    return false;
  }
  if (field?.in_form === false) {
    return false;
  }
  return true;
};

const isEditableField = (field) => {
  if (field?.editable === false) {
    return false;
  }
  if (field?.show_disabled === true) {
    return false;
  }
  return true;
};

const getFieldName = (field, fallback) => {
  return field?.field ?? field?.name ?? field?.key ?? fallback;
};

const getLastEditableFieldName = (fields = []) => {
  const editableFields = fields.filter(
    (item) => isVisibleField(item) && isEditableField(item)
  );
  const last = editableFields[editableFields.length - 1];
  return last ? getFieldName(last) : null;
};

const calculateNumberStep = (field) => {
  if (field?.step) {
    return field.step;
  }

  if (field?.precision) {
    const precision = Number(field.precision);
    if (Number.isFinite(precision) && precision > 0) {
      return Number(`0.${"0".repeat(precision - 1)}1`);
    }
  }

  return 0.1;
};

const getFieldTooltip = (field) => field?.tooltips ?? field?.tooltip ?? false;

const CustomForm = ({
  onFinish,
  form,
  fields,
  maxWidth = 600,
  className = "",
  extraFormItems = [],
  flex = false,
  hiddenFields = [],
  onFieldBlur = null,
}) => {
  // const { saveFile, url, field } = useSaveFbFile();

  const handleOnFinish = (values) => {
    onFinish({ ...values });
  };

  const handleFieldBlur = (fieldName) => {
    if (onFieldBlur && typeof onFieldBlur === 'function') {
      const allValues = form.getFieldsValue(true);
      const changedValues = { [fieldName]: allValues[fieldName] };
      onFieldBlur(changedValues, allValues);
    }
  };

  const getInput = (field, fieldType, submitOnEnter = false, fieldName = null) => {
    const disabled = !isEditableField(field);

    if (fieldType === "select") {
      const calculateWidth = () => {
        if (!Array.isArray(field.options) || field.options.length === 0) {
          return "180px";
        }
        const totalWidth = field.options.reduce((sum, option) => {
          const label = option?.label ?? option?.text ?? option?.name ?? option?.nombre ?? option;
          return sum + String(label ?? "").length;
        }, 0);
        const averageWidth = totalWidth / field.options.length;
        return `${Math.max(120, Math.round(averageWidth * 10))}px`;
      };

      return (
        <DinamycSelect
          field={field}
          calculateWidth={calculateWidth}
          disabled={disabled}
          onBlur={fieldName ? () => handleFieldBlur(fieldName) : undefined}
        />
      );
    }

    if (fieldType === "file") {
      return (
        <Upload multiple={false} disabled={disabled}>
          <Button
            style={{ width: "100%", marginTop: "4px" }}
            icon={<UploadOutlined />}
            disabled={disabled}
          >
            Click para Cargar
          </Button>
        </Upload>
      );
    }

    return getComponent(field, fieldType, submitOnEnter, disabled, fieldName);
  };

  const validateRut = (value) => {
    if (value === undefined || value === null || value === "") {
      return Promise.resolve();
    }
    const normalizedValue = String(value);
    if (!ChileanRutify.validRut(normalizedValue) && normalizedValue.length > 4) {
      return Promise.reject("Invalid Rut");
    }
    return Promise.resolve();
  };

  const handleRutChange = (e) => {
    form.setFieldValue(e.target.id, ChileanRutify.formatRut(e.target.value));
  };

  const renderFormItem = (field, lastEditableFieldName, index) => {
    if (!field || !isVisibleField(field)) {
      return null;
    }

    const fieldName = getFieldName(field, index);
    if (!fieldName) {
      return null;
    }

    const fieldType = resolveFieldType(field);
    const submitOnEnter =
      lastEditableFieldName && fieldName === lastEditableFieldName;

    const rules = [];
    const isRequired = field?.not_null ?? field?.required ?? false;

    if (isRequired) {
      rules.push({
        required: true,
        message: `El campo ${field.label} es requerido!`,
      });
    }

    if (fieldType === "rut") {
      rules.push({ validator: (_, value) => validateRut(value) });
    }

    if (fieldType === "email") {
      rules.push({
        type: "email",
        message: `El campo ${field.label} debe ser un correo válido!`,
      });
    }

    const valuePropName =
      fieldType === "boolean"
        ? "checked"
        : fieldType === "file"
          ? "file"
          : "value";

    const initialValue =
      field.default_value !== undefined ? field.default_value : field.initialValue;

    return (
      <Form.Item
        key={fieldName || index}
        className={flex ? "p-0 m-0" : undefined}
        label={field.label}
        tooltip={getFieldTooltip(field)}
        name={fieldName}
        valuePropName={valuePropName}
        rules={rules}
        style={{ marginBottom: 8 }}
        labelCol={{ style: { marginBottom: 0, paddingBottom: 0 } }}
        initialValue={initialValue}
      >
        {getInput(field, fieldType, submitOnEnter, fieldName)}
      </Form.Item>
    );
  };
  const getComponent = (field, fieldType, submitOnEnter, disabled, fieldName) => {
    const sharedProps = {
      onPressEnter: submitOnEnter ? () => form.submit() : undefined,
      onBlur: fieldName ? () => handleFieldBlur(fieldName) : undefined,
      className: "form-input mt-1 block w-full",
      style: {
        width: ["date", "time", "datetime", "dateRange"].includes(fieldType)
          ? "150px"
          : "100%",
      },
      size: "small",
      disabled,
    };

    switch (fieldType) {
      case "email":
      case "string":
        return <Input {...sharedProps} type={fieldType === "email" ? "email" : undefined} />;
      case "password":
        return <Input.Password visibilityToggle={false} {...sharedProps} />;
      case "boolean":
        return <Switch disabled={disabled} />;
      case "rut":
        return <Input {...sharedProps} onChange={handleRutChange} maxLength={12} />;
      case "date":
        return <DatePicker {...sharedProps} format={field?.format ?? "DD-MM-YYYY"} />;
      case "datetime":
        return (
          <DatePicker
            {...sharedProps}
            format={field?.format ?? "DD-MM-YYYY HH:mm"}
            showTime
          />
        );
      case "time":
        return <TimePicker {...sharedProps} format={field?.format ?? "HH:mm"} />;
      case "dateRange":
        return <RangePicker {...sharedProps} format={field?.format ?? "DD-MM-YYYY"} />;
      case "integer":
        return (
          <InputNumber
            {...sharedProps}
            min={field?.min}
            max={field?.max}
            step={1}
            style={{ width: "100%" }}
          />
        );
      case "number":
        return (
          <InputNumber
            {...sharedProps}
            min={field?.min}
            max={field?.max}
            step={calculateNumberStep(field)}
            style={{ width: "100%" }}
          />
        );
      case "textarea":
        return <TextArea {...sharedProps} rows={field?.rows ?? 4} />;
      default:
        return <Input {...sharedProps} />;
    }
  };

  const normalFormProps = {
    labelCol: {
      flex: "110px",
    },
    labelAlign: "left",
    labelWrap: true,
    wrapperCol: {
      flex: 1,
    },
    style: {
      maxWidth,
    }
  }
  
  return (
    <Form
      size="small"
      className={flex ? `flex flex-wrap gap-2 justify-start w-full ${className}` : `flex flex-col w-full h-full ${className}`}
      form={form}
      onFinish={handleOnFinish}
      layout={flex ? "vertical" : "horizontal"}
      {...(flex ? {} : normalFormProps)}
    >
      {
        !Array.isArray(fields)
          ? Object.keys(fields ?? {}).map((key) => {
              const groupFields = (fields?.[key] ?? []).filter(isVisibleField);
              if (!groupFields.length) {
                return null;
              }
              const lastEditableFieldName = getLastEditableFieldName(groupFields);

              return (
                <div key={key} className="flex flex-row flex-wrap gap-2 w-full">
                  <h3
                    style={{
                      width: "100%",
                      marginBottom: "0px",
                      paddingBottom: "2px",
                      borderBottom: "1px solid #d9d9d9",
                    }}
                  >
                    {key}
                  </h3>
                  {groupFields.map((field, index) => {
                    const fieldName = getFieldName(field, index);
                    return (
                      <div
                        key={fieldName || index}
                        className="flex-1 min-w-[180px] w-full"
                        style={{
                          flex: 1,
                          minWidth: 180,
                          maxWidth: "100%",
                        }}
                      >
                        {renderFormItem(field, lastEditableFieldName, index)}
                      </div>
                    );
                  })}
                </div>
              );
            })
          : Array.isArray(fields?.[0])
          ? fields.map((row, rowIndex) => {
              const visibleRowFields = row.filter(isVisibleField);
              if (!visibleRowFields.length) {
                return null;
              }
              const lastEditableFieldName = getLastEditableFieldName(visibleRowFields);

              return (
                <div
                  key={rowIndex}
                  className="flex flex-row flex-wrap gap-2 w-full"
                  style={{ width: "100%", flexWrap: "wrap" }}
                >
                  {visibleRowFields.map((field, index) => {
                    const fieldName = getFieldName(field, index);
                    return (
                      <div
                        key={fieldName || index}
                        className="flex-1 min-w-[180px] w-full"
                        style={{
                          flex: 1,
                          minWidth: 180,
                          maxWidth: "100%",
                        }}
                      >
                        {renderFormItem(field, lastEditableFieldName, index)}
                      </div>
                    );
                  })}
                </div>
              );
            })
          : (fields ?? [])
              .filter(isVisibleField)
              .map((field, index, list) => {
                const lastEditableFieldName = getLastEditableFieldName(list);
                return renderFormItem(field, lastEditableFieldName, index);
              })
      }
      {hiddenFields && hiddenFields.length > 0 && hiddenFields.map((field) => {
        return (
          <Form.Item key={v4()} name={field} hidden><Input /></Form.Item>
        )
      })}
      {extraFormItems && extraFormItems.length > 0 && extraFormItems.map((extraFormItem) => {
        return extraFormItem;
      })}
    </Form>
  );
};

export default CustomForm;
