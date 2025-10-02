import { Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import { axiosGet } from "../../apis/calls" // tu helper

export default function DynamicSelect({ field, calculateWidth, value ,onChange}) {
  const { data: options = [], isLoading } = useQuery({
    queryKey: ["select-options", field.api_ref],   // cache por endpoint
    queryFn: () => field.api_ref ? axiosGet(`selects/${field.api_ref}`) : Promise.resolve(field.options),
    enabled: !!field.api_ref,                      // solo si hay api_ref
    staleTime: 1000 * 60 * 10, // 10 minutos de datos frescos
  refetchOnWindowFocus: false, // no refetchear al enfocar ventana
  refetchOnReconnect: false
  });

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
    >
      {opts.map(opt => (
        <Select.Option key={opt.value} value={opt.value}>
          {opt.label}
        </Select.Option>
      ))}
    </Select>
  );
}
