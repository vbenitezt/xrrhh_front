import Master from "../../../views/Master/Master";


const GenericMaster = ({pk, path, title, title_plural}) => {
    return (
        <Master
            pk={pk}
            path={path}
            title={title}
            headTitle={title_plural}
        />
    )
}


export default GenericMaster;