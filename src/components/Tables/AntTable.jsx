import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Menu,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { FileExcelOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { isEqual } from "lodash";
import { formatNumber } from "../../utils/formatMoney";
import useTablePagination from "../../common/store/tablePaginationStore";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const OPERATION_LABELS = {
  contains: "Contiene:",
  eq: "Igual a:",
  gte: "Mayor o igual a:",
  lte: "Menor o igual a:",
  btw: "Entre:",
  btw: "Entre:",
};

const AntTable = ({
  columns = [],
  data = [],
  selectedRowKeys = [],
  setRowSelection = false,
  expandable = false,
  expandedRowRender = () => {
    return <></>;
  },
  loading = false,
  pagination = true,
  onDoubleClick = () => { },
  columnKey = false,
  total = true,
  exportExcel = null,
}) => {
  const { tablePagination, setTablePagination } = useTablePagination();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const hasActiveFilters = useMemo(() => {
    const entries = Object.values(tablePagination.filters ?? {});
    return entries.some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (value && typeof value === "object") {
        const descriptorValue = value.value ?? value;
        if (value.type === "number" || value.type === "date") {
          const range = descriptorValue ?? {};
          return Object.values(range).some(
            (item) => item !== undefined && item !== null && item !== ""
          );
        }
        return (
          descriptorValue !== undefined &&
          descriptorValue !== null &&
          descriptorValue !== ""
        );
      }
      return value !== undefined && value !== null && value !== "";
    });
  }, [tablePagination.filters]);

  useEffect(() => {
    if (searchedColumn) {
      const columnFilter = tablePagination.filters?.[searchedColumn];
      const hasColumnFilter = Array.isArray(columnFilter)
        ? columnFilter.length > 0
        : Boolean(columnFilter);

      if (!hasColumnFilter) {
      setSearchText("");
      setSearchedColumn("");
    }
    }
  }, [searchedColumn, tablePagination.filters]);

  const handleSearch = useCallback(
    (selectedKeys, confirm, dataIndex, options = {}) => {
      confirm();
      const descriptor = Array.isArray(selectedKeys)
        ? selectedKeys[0]
        : selectedKeys;

      if (options.skipHighlight) {
        setSearchText("");
        setSearchedColumn("");
        return;
      }

      const highlightValue =
        options.highlightValue ??
        (descriptor && typeof descriptor === "object"
          ? descriptor.value ?? ""
          : descriptor ?? "");

      setSearchText(highlightValue ?? "");
      setSearchedColumn(dataIndex);
    },
    []
  );

  const handleReset = useCallback(
    (clearFilters, confirm) => {
      clearFilters?.();
      confirm?.();
      setSearchText("");
      setSearchedColumn("");
    },
    []
  );

  const handleClearAllFilters = useCallback(() => {
    setTablePagination({
      ...tablePagination,
      filters: {},
      pagination: {
        ...tablePagination.pagination,
        current: 1,
      },
    });
    setSearchText("");
    setSearchedColumn("");
  }, [setTablePagination, tablePagination]);

  const sanitizeFilterDescriptor = useCallback((descriptor) => {
    if (!descriptor) {
      return null;
    }

    if (typeof descriptor !== "object") {
      if (descriptor === "" || descriptor === null || descriptor === undefined) {
        return null;
      }
      return {
        type: "text",
        operator: "contains",
        value: descriptor,
      };
    }

    const { type, value, operator } = descriptor;

    if (type === "text") {
      const stringValue = value ?? "";
      if (stringValue === "") {
        return null;
      }
      return {
        type: "text",
        operator: operator ?? "contains",
        value: stringValue,
      };
    }

    if (type === "select") {
      if (value === null || value === undefined || value === "") {
        return null;
      }
      return {
        type: "select",
        operator: operator ?? "eq",
        value,
      };
    }

    if (type === "number" || type === "date") {
      let from = null;
      let to = null;

      if (Array.isArray(value)) {
        [from, to] = value;
      } else if (value && typeof value === "object") {
        from = value.from ?? null;
        to = value.to ?? null;
      } else {
        if (operator === "lte") {
          to = value ?? null;
        } else {
          from = value ?? null;
        }
      }

      const hasFrom = from !== undefined && from !== null && from !== "";
      const hasTo = to !== undefined && to !== null && to !== "";

      if (!hasFrom && !hasTo) {
        return null;
      }

      const normalizedOperator = hasFrom && hasTo ? "btw" : hasFrom ? "gte" : "lte";

      const normalizedValue =
        normalizedOperator === "btw"
          ? [from, to]
          : hasFrom
          ? from
          : to;

      return {
        type,
        operator: normalizedOperator,
        value: normalizedValue,
      };
    }

    if (value === null || value === undefined || value === "") {
      return null;
    }

    return {
      type: type ?? "text",
      operator: operator ?? "contains",
      value,
    };
  }, []);

  const getColumnSearchProps = useCallback(
    (column) => {
      const {
        dataIndex,
        render: originalRender,
        filterMeta: providedFilterMeta,
        filterType: legacyFilterType,
        filterOptions: legacyFilterOptions = [],
      } = column;

      if (!dataIndex) {
        return {};
      }

      const filterMeta = {
        type: providedFilterMeta?.type ?? legacyFilterType ?? "text",
        operator:
          providedFilterMeta?.operator ??
          (legacyFilterType === "select" ? "eq" : "ilk"),
        options: providedFilterMeta?.options ?? legacyFilterOptions ?? [],
        format: providedFilterMeta?.format ?? "YYYY-MM-DD",
      };

      const {
        type: filterType = "text",
        operator: defaultOperator = "contains",
        options: filterOptions = [],
        format: dateFormat = "YYYY-MM-DD",
      } = filterMeta;

      const buildOperationLabel = (operator) =>
        OPERATION_LABELS[operator] ?? operator ?? "";

      const isTextFilter = filterType === "text";
      const isSelectFilter = filterType === "select";
      const isNumberFilter = filterType === "number";
      const isDateFilter = filterType === "date";

      return {
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys = [],
          confirm,
          clearFilters,
          close,
        }) => {
          const descriptor =
            Array.isArray(selectedKeys) && selectedKeys.length > 0
              ? typeof selectedKeys[0] === "object" && selectedKeys[0] !== null
                ? selectedKeys[0]
                : {
                    type: filterType,
                    operator: defaultOperator,
                    value: selectedKeys[0],
                  }
              : null;

          const ensureArrayKeys = (keys) =>
            Array.isArray(keys) ? keys : [];

          const buildSearchOptions = () =>
            filterType === "text"
              ? { highlightValue: descriptor?.value ?? "" }
              : { skipHighlight: true };

          const parseRangeDescriptor = (desc) => {
            if (!desc || (desc.type !== "number" && desc.type !== "date")) {
              return { from: null, to: null };
            }

            const rawValue = desc.value;
            if (Array.isArray(rawValue)) {
              return {
                from:
                  rawValue[0] !== undefined &&
                  rawValue[0] !== null &&
                  rawValue[0] !== ""
                    ? rawValue[0]
                    : null,
                to:
                  rawValue[1] !== undefined &&
                  rawValue[1] !== null &&
                  rawValue[1] !== ""
                    ? rawValue[1]
                    : null,
              };
            }

            if (rawValue && typeof rawValue === "object") {
              return {
                from:
                  rawValue.from !== undefined &&
                  rawValue.from !== null &&
                  rawValue.from !== ""
                    ? rawValue.from
                    : null,
                to:
                  rawValue.to !== undefined &&
                  rawValue.to !== null &&
                  rawValue.to !== ""
                    ? rawValue.to
                    : null,
              };
            }

            if (desc.operator === "gte") {
              return { from: rawValue ?? null, to: null };
            }

            if (desc.operator === "lte") {
              return { from: null, to: rawValue ?? null };
            }

            return { from: rawValue ?? null, to: null };
          };

          const applySearch = (options = {}) => {
            const keys = ensureArrayKeys(selectedKeys);
            if (!keys.length || !keys[0]) {
              handleReset(clearFilters, confirm);
              return;
            }

            handleSearch(keys, confirm, dataIndex, {
              ...buildSearchOptions(),
              ...options,
            });
          };

          const applyFilterWithoutClosing = () => {
            const keys = ensureArrayKeys(selectedKeys);
            if (!keys.length || !keys[0]) {
              return;
            }

            confirm({ closeDropdown: false });
            if (filterType === "text") {
              setSearchText(keys[0]?.value ?? "");
              setSearchedColumn(dataIndex);
            } else {
              setSearchText("");
              setSearchedColumn("");
            }
          };

          const operationLabel = buildOperationLabel(
            descriptor?.operator ?? defaultOperator
          );

          const handleTextChange = (value) => {
            const cleanedValue = value ?? "";
            if (!cleanedValue) {
              setSelectedKeys([]);
              return;
            }
            setSelectedKeys([
              {
                type: "text",
                operator: defaultOperator,
                value: cleanedValue,
              },
            ]);
          };

          const handleSelectChange = (value) => {
            if (value === undefined || value === null || value === "") {
              setSelectedKeys([]);
              return;
            }
            setSelectedKeys([
              {
                type: "select",
                operator: defaultOperator || "eq",
                value,
              },
            ]);
          };

          const currentNumberRange =
            descriptor?.type === "number"
              ? parseRangeDescriptor(descriptor)
              : { from: null, to: null };

          const updateNumberRange = (partial) => {
            const nextRange = {
              from:
                partial.from !== undefined
                  ? partial.from
                  : currentNumberRange.from ?? null,
              to:
                partial.to !== undefined
                  ? partial.to
                  : currentNumberRange.to ?? null,
            };

            const hasFrom =
              nextRange.from !== undefined &&
              nextRange.from !== null &&
              nextRange.from !== "";
            const hasTo =
              nextRange.to !== undefined &&
              nextRange.to !== null &&
              nextRange.to !== "";

            if (!hasFrom && !hasTo) {
              setSelectedKeys([]);
              return;
            }

            const nextOperator =
              hasFrom && hasTo ? "btw" : hasFrom ? "gte" : "lte";

            const normalizedValue =
              nextOperator === "btw"
                ? [nextRange.from, nextRange.to]
                : hasFrom
                ? nextRange.from
                : nextRange.to;

            setSelectedKeys([
              {
                type: "number",
                operator: nextOperator,
                value: normalizedValue,
              },
            ]);
          };

          const currentDateRange =
            descriptor?.type === "date"
              ? parseRangeDescriptor(descriptor)
              : { from: null, to: null };

          const updateDateRange = (dates) => {
            if (!dates || dates.length === 0) {
              setSelectedKeys([]);
              return;
            }

            const [start, end] = dates;
            const from = start ? start.startOf("day").format(dateFormat) : null;
            const to = end ? end.endOf("day").format(dateFormat) : null;

            const hasFrom = Boolean(from);
            const hasTo = Boolean(to);

            if (!hasFrom && !hasTo) {
              setSelectedKeys([]);
              return;
            }

            const nextOperator = hasFrom && hasTo ? "btw" : hasFrom ? "gte" : "lte";

            const normalizedValue =
              nextOperator === "btw"
                ? [from, to]
                : hasFrom
                ? from
                : to;

            setSelectedKeys([
              {
                type: "date",
                operator: nextOperator,
                value: normalizedValue,
              },
            ]);
          };

          return (
            <div
              style={{
                padding: 8,
                minWidth: 240,
              }}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {isSelectFilter && (
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  placeholder={`Seleccionar ${column.title ?? dataIndex}`}
                  style={{ marginBottom: 8, display: "block" }}
                  value={descriptor?.value ?? undefined}
                  onChange={handleSelectChange}
                  options={filterOptions.map((option) => ({
                    label:
                      option?.label ??
                      option?.text ??
                      option?.name ??
                      option?.nombre ??
                      String(option?.value ?? option),
                    value: option?.value ?? option,
                  }))}
                />
              )}

              {isTextFilter && (
                <Input
                  ref={searchInput}
                  placeholder={`Buscar ${dataIndex}`}
                  value={descriptor?.value ?? ""}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onPressEnter={() => applySearch({})}
                  style={{
                    marginBottom: 8,
                    display: "block",
                  }}
                />
              )}

              {isNumberFilter && (
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <InputNumber
                    placeholder="Desde"
                    style={{ width: "100%" }}
                    value={currentNumberRange.from ?? null}
                    onChange={(value) => updateNumberRange({ from: value })}
                  />
                  <InputNumber
                    placeholder="Hasta"
                    style={{ width: "100%" }}
                    value={currentNumberRange.to ?? null}
                    onChange={(value) => updateNumberRange({ to: value })}
                  />
                </Space>
              )}

              {isDateFilter && (
                <DatePicker.RangePicker
                  style={{ width: "100%", marginBottom: 8 }}
                  value={[
                    currentDateRange.from ? dayjs(currentDateRange.from) : null,
                    currentDateRange.to ? dayjs(currentDateRange.to) : null,
                  ]}
                  onChange={updateDateRange}
                  allowClear
                />
              )}

              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 8 }}
              >
                Operación: {operationLabel}
              </Text>

              <Space>
                <Button
                  type="primary"
                  onClick={() => applySearch({})}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{
                    width: 90,
                  }}
                >
                  Buscar
                </Button>
                <Button
                  onClick={() => {
                    setSelectedKeys([]);
                    handleReset(clearFilters, confirm);
                  }}
                  size="small"
                  style={{
                    width: 90,
                  }}
                >
                  Limpiar
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={applyFilterWithoutClosing}
                >
                  Filtrar
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    close();
                  }}
                >
                  Cerrar
                </Button>
              </Space>
            </div>
          );
        },
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? "#1890ff" : undefined,
            }}
          />
        ),
        onFilterDropdownOpenChange: (visible) => {
          if (visible && isTextFilter) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        filteredValue: Array.isArray(tablePagination.filters?.[dataIndex])
          ? tablePagination.filters?.[dataIndex]
          : tablePagination.filters?.[dataIndex]
          ? [tablePagination.filters?.[dataIndex]]
          : null,
        render: (text, record, index) => {
          const rawText = text ?? "";
          const shouldHighlight = isTextFilter && searchedColumn === dataIndex;
          const highlightedValue = shouldHighlight ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={rawText ? rawText.toString() : ""}
            />
          ) : (
            rawText
          );

          if (typeof originalRender === "function") {
            return originalRender(highlightedValue, record, index);
          }

          return highlightedValue;
        },
      };
    },
    [
      handleReset,
      handleSearch,
      searchText,
      searchedColumn,
      tablePagination.filters,
    ]
  );

  const enhancedColumns = useMemo(
    () =>
      columns.map((col, index) => ({
        ...col,
        ...getColumnSearchProps(col),
        responsive: ["xs", "sm", "md", "lg", "xl"],
        key: col.key ?? index,
        align: col.align || "left",
        ellipsis: true,
        sorter: col.dataIndex && col.order !== false ? true : false,
        sortDirections: ["ascend", "descend"],
      })),
    [columns, getColumnSearchProps]
  );

  const handleContextMenu = (event) => {
    event.preventDefault();
    if (exportExcel) {
      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleMenuClick = (e) => {
    if (e.key === "export") {
      exportExcel();
    }
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleTableChange = (paginationConfig, filters, sorter) => {
    const sanitizedFilters = Object.entries(filters ?? {}).reduce(
      (acc, [key, value]) => {
        const descriptors = (Array.isArray(value) ? value : [])
          .map((item) => sanitizeFilterDescriptor(item))
          .filter(Boolean);

        if (descriptors.length) {
          acc[key] = descriptors;
        }

        return acc;
      },
      {}
    );

    const filtersChanged = !isEqual(
      sanitizedFilters,
      tablePagination.filters ?? {}
    );

    const nextPagination = {
      ...tablePagination.pagination,
      ...paginationConfig,
      current: filtersChanged ? 1 : paginationConfig?.current,
    };

    const normalizedSorter = Array.isArray(sorter) ? sorter[0] ?? {} : sorter ?? {};
    const hasSorter = normalizedSorter && Object.keys(normalizedSorter).length > 0;

    setTablePagination({
      pagination: nextPagination,
      filters: sanitizedFilters,
      sorter: hasSorter ? normalizedSorter : tablePagination.sorter,
    });
  };

  const handleClickOutside = useCallback(
    (event) => {
      const xTolerance = 200;
      const yTolerance = 50;

      const isOutsideX =
        event.clientX < contextMenu.x - xTolerance ||
        event.clientX > contextMenu.x + xTolerance;
      const isOutsideY =
        event.clientY < contextMenu.y - yTolerance ||
        event.clientY > contextMenu.y + yTolerance;
      if (isOutsideX || isOutsideY) {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    },
    [contextMenu]
  );

  useEffect(() => {
    if (!contextMenu.visible) {
      return;
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.visible, handleClickOutside]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      if (setRowSelection) {
        setRowSelection(keys);
      }
    }
    ,
  };

  return (
    <>
      {hasActiveFilters && (
        <div className="flex justify-end mb-2">
          <Button size="small" onClick={handleClearAllFilters}>
            Limpiar filtros
          </Button>
        </div>
      )}
      <div onContextMenu={handleContextMenu}>
        <Table
          // rootClassName="flex w-full min-h-full"
          columns={enhancedColumns}
          rowKey={(record) =>
            columnKey ? record[columnKey] : record[Object.keys(record)[0]]
          }
          rowSelection={setRowSelection ? rowSelection : false}
          rowClassName="text-xs cursor-pointer focus:bg-slate-400"
          onRow={(record, rowIndex) => {
            return {
              onClick: () => { }, // click row
              onDoubleClick: () => onDoubleClick(record, rowIndex), // double click row
              onContextMenu: () => { }, // right button click row
              onMouseEnter: () => { }, // mouse enter row
              onMouseLeave: () => { }, // mouse leave row
            };
          }}
          expandable={
            expandable
              ? {
                expandedRowRender,
                defaultExpandedRowKeys: ["0"],
              }
              : false
          }
          dataSource={data}
          pagination={pagination && tablePagination.pagination}
          size="small"
          loading={loading}
          bordered
          onChange={handleTableChange}
          scroll={{ x: "auto" }}
          footer={() => {
            if (total) {
              return (
                <div className="flex justify-end w-full p-0 -mb-2">
                  <Title level={5}>
                    Total: {formatNumber(tablePagination.pagination?.total)}
                  </Title>
                </div>
              );
            }
          }}
        />
      </div>
      {contextMenu.visible &&
        ReactDOM.createPortal(
          <Menu
            className="border rounded-md border-[#a7ebe2]"
            style={{
              position: "fixed",
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
              // background: "#a7ebe2"
            }}
            onClick={handleMenuClick}
            items={[
              {
                key: "export",
                label: "Exportar a excel",
                icon: <FileExcelOutlined />,
              },
            ]}
          />,
          document.body
        )}
    </>
  );
};

export default AntTable;
