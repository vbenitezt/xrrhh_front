import React from "react";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  TimePicker,
  Upload,
  Button,
} from "antd";
import ChileanRutify from "chilean-rutify";
import { UploadOutlined } from "@ant-design/icons";
import { v4 } from "uuid";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CustomForm = ({
  onFinish,
  form = Form.useForm(),
  fields,
  maxWidth = 600,
  className = "",
  extraFormItems = [],
  flex = false,
  hiddenFields = [],
}) => {
  // const { saveFile, url, field } = useSaveFbFile();

  const handleOnFinish = (values) => {
    onFinish({ ...values });
  };

  const getFormItem = (field, isLast, index) => {
    return <Form.Item
                    className={flex && "p-0 m-0"}
                    label={field.label}
                    tooltip={field.tooltip || false}
                    name={field.name}
                    valuePropName={field.type === "file" ? "file" : "value"}
                    rules={[
                {
                  required: field.required ,
                  ...(field.type === "select" 
                    ? {} 
                    : { type: field.type }),
                  ...(field.type === "rut"
                    ? { validator: (_, value) => validateRut(value) }
                    : {}),
                  message: `El campo ${field.label} es requerido!`,
                },
              ]}
                    style={{ marginBottom: 8 }} // Reducir el espacio entre el label y el componente
                    labelCol={{ style: { marginBottom: 0, paddingBottom: 0 } }} // Opcional: aún menos espacio
                    {...(index ? { key: field.name || index } : {})}
                  >
                    {getInput(
                      field,
                      isLast
                    )}
                  </Form.Item>
  }

  const getInput = (field, isLast = false) => {
    if (field.type === "select") {
      const calculateWidth = () => {
        const totalWidth = field.options.reduce((sum, option) => sum + option.label.length, 0);
        const averageWidth = totalWidth / field.options.length;
        return `${Math.round(averageWidth * 10)}px`;
      };
      return (
        <Select
          showSearch
          allowClear
          mode={field.isMulti && "multiple"}
          style={{ minWidth: `${calculateWidth()}`, width: "100%", marginTop: "4px" }}
          placeholder={field.label}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {field.options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    } else if (field.type === "file") {
      return (
        <Upload
          multiple={false}
        >
          <Button style={{ width: "100%", marginTop: "4px" }} icon={<UploadOutlined />}>
            Click para Cargar
          </Button>
        </Upload>
      );
    } else {
      return getComponent(field, isLast);
    }
  };

  const validateRut = (value) => {
    if (!ChileanRutify.validRut(value) && value.length > 4) {
      return Promise.reject("Invalid Rut");
    } else {
      return Promise.resolve();
    }
  };

  const validaFields = (fields) => {
    if (!Array.isArray(fields)) {
        console.log("Es un Objeto", fields)
        // alert("Es un Objeto"+ fields)
      } else if (Array.isArray(fields[0])) {
        console.log("Array Ordenado", fields)
        // alert("Es objeto"+ JSON.stringify(fields[0]))
      } else {
        console.log("Es array Desordenado", fields)
        // alert("Es array Desordenado"+ JSON.stringify(fields[0]))
      }
  }

  const handleRutChange = (e) => {
    form.setFieldValue(e.target.id, ChileanRutify.formatRut(e.target.value));
  };
  const getComponent = (field, isLast) => {
    const inputProps = {
      onPressEnter: isLast ? () => form.submit() : undefined,
      className: "form-input mt-1 block w-full",
      style: { width: "100%" },
      size: "small",
      disabled: field.show_disabled
    };
    const inputs = {
      string: <Input {...inputProps} />,
      email: <Input {...inputProps} />,
      password: <Input.Password visibilityToggle={false} {...inputProps} />,
      boolean: <Switch onPressEnter={isLast ? () => form.submit() : () => { }} />,
      rut: <Input onChange={handleRutChange} maxLength={12} {...inputProps} />,
      date: <DatePicker {...inputProps} format="DD-MM-YYYY" />,
      time: <TimePicker format="HH:mm" {...inputProps} />,
      dateRange: <RangePicker {...inputProps} />,
      integer: <InputNumber {...inputProps} min={field.min} max={field.max} />,
      number: <InputNumber {...inputProps} step={0.1} min={field.min} max={field.max} />,
      textarea: <TextArea {...inputProps} rows={4} />,
    };
    return inputs[field.type];
  }

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
      className={flex ? `flex flex-wrap justify-start w-full gap-2 ${className}` : `flex flex-col w-full h-full ${className}`}
      form={form}
      onFinish={handleOnFinish}
      layout={flex ? "vertical" : "horizontal"}
      {...(flex ? {} : normalFormProps)}
    >
      {validaFields(fields)}
      {/* Si fields es un array de dos niveles, agrupar por fila */}
      
      {!Array.isArray(fields)
        ? Object.keys(fields).map((key)=> (
          <div
              key={key}
              className="flex flex-row flex-wrap gap-2 w-full">
              <h3 style={{ width: "100%", marginBottom: "0px", paddingBottom: "2px", borderBottom: "1px solid #d9d9d9" }}>{key}</h3>
              {fields[key].map((field, index) => (            
              <div
                  key={field.name || index}
                  className="flex-1 min-w-[180px] w-full"
                  style={{
                    flex: 1,
                    minWidth: 180,
                    maxWidth: "100%",
                  }}
                >                   
                  {getFormItem(field, 1, index)}
                </div>
        ))}
        </div>
        ))
        :Array.isArray(fields[0])
        ? fields.map((fila, filaIdx) => (
            <div
              key={filaIdx}
              className="flex flex-row flex-wrap gap-2 w-full"
              style={{ width: "100%", flexWrap: "wrap" }}
            >
              {fila.map((field, index) => (
                <div
                  key={field.name || index}
                  className="flex-1 min-w-[180px] w-full"
                  style={{
                    flex: 1,
                    minWidth: 180,
                    maxWidth: "100%",
                  }}
                >                   
                  {getFormItem(field, fila.filter(f => !f.show_disabled).length - 1 ===
                        index - fila.filter(f => f.show_disabled).length, index)}
                </div>
              ))}
            </div>
          ))
        : fields.map((field, index) => (
            getFormItem(field, fields.filter(f => !f.show_disabled).length - 1 ===
              index - fields.filter(f => f.show_disabled).length, index)
          ))}
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
