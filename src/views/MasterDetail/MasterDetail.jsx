import { useCallback, useEffect, useMemo, useState } from "react";
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
import { isEqual } from "lodash";
import {
    buildLayoutsData,
    buildSubmissionPayload,
    calculateFieldValues,
    filterFormStructure,
    flattenStructure,
    normalizeStructure,
} from "../../utils/fieldStructure";


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

    const normalizedHeaderStructure = useMemo(
        () => normalizeStructure(header_structure),
        [header_structure]
    );

    const headerFormStructure = useMemo(
        () => filterFormStructure(normalizedHeaderStructure),
        [normalizedHeaderStructure]
    );

    const detailTabs = useMemo(() => {
        if (!Array.isArray(detail_structure)) {
            return [];
        }
        return detail_structure.map((tab) => ({
            ...tab,
            structure: normalizeStructure(tab.structure),
            formStructure: filterFormStructure(tab.structure),
        }));
    }, [detail_structure]);

    const {
        mutate: saveRecord, isPending: isSavingLoading, isError: isSavingError, error: saveError
    } = useSaveRecord(`${path}/details/${recordParams.get(mdPk)}`, title, extraParams);


    const recomputeHeaderValues = useCallback((nextData) => {
        if (!normalizedHeaderStructure) {
            return;
        }

        const layoutsData = buildLayoutsData(detailTabs, nextData);
        const currentValues = headerForm.getFieldsValue(true);
        const computedValues = calculateFieldValues({
            fields: normalizedHeaderStructure,
            values: currentValues,
            layouts: layoutsData,
        });

        Object.entries(computedValues).forEach(([key, value]) => {
            const currentValue = headerForm.getFieldValue(key);
            if (!isEqual(currentValue, value)) {
                headerForm.setFieldValue(key, value);
            }
        });
    }, [detailTabs, headerForm, normalizedHeaderStructure]);

    // Initial data
    useEffect(() => {
        if (header_data && detailTabs.length) {
            Object.keys(header_data).forEach(key => {
                if (dayjs(header_data[key], "YYYY-MM-DD").isValid()) {
                    headerForm.setFieldValue(key, dayjs(header_data[key], "YYYY-MM-DD"));
                } else {
                    headerForm.setFieldValue(key, header_data[key]);
                }

            });
            const newTabsData = {};
            detailTabs.forEach(tab => {
                newTabsData[tab.name] = tab.data || [];
            });
            setData(newTabsData);
            recomputeHeaderValues(newTabsData);
        } else {
            headerForm.resetFields();
            detailsForm.resetFields();
        }
    }, [detailTabs, detailsForm, headerForm, header_data, recomputeHeaderValues]);



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

        const layoutsData = buildLayoutsData(detailTabs, data);

        const headerPayload = buildSubmissionPayload({
            fields: normalizedHeaderStructure,
            values: formattedValues,
            layouts: layoutsData,
        });

        if (header_pk && formattedValues[header_pk] !== undefined) {
            headerPayload[header_pk] = formattedValues[header_pk];
        }

        const detailPayload = detailTabs.reduce((acc, tab) => {
            const tabData = data[tab.name] ?? [];
            acc[tab.name] = Array.isArray(tabData)
                ? tabData.map((row) =>
                    buildSubmissionPayload({ fields: tab.structure, values: row })
                )
                : [];
            return acc;
        }, {});

        const body = {
            ...headerPayload,
            ...detailPayload,
        };

        saveRecord(body, {
            onSuccess: (response) => {
                setRecordParams({ [mdPk]: (response && response.header_data[mdPk]) ? response.header_data[mdPk] : "nuevo" });
            }
        });

    };

    // Tabs handler
    useEffect(() => {
        if (detailTabs.length) {
            setSelectedTab(detailTabs[0]?.name);
        }
    }, [detailTabs])

    useEffect(() => {
        if (!detailTabs.length) {
            return;
        }
        recomputeHeaderValues(data);
    }, [data, detailTabs, recomputeHeaderValues])

    const handleSelectedTab = (tab) => {
        setSelectedTab(tab);
    }

    const handleAddItem = (item) => {
        const tabSelected = detailTabs.find(tab => tab.name === selectedTab);
        if (!tabSelected) {
            return;
        }

        const computedValues = calculateFieldValues({
            fields: tabSelected.structure,
            values: item,
        });

        const flatFields = flattenStructure(tabSelected.structure);

        const rowValues = { ...item, ...computedValues };

        flatFields.forEach((field) => {
            if (field.field_show && Array.isArray(field.options)) {
                const fieldName = field.field ?? field.name;
                const selectedValue = rowValues[fieldName];
                const match = field.options.find((opt) => {
                    const optionValue = opt?.value ?? opt?.id ?? opt?.key ?? opt;
                    return optionValue === selectedValue;
                });
                if (match) {
                    rowValues[field.field_show] =
                        match?.label ?? match?.text ?? match?.name ?? match?.nombre ?? match?.value ?? match;
                }
            }
        });

        const tabData = data[selectedTab] ?? [];
        const newTabData = [...tabData, rowValues];
        const nextData = { ...data, [selectedTab]: newTabData };
        setData(nextData);
        recomputeHeaderValues(nextData);
        detailsForm.resetFields();
    };

    const handleEditItem = (itemPk, insertFields = false) => {
        const tabSelected = detailTabs.find(tab => tab.name === selectedTab);
        if (!tabSelected) {
            return;
        }

        const currentTabData = data[selectedTab] ?? [];
        const currentItem = currentTabData.find(it => it[tabSelected.pk] === itemPk);
        const newTabData = currentTabData.filter(it => it[tabSelected.pk] !== itemPk);
        const nextData = { ...data, [selectedTab]: newTabData };
        setData(nextData);
        recomputeHeaderValues(nextData);
        if (insertFields === true && currentItem) {
            detailsForm.setFieldsValue({
                ...currentItem,
            });
        }
    };

    const handleRemoveItem = (item, items) => {
        const tabSelected = detailTabs.find(tab => tab.name === selectedTab);
        if (!tabSelected) {
            return;
        }

        const currentTabData = data[selectedTab] ?? [];
        let newTabData = [];
        if (items && items.length > 0) {
            newTabData = currentTabData.filter(it => {
                return !items.includes(it[tabSelected.pk]);
            });
        } else if (item) {
            newTabData = currentTabData.filter(it => it[tabSelected.pk] !== item[tabSelected.pk]);
        } else {
            newTabData = currentTabData;
        }
        const nextData = { ...data, [selectedTab]: newTabData };
        setData(nextData);
        recomputeHeaderValues(nextData);
    };

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
                        fields={headerFormStructure}
                        flex={true}
                        onFinish={handleSave}
                        hiddenFields={[header_pk, ...(hidden_fields ?? [])].filter(Boolean)}
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
                    activeKey={selectedTab}
                    items={detailTabs.map(tab => {
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
                                            fields={tab.formStructure}
                                            onFinish={handleAddItem}
                                            hiddenFields={tab.hide_detail_fields}
                                        />
                                        <AntTable
                                            data={data[tab.name] ?? []}
                                            columns={makeColumns({
                                                pk: tab.pk,
                                                title: tab.label,
                                                form: detailsForm,
                                                remove: handleRemoveItem,
                                                setEditing: handleEditItem,
                                                setIsModalOpen: (e) => { },
                                                fields_structure: tab.structure,
                                                tableData: data[tab.name] ?? [],
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
