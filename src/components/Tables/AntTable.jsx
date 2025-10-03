import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Button, Input, Menu, Space, Table, Typography } from "antd";
import { FileExcelOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { isEqual } from "lodash";
import { formatNumber } from "../../utils/formatMoney";
import useTablePagination from "../../common/store/tablePaginationStore";

const { Title } = Typography;

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

  const hasActiveFilters = useMemo(
    () => Object.keys(tablePagination.filters ?? {}).length > 0,
    [tablePagination.filters]
  );

  useEffect(() => {
    if (
      searchedColumn &&
      !(tablePagination.filters?.[searchedColumn]?.length > 0)
    ) {
      setSearchText("");
      setSearchedColumn("");
    }
  }, [searchedColumn, tablePagination.filters]);

  const handleSearch = useCallback(
    (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0] ?? "");
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

  const getColumnSearchProps = useCallback(
    (dataIndex) => {
      if (!dataIndex) {
        return {};
      }

      return {
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          close,
        }) => (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Buscar ${dataIndex}`}
              value={selectedKeys[0] ?? ""}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Buscar
              </Button>
              <Button
                onClick={() =>
                  clearFilters && handleReset(clearFilters, confirm)
                }
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
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0] ?? "");
                  setSearchedColumn(dataIndex);
                }}
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
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? "#1890ff" : undefined,
            }}
          />
        ),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        filteredValue: tablePagination.filters?.[dataIndex] ?? null,
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            text
          ),
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
        ...getColumnSearchProps(col.dataIndex),
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
        const filteredValues = Array.isArray(value)
          ? value.filter(
              (item) => item !== undefined && item !== null && item !== ""
            )
          : [];

        if (filteredValues.length) {
          acc[key] = filteredValues;
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
