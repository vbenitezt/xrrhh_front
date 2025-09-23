import { useEffect, useState } from "react";
import useTablePagination from "../../common/store/tablePaginationStore";
import CustomForm from "../../components/Forms/CustomForm";
import BaseModal from "../../components/Modals/BaseModal";
import FlexColumn from "../../components/Structure/FlexColumn";
import AntTable from "../../components/Tables/AntTable";
import { Form } from "antd";
import Spinner from "../../components/Loading/Spinner";
import { makeColumns } from "./master.base";
import {
  useDeleteRecord,
  useGetPaginatedRecords,
  useSaveRecord,
} from "../../services/master";

const Master = ({
  pk, path, title, headTitle, getExtraActions, customAddingAction = null,
  customEditingAction = null, fromMasterDetail = false, selectedRowKeys = null,
  setSelectedRowKeys = null, extraFormItems = [], extraButtons = [],
  disableCreation = false, disableEdition = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const { tablePagination, setTablePagination } = useTablePagination();

  const [form] = Form.useForm();

  const { data: response, isFetching } = useGetPaginatedRecords(path);

  const { data, form: fields_structure } = response ? response : [];

  const { mutate: save, isPending: isSaving } = useSaveRecord(path, title);
  const { mutate: remove, isPending: isRemoving } = useDeleteRecord(
    path,
    title
  );

  useEffect(() => {
    if (!tablePagination.sorter.field) {
      setTablePagination({
        ...tablePagination,
        sorter: {
          ...tablePagination.sorter,
          field: pk,
        },
      });
    }
  }, []);

  const onCancel = () => {
    form.resetFields();
    setEditing(false);
    setIsModalOpen(false);
  };

  const handleSubmit = (d) => {
    const cuerpo = {
      ...d,
      ...(editing ? { [pk]: editing } : {}),
    };

    if (form.isFieldsTouched()) {
      save(
        cuerpo,
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditing(null);
            form.resetFields();
          }
        }
      )
    }

  };

  if (isFetching || isSaving || isRemoving) {
    return <Spinner />;
  }

  return (
    <FlexColumn>
      <BaseModal
        isModalOpen={isModalOpen}
        hasButton={!disableCreation}
        headLabel={headTitle}
        setIsModalOpen={customAddingAction ? customAddingAction : setIsModalOpen}
        title={`${editing ? "Editar" : "Crear"} ${title}`}
        text={`Agregar ${title}`}
        width={600}
        headTitle={headTitle}
        extraButtons={extraButtons}
        component={
          <CustomForm
            className="mt-5"
            form={form}
            maxWidth={600}
            onFinish={handleSubmit}
            fields={fields_structure?.filter(item => item.in_form)}
            extraFormItems={extraFormItems}
          />
        }
        onOkText="Guardar"
        onOk={form.submit}
        onCancel={onCancel}
        isSaving={isSaving}
      />
      <AntTable
        columns={makeColumns({
          pk,
          title,
          form,
          remove,
          setEditing: customEditingAction ? customEditingAction : setEditing,
          setIsModalOpen,
          fields_structure,
          getExtraActions,
          fromMasterDetail,
          disableEdition,
        })}
        data={data}
        columnKey={pk}
        selectedRowKeys={selectedRowKeys && selectedRowKeys}
        setRowSelection={setSelectedRowKeys && setSelectedRowKeys}
      />
    </FlexColumn>
  );
};

export default Master;
