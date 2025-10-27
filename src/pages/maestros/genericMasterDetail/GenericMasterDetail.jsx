import { useMemo, useState } from "react";
import { Form } from "antd";
import { useSearchParams } from "react-router-dom";
import Master from "../../../views/Master/Master";
import MasterDetail from "../../../views/MasterDetail/MasterDetail";
import { EditButton } from "../../../components/Buttons/CustomButtons";

const GenericMasterDetail = (
    {pk, path, title}
) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const codEmpleadoParam = searchParams.get(pk);

    // Estado necesario para MasterDetail
    const [headerForm] = Form.useForm();
    const [detailsForm] = Form.useForm();
    const [data, setData] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);

    // Botón extra para abrir el MasterDetail desde la grilla
    const getExtraActions = useMemo(() => (row) => {
        return [
            <EditButton
                key="open-md"
                title="Editar"
                size="small"
                type="text"
                onClick={() => setSearchParams({ [pk]: row[pk] })}
            />
        ];
    }, [setSearchParams]);

    // Cuando existe query param, renderizamos MasterDetail
    if (codEmpleadoParam) {
        return (
            <MasterDetail
                title={title}
                mdPk={pk}
                path={path}
                headerForm={headerForm}
                detailsForm={detailsForm}
                data={data}
                setData={setData}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                // GET estructura: /empleados/{cod_empleado}/master-detail
                // buildGetStructurePath={(basePath, id) => `empleados/${id}/master-detail`}
                // SAVE: POST /empleados/
                buildSavePath={() => `empleadoss`}
            />
        );
    }

    // Modo lista (GET all: /empleados/, SAVE: POST /empleados/, DELETE: DELETE /empleados/)
    return (
        <Master
            pk={pk}
            path={path}
            title={title}
            headTitle={`Maestro ${title}`}
            getExtraActions={getExtraActions}
            // Deshabilitar edición modal para fomentar uso del MasterDetail
            customAddingAction={()=> setSearchParams({ [pk]: -1 })}
            disableEdition={false}
        />
    );
}

export default GenericMasterDetail;