import React from "react";
import { Avatar, Image, Popconfirm } from "antd";
import * as icons from "react-icons/md";
import { formatNumber } from "../../utils/formatMoney";
import dayjs from "dayjs";
import { CircleButton, EditButton, RemoveButton } from "../../components/Buttons/CustomButtons";
import PdfViewer from "../../components/PdfViewer/PdfViewer";
import config from "../../common/config/config";
import { evaluateExpression, flattenStructure, normalizeStructure } from "../../utils/fieldStructure";


const getIconComponent = (iconName) => {
  if (!iconName || !icons[iconName]) return null;
  const IconComponent = icons[iconName];
  return <IconComponent />;
};


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
  const normalizedStructure = normalizeStructure(fields_structure);
  const flatFields = flattenStructure(normalizedStructure);

  const columns = flatFields
    .filter((item) => {
      const showInGrid = item.in_grid ?? item.in_table ?? false;
      const isVisible = item.visible ?? true;
      return (showInGrid || item.field_show) && isVisible;
    })
    .map((item) => {
      const fieldName = item.field ?? item.name;
      if (!fieldName) {
        return null;
      }

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

        const optionValue = row?.[fieldName];
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

      const normalizedType = (item.data_type ?? item.type ?? "string").toLowerCase();

      if (normalizedType === "boolean") {
        filterOptions = [
          { value: true, label: "SI" },
          { value: false, label: "NO" },
        ];
      }

      const isNumericType = ["number", "integer", "decimal", "float"].includes(
        normalizedType
      );
      const isDateType = normalizedType === "date" || fieldName.toLowerCase().includes("date");

      const filterMeta = isFieldShow
        ? {
          type: "select",
          operator: "eq",
          options: filterOptions,
        }
        : normalizedType === "boolean"
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

      if (filterMeta.type === "select" && item.api_ref) {
        filterMeta.api_ref = item.api_ref;
      }

      const renderNumeric = {
        align: "right",
        render: (key, row) => {
          const computedValue = item.func ? evaluateExpression(item.func, row) : key;
          return <>{formatNumber(computedValue)}</>;
        },
      };

      const renderBoolean = {
        align: "center",
        render: (key) => {
          return <>{key ? "SI" : "NO"}</>;
        },
      };

      const renderImage = {
        align: "center",
        render: (key) => (
          key && (
            <Avatar
              src={
                <Image
                  src={`${config.api.baseUrl}/files/${key}?${dayjs().format("YYYYMMDDHHmmssSSS")}`}
                  alt="avatar"
                />
              }
            />
          )
        ),
      };

      const renderFieldShow = {
        render: (_, row) => {
          const path = item.field_show;
          const value = path.split(".").reduce((acc, key) => acc && acc[key], row);
          return <>{value}</>;
        },
      };

      const renderDate = {
        align: "center",
        render: (key) => (
          <>
            {dayjs(key, "YYYY-MM-DD").isValid() &&
              dayjs(key, "YYYY-MM-DD").format("DD-MM-YYYY")}
          </>
        ),
      };

      const renderPdf = {
        align: "center",
        render: (key) => key && <PdfViewer url={`${config.api.baseUrl}/files/${key}`} />,
      };

      const baseColumn = {
        title: item.label,
        dataIndex: fieldName,
        key: fieldName,
        filterType: filterMeta.type,
        filterOptions,
        filterMeta,
        ellipsis: item.expand ? false : true,
      };

      if (["number", "integer", "decimal", "float"].includes(normalizedType)) {
        return {
          ...baseColumn,
          ...renderNumeric,
        };
      }

      if (normalizedType === "boolean") {
        return {
          ...baseColumn,
          ...renderBoolean,
        };
      }

      if (
        (fieldName.includes("photo") || fieldName.includes("logo")) &&
        ["string", "file"].includes(normalizedType)
      ) {
        return {
          ...baseColumn,
          ...renderImage,
        };
      }

      if (item.field_show) {
        return {
          ...baseColumn,
          ...renderFieldShow,
        };
      }

      if (fieldName.includes("attached")) {
        return {
          ...baseColumn,
          ...renderPdf,
        };
      }

      if (fieldName.includes("date") || normalizedType === "date") {
        return {
          ...baseColumn,
          ...renderDate,
        };
      }

      if (item.func) {
        return {
          ...baseColumn,
          render: (_, row) => {
            const computedValue = evaluateExpression(item.func, row);
            return <>{computedValue}</>;
          },
        };
      }

      return baseColumn;
    })
    .filter(Boolean);

  !disableEdition && columns.push(
    {
      key: "actions",
      title: "Acciones",
      align: "center",
      fixed: "right",
      width: 100,
      render: (row) => (
        <div className="flex flex-row gap-1 justify-center text-center">
          {getExtraActions(row)?.map((extraAction, index) =>
            React.cloneElement(extraAction, { key: `extra-action-${index}` })
          )}
          <EditButton
            title={`Editar ${title}`}
            type="text"
            size="small"
            onClick={() => {
              if (fromMasterDetail === true) {
                const values = {}
                for (const k of Object.keys(row)) {
                  if (typeof row[k] === 'string' && row[k].includes("new_value_")) {
                    values[k] = row[k]
                  } else if (dayjs(row[k], "YYYY-MM-DD").isValid()) {
                    values[k] = dayjs(row[k], "YYYY-MM-DD")
                  } else {
                    values[k] = row[k]
                  }
                }
                setEditing({ ...values })
              } else {
                setEditing(row[pk]);
                setIsModalOpen(true);
                const values = {}
                for (const k of Object.keys(row)) {
                  if (dayjs(row[k], "YYYY-MM-DD").isValid()) {
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
            icon={getIconComponent("MdQuestionAnswer")}
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



export const makeExtraButtons = (buttons = [], callApiFunction = () => { }, selectedRowKeys = [], isLoading = false) => {
  const extraButtons = buttons.map((button, index) => {
    return (
      <CircleButton
        title={button.title}
        key={`extra-button-${index}`}
        danger={button.danger}
        loading={isLoading}
        icon={getIconComponent(button.icon)}
        disabled={button.only_selected_rows && selectedRowKeys.length === 0}
        onClick={() => callApiFunction({ subPath: button.path, body: { selected_pks: selectedRowKeys } })}
      />
    );
  });
  return extraButtons;
}