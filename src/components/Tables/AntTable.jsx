import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Table, Typography, Menu } from "antd";
import { formatNumber } from "../../utils/formatMoney";
import { FileExcelOutlined } from "@ant-design/icons";
import useTablePagination from "../../common/store/tablePaginationStore";

const { Title } = Typography;

const makeColumns = (columns) => {
  const modifiedColumns = columns.map((col, i) => ({
    ...col,
    responsive: ["xs", "sm", "md", "lg", "xl"],
    key: i,
    align: col.align || "left",
    // width: 200,
    ellipsis: true,
    sorter: col.dataIndex && col.order !== false ? true : false,
    sortDirections: ["ascend", "descend"],
  }));

  return modifiedColumns;
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

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

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

  const handleTableChange = (pagination, _, sorter) => {
    setTablePagination({
      pagination,
      filters: tablePagination.filters,
      sorter: Object.keys(sorter).length > 0 ? sorter : tablePagination.sorter,
    });
  };

  useEffect(() => { }, [tablePagination]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleClickOutside = (event) => {
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
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setRowSelection(keys)
    }
    ,
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>
        <Table
          // rootClassName="flex w-full min-h-full"
          columns={makeColumns(columns)}
          rowKey={(record) =>
            columnKey ? record[columnKey] : record[Object.keys(record)[0]]
          }
          rowSelection={setRowSelection ? rowSelection : false}
          rowClassName="text-xs cursor-pointer focus:bg-slate-400"
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => { }, // click row
              onDoubleClick: () => onDoubleClick(record, rowIndex), // double click row
              onContextMenu: (event) => { }, // right button click row
              onMouseEnter: (event) => { }, // mouse enter row
              onMouseLeave: (event) => { }, // mouse leave row
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
