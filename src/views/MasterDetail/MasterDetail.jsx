import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AddButton, ClearButton, CloseButton, EditButton, PreviousButton, RemoveButton, SaveButton } from "../../components/Buttons/CustomButtons";
import { Divider, Popconfirm, Tabs } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useGetDetailsStructure, useSaveRecord } from "../../services/masterDetail";
import Spinner from "../../components/Loading/Spinner";
import AntTable from "../../components/Tables/AntTable";
import { makeColumns } from "../Master/master.base";
import CustomForm from "../../components/Forms/CustomForm";
import dayjs from "dayjs";


const MasterDetail = ({
    title, mdPk, path, headerForm, detailsForm,
    data, setData, selectedRows, setSelectedRows,
    getExtraActionButtons = null, extraParams,
    extraSaveAction = null,
    extraSaveValidation = null,
}) => {
    const [recordParams, setRecordParams] = useSearchParams();

    const [selectedTab, setSelectedTab] = useState();

    const {
        data: masterDetailStructure, isLoading: isStructureLoading, error, isError
    } = useGetDetailsStructure(`${path}/details/${recordParams.get(mdPk)}`, extraParams);

    const { header_pk, header_structure, header_data, detail_structure, hidden_fields } = masterDetailStructure ? masterDetailStructure : {};

    const {
        mutate: saveRecord, isPending: isSavingLoading, isError: isSavingError, error: saveError
    } = useSaveRecord(`${path}/details/${recordParams.get(mdPk)}`, title, extraParams);


    // Initial data
    useEffect(() => {
        if (header_data && detail_structure) {
            // Header Data Setter
            Object.keys(header_data).map(key => {
                if (dayjs(header_data[key], "YYYY-MM-DD").isValid()) {
                    headerForm.setFieldValue(key, dayjs(header_data[key], "YYYY-MM-DD"));
                } else {
                    headerForm.setFieldValue(key, header_data[key]);
                }

            })
            // Tabs Data Setter
            let newTabsData = {}
            detail_structure.map(tab => {
                newTabsData[tab.name] = tab.data || [];
            })
            setData(newTabsData);
        } else {
            headerForm.resetFields();
            detailsForm.resetFields();
        }
    }, [header_structure, detail_structure])



    // Header Handler
    const handleSave = (values) => {
        const formattedValues = Object.keys(values).reduce((acc, key) => {
            if (dayjs.isDayjs(values[key])) {
                acc[key] = dayjs(values[key]).format('YYYY-MM-DD');
            } else {
                acc[key] = values[key];
            }
            return acc;
        }, {});

        const body = {
            ...formattedValues,
            ...data,
        }

        saveRecord(body, {
            onSuccess: (response) => {
                setRecordParams({ [mdPk]: (response && response.header_data[mdPk]) ? response.header_data[mdPk] : "nuevo" });
            }
        })

    }

    // Tabs handler
    useEffect(() => {
        if (detail_structure) {
            setSelectedTab(detail_structure[0].name);
        }
    }, [detail_structure])

    const handleSelectedTab = (tab) => {
        setSelectedTab(tab);
    }

    const handleAddItem = (item) => {
        const tabSelectedStructure = detail_structure.find(tab => tab.name === selectedTab).structure;
        tabSelectedStructure.map(it => {
            if (it.type === "select") {
                item[it.field_show] = it.options.find((opt => opt.value === item[it.name]))?.label
            }
        })
        const newTabData = [...data[selectedTab], item]
        setData({ ...data, ...{ [selectedTab]: newTabData } });
        detailsForm.resetFields();
    }

    const handleEditItem = (itemPk, insertFields = false) => {
        const tabSelectedStructure = detail_structure.find(tab => tab.name === selectedTab);
        const currentItem = data[selectedTab].find(it => it[tabSelectedStructure.pk] === itemPk);
        const newTabData = data[selectedTab].filter(it => it[tabSelectedStructure.pk] !== itemPk);
        setData({ ...data, ...{ [selectedTab]: newTabData } });
        if (insertFields === true) {
            detailsForm.setFieldsValue({
                ...currentItem,
            });
        }
    }

    const handleRemoveItem = (item, items) => {
        const tabSelectedStructure = detail_structure.find(tab => tab.name === selectedTab);
        let newTabData = [];
        if (items && items.length > 0) {
            newTabData = data[selectedTab].filter(it => {
                return !items.includes(it[tabSelectedStructure.pk])
            });
        } else {
            newTabData = data[selectedTab].filter(it => it[tabSelectedStructure.pk] !== item[tabSelectedStructure.pk]);
        }
        setData({ ...data, ...{ [selectedTab]: newTabData } });
    }

    const handleExit = () => {
        setRecordParams({});
        setSelectedRows([]);
        headerForm.resetFields();
        detailsForm.resetFields();
    }



    if (isStructureLoading || isSavingLoading) {
        return <Spinner />
    }

    if ((isError && error) | (isSavingError && saveError)) {
        return <></>
    }

    return (
        <div className="flex flex-col w-full h-full gap-2">
            {/* Buttons Section */}
            <div className="flex flex-row justify-between w-full gap-2 h-2/12">
                <div className="w-full">
                    <Divider
                        style={{ margin: "0px", padding: "0px" }}
                        orientation="left"
                    >
                        {title}
                    </Divider>
                </div>
                <div className="flex flex-row justify-end gap-1">
                    {extraSaveAction ?
                        <SaveButton size="default" onClick={() => extraSaveAction()} />
                        :
                        <Popconfirm
                            title="Está seguro de guardar? "
                            description={recordParams.get(mdPk) === "nuevo" ? "" : `Se sobreescribirán los cambios.`}
                            placement="left"
                            onConfirm={() => {
                                if (extraSaveValidation && !extraSaveValidation()) {
                                    return;
                                }
                                headerForm.submit()
                            }}
                            okButtonProps={{ type: "default", danger: true }}
                            okText="Si"
                            cancelText="No"
                        >
                            <SaveButton size="default" />
                        </Popconfirm>
                    }
                    {
                        getExtraActionButtons &&
                        getExtraActionButtons(header_data).map(extraActionButton => {
                            return extraActionButton;
                        })
                    }
                    <Popconfirm
                        title="Está seguro de retroceder? "
                        description={`Perderá todos los cambios no guardados.`}
                        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                        placement="left"
                        onConfirm={() => handleExit()}
                        okButtonProps={{ type: "default", danger: true }}
                        okText="Si"
                        cancelText="No"
                    >
                        <PreviousButton size="default" />
                    </Popconfirm>
                </div>
            </div>
            {/* HeadBoard */}
            <div className="flex flex-col w-full h-5/12">
                <div className="flex flex-wrap">
                    <CustomForm
                        form={headerForm}
                        fields={
                            Array.isArray(header_structure?.[0]) 
                                ? header_structure.map(arr => arr.filter(item => item.in_form))
                                : header_structure?.filter(item => item.in_form)
                        }
                        flex={true}
                        onFinish={handleSave}
                        hiddenFields={[header_pk]}
                    />
                </div>
            </div>
            {/* DetailsBoard */}
            <Divider
                style={{ margin: "0px", padding: "0px" }}
                orientation="left"
            >
                Detalle {title}
            </Divider>
            <div className="flex flex-row w-full h-5/12">
                {/* Buttons */}
                <div className="flex flex-col h-full gap-1 pr-3">
                    <AddButton
                        onClick={() => detailsForm.submit()}
                    />
                    <EditButton
                        title={`Editar seleccionado`}
                        onClick={() => { selectedRows.length === 1 && handleEditItem(selectedRows[0], true) }}
                    />
                    <Popconfirm
                        title="Cuidado!!!"
                        description={`Está seguro de eliminar ${selectedRows.length > 1 ? "los detalles seleccionados" : "el detalle seleccionado"}?`}
                        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                        placement="left"
                        onConfirm={() => { selectedRows.length > 0 && handleRemoveItem(null, selectedRows) }}
                        okButtonProps={{ type: "default", danger: true }}
                        okText="Si"
                        cancelText="No"
                    >
                        <RemoveButton title={`Eliminar seleccionados`} />
                    </Popconfirm>
                    <Divider style={{ margin: "5px 0 5px 0", padding: "0px" }} />
                    <ClearButton onClick={() => detailsForm.resetFields()} />
                </div>
                <Tabs 
                    className="w-full"
                    type="card"
                    onChange={handleSelectedTab}
                    defaultActiveKey={selectedTab}
                    items={detail_structure.map(tab => {
                        return {
                            key: tab.name,
                            label: tab.label,
                            children: (
                                <>
                                    {/* Form / Table */}
                                    <div className="flex flex-col h-full gap-1">
                                        <CustomForm
                                            flex={true}
                                            form={detailsForm}
                                            fields={tab.structure?.filter(item => item.in_form)}
                                            onFinish={handleAddItem}
                                            hiddenFields={tab.hide_detail_fields}
                                        />
                                        <AntTable
                                            data={data[selectedTab]}
                                            columns={makeColumns({
                                                pk: tab.pk,
                                                title: tab.label,
                                                form: detailsForm,
                                                remove: handleRemoveItem,
                                                setEditing: handleEditItem,
                                                setIsModalOpen: (e) => { },
                                                fields_structure: tab.structure,
                                                getExtraActions: (e) => { },
                                                // fromMasterDetail: true,
                                            })}
                                            total={false}
                                            pagination={false}
                                            selectedRowKeys={selectedRows}
                                            setRowSelection={setSelectedRows}
                                        />
                                    </div>
                                </>
                            )
                        }
                    })}
                />
            </div>
        </div>
    )
}


export default MasterDetail;
