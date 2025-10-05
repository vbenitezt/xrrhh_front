import { useEffect, useMemo, useState } from "react";
import useTablePagination from "../../common/store/tablePaginationStore";
import CustomForm from "../../components/Forms/CustomForm";
import BaseModal from "../../components/Modals/BaseModal";
import FlexColumn from "../../components/Structure/FlexColumn";
import AntTable from "../../components/Tables/AntTable";
import { Form } from "antd";
import Spinner from "../../components/Loading/Spinner";
import { makeColumns } from "./master.base";
import { buildSubmissionPayload, filterFormStructure, normalizeStructure } from "../../utils/fieldStructure";
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

  const { data, form: rawFieldsStructure } = response ? response : {};

  const normalizedFieldsStructure = useMemo(
    () => normalizeStructure(rawFieldsStructure),
    [rawFieldsStructure]
  );

  const formStructure = useMemo(
    () => filterFormStructure(normalizedFieldsStructure),
    [normalizedFieldsStructure]
  );

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
    const payload = buildSubmissionPayload({
      fields: normalizedFieldsStructure,
      values: {
        ...d,
        ...(editing ? { [pk]: editing } : {}),
      },
    });

    if (editing && payload[pk] === undefined) {
      payload[pk] = editing;
    }

    if (form.isFieldsTouched()) {
      save(
        payload,
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditing(null);
            form.resetFields();
          }
        }
      );
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
        title={`${editing ? "Editar (" + editing + ")" : "Crear"} ${title}`}
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
            fields={formStructure}
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
          fields_structure: normalizedFieldsStructure,
          tableData: data,
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
