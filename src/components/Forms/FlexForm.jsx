import React from "react";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  TimePicker,
  Button,
} from "antd";
import ChileanRutify from "chilean-rutify";
import { IoAddCircleOutline } from "react-icons/io5";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const FlexForm = ({
  onFinish,
  form,
  fields,
  hasSubmit = false,
  extraFields = null,
}) => {
  const getInput = (field, props = {}) => {
    if (field.type === "entrycompletion") {
      return (
        <Select
          size="small"
          {...props}
          showSearch
          allowClear
          style={{ width: "100%" }}
          placeholder={field.label}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {field.options?.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    } else if (field.type === "label") {
      return <Input size="small" disabled />;
    } else {
      return getInputs(field.type, props);
    }
  };

  const handleRutChange = (e) => {
    form.setFieldValue(e.target.id, ChileanRutify.formatRut(e.target.value));
  };

  const validateRut = (value) => {
    if (!ChileanRutify.validRut(value) && value.length > 4) {
      return Promise.reject("Invalid Rut");
    } else {
      return Promise.resolve();
    }
  };

  const getInputs = (type, props = {}) => {
    const items = {
      string: <Input size="small" {...props} />,
      email: <Input size="small" {...props} />,
      password: (
        <Input.Password size="small" visibilityToggle={false} {...props} />
      ),
      boolean: <Switch size="small" {...props} />,
      rut: (
        <Input
          size="small"
          onChange={handleRutChange}
          maxLength={12}
          {...props}
        />
      ),
      date: (
        <DatePicker
          size="small"
          allowClear
          format="DD-MM-YYYY"
          {...props}
          style={{ width: "100%" }}
        />
      ),
      time: <TimePicker size="small" format="HH:mm" {...props} />,
      dateRange: (
        <RangePicker
          allowEmpty={[true, true]}
          size="small"
          format="DD-MM-YYYY"
          {...props}
        />
      ),
      integer: <InputNumber size="small" {...props} style={{ width: "100%" }} />,
      textarea: <TextArea size="small" rows={4} {...props} />,
    };
    return items[type];
  };

  return (
    <Form
      className="flex flex-wrap justify-between w-full gap-2"
      form={form}
      size="small"
      onFinish={onFinish}
      layout="vertical"
    >
      {fields.map((field, index) => {
        const { label, tooltip, name, required, type, ...props } = field;
        return (
          <Form.Item
            className="p-0 m-0"
            key={index}
            label={label}
            tooltip={tooltip || false}
            name={name}
            rules={[
              {
                required: required,
                type: type,
                ...(type === "rut"
                  ? { validator: (_, value) => validateRut(value) }
                  : {}),
                message: `El campo ${label} es requerido!`,
              },
            ]}
          >
            {getInput(field, props)}
          </Form.Item>
        );
      })}
      {extraFields ? extraFields : ""}
      {hasSubmit && (
        <Form.Item label=" " colon={false}>
          <Button
            size="small"
            type="ghost"
            shape="circle"
            htmlType="submit"
            icon={<IoAddCircleOutline size="1.5em" />}
          />
        </Form.Item>
      )}
    </Form>
  );
};

export default FlexForm;
