import { Select } from "antd";
import { useSelectOptions } from "../../services/selects";

export default function DynamicSelect({ field, calculateWidth, value, onChange, disabled = false }) {

  const { options, isLoading } = useSelectOptions(field);

  const opts = (options || field.options || []).map(o => ({
    value: o.value ?? o.id,
    label: o.label ?? o.nombre
  }));

  return (
    <Select
      showSearch
      allowClear
      mode={field.isMulti ? "multiple" : undefined}
      style={{ minWidth: `${calculateWidth()}`, width: "100%", marginTop: "4px" }}
      placeholder={field.label}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option?.props?.children?.toLowerCase().indexOf(input.toLowerCase()) > -1
      }
      loading={isLoading}
      value={value}        // <-- valor actual del campo
      onChange={onChange}  // <-- callback para actualizar el valor
      disabled={disabled}
    >
      {opts.map(opt => (
        <Select.Option key={opt.value} value={opt.value}>
          {opt.label}
        </Select.Option>
      ))}
    </Select>
  );
}
