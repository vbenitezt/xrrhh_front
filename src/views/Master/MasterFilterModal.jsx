import { Modal } from "antd";
import useTablePagination from "../../common/store/tablePaginationStore";
import FlexForm from "../../components/Forms/FlexForm";

const MasterFilterModal = ({
  title = "Filtros",
  isModalOpen,
  setIsModalOpen,
  filterLayout,
  filtersForm
}) => {
  const { tablePagination, setTablePagination } = useTablePagination();

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const handleOnfinish = (values) => {
    setTablePagination({
      ...tablePagination,
      filters: values,
    });
    setIsModalOpen(false);
  };

  return (
    <Modal
      width={1000}
      style={{
        top: 30,
      }}
      title={title}
      destroyOnHidden
      open={isModalOpen}
      okText="Aceptar"
      cancelText="Cancelar"
      onOk={filtersForm.submit}
      onCancel={onCancel}
      okButtonProps={{
        className: "text-black",
        type: "default",
        htmlType: "submit",
      }}
      cancelButtonProps={{ danger: true, type: "default" }}
    >
      <FlexForm
        form={filtersForm}
        onFinish={handleOnfinish}
        fields={filterLayout?.map((filter) => {
          return {
            name: filter.name,
            label: filter.label,
            disabled: filter.disabled,
            type: ["date", "datetime"].includes(filter.type)
              ? "dateRange"
              : filter.type,
            options: filter.data?.map((it) => {
              return { value: it.cod, label: it.desc };
            }),
          };
        })}
      />
    </Modal>
  );
};

export default MasterFilterModal;
