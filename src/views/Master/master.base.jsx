import { Avatar, Image, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { formatNumber } from "../../utils/formatMoney";
import dayjs from "dayjs";
import { EditButton, RemoveButton } from "../../components/Buttons/CustomButtons";
import PdfViewer from "../../components/PdfViewer/PdfViewer";
import config from "../../common/config/config";


export const makeColumns = ({
  pk,
  title,
  form,
  remove,
  setEditing,
  setIsModalOpen,
  fields_structure,
  tableData = [],
  getExtraActions = () => { },
  fromMasterDetail = false,
  disableEdition = false,
}) => {
  if (!fields_structure) {
    return [];
  }
  let columns = fields_structure.filter(item => item.in_table || item.field_show).map((item) => {
    const isFieldShow = Boolean(item.field_show);
    const fieldShowPath = isFieldShow ? item.field_show.split(".") : [];
    const structureOptions = Array.isArray(item.options)
      ? item.options.map((option) => ({
        value: option?.value ?? option?.id ?? option?.key ?? option,
        label:
          option?.label ??
          option?.text ??
          option?.name ??
          option?.nombre ??
          String(option?.value ?? option),
      }))
      : [];

    const dataOptionsMap = tableData.reduce((acc, row) => {
      if (!row || !isFieldShow) {
        return acc;
      }

      const optionValue = row?.[item.name];
      if (optionValue === undefined || optionValue === null) {
        return acc;
      }

      const optionLabel = fieldShowPath.reduce((current, segment) => {
        if (current === undefined || current === null) {
          return current;
        }
        return current[segment];
      }, row);

      if (optionLabel === undefined || optionLabel === null) {
        return acc;
      }

      if (!acc.has(optionValue)) {
        acc.set(optionValue, optionLabel);
      }

      return acc;
    }, new Map());

    const dataOptions = Array.from(dataOptionsMap.entries()).map(
      ([value, label]) => ({ value, label })
    );

    let filterOptions = structureOptions.length > 0 ? structureOptions : dataOptions;

    if (item.type === "boolean") {
      filterOptions = [
        { value: true, label: "SI" },
        { value: false, label: "NO" },
      ];
    }

    const isNumericType = ["number", "integer", "decimal", "float"].includes(
      item.type
    );
    const isDateType = item.type === "date" || item.name.includes("date");

    const filterMeta = isFieldShow
      ? {
        type: "select",
        operator: "eq",
        options: filterOptions,
      }
      : item.type === "boolean"
        ? {
          type: "select",
          operator: "eq",
          options: filterOptions,
        }
        : isNumericType
          ? {
            type: "number",
            operator: "btw",
          }
          : isDateType
            ? {
              type: "date",
              operator: "btw",
              format: "YYYY-MM-DD",
            }
            : {
              type: "text",
              operator: "ilk",
            };

    return {
      title: item.label,
      dataIndex: item.name,
      key: item.name,
      filterType: filterMeta.type,
      filterOptions,
      filterMeta,
      ...(["number", "integer"].includes(item.type)
        ? {
          align: "right",
          render: (key) => <>{formatNumber(key)}</>,
        }
        : item.type === "boolean"
          ? {
            align: "center",
            render: (key) => {
              return <>{key ? "SI" : "NO"}</>;
            },
          }
          : (item.name.includes("photo") || item.name.includes("logo")) && ["string", "file"].includes(item.type)
            ? {
              align: "center",
              render: (key) => (
                key && <Avatar src={<Image src={`${config.api.baseUrl}/files/${key}?${dayjs().format('YYYYMMDDHHmmssSSS')}`} alt="avatar" />} />
              ),
            }
            : item.field_show ? {
              render: (_, row) => {
                // item.field_show puede ser algo como "_cargo_superior.desc_cargo"
                // console.log("ROW",row);
                const path = item.field_show;
                // Soportar paths anidados separados por punto
                const value = path.split('.').reduce((acc, key) => acc && acc[key], row);
                return <>{value}</>;
              },
            } : (item.name.includes("date") || item.type === "date") ? {
              align: "center",
              render: (key) => <>{dayjs(key, "YYYY-MM-DD").isValid() && dayjs(key, "YYYY-MM-DD").format("DD-MM-YYYY")}</>,
            } : item.name.includes("attached") ? {
              align: "center",
              render: (key) => (
                key && <PdfViewer url={`${config.api.baseUrl}/files/${key}`} />
              ),
            } : {}),
    };
  });

  !disableEdition && columns.push(
    {
      key: "actions",
      title: "Acciones",
      align: "center",
      fixed: "right",
      width: 100,
      render: (row) => (
        <div className="flex flex-row justify-center gap-1 text-center">
          {getExtraActions(row)?.map(extraAction => extraAction)}
          <EditButton
            title={`Editar ${title}`}
            type="text"
            size="small"
            onClick={() => {
              if (fromMasterDetail === true) {
                setEditing({ ...row })
              } else {
                setEditing(row[pk]);
                setIsModalOpen(true);
                const values = {}
                for (const k of Object.keys(row)) {
                  if (dayjs(row[k], "YYYY-MM-DD").isValid()){
                    values[k] = dayjs(row[k], "YYYY-MM-DD")
                  } else {
                    values[k] = row[k]
                  }
                }
                form.setFieldsValue({
                  ...values,
                });
              }
            }}
          />
          <Popconfirm
            title="Cuidado!!!"
            description={`Está seguro de eliminar el ${title}?`}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            placement="left"
            onConfirm={() => remove({ ...row })}
            okButtonProps={{ type: "default", danger: true }}
            okText="Si"
            cancelText="No"
          >
            <RemoveButton size="small" type="text" title={`Eliminar ${title}`} />
          </Popconfirm>
        </div>
      ),
    }
  )
  return columns;
};
