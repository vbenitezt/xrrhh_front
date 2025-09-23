import { useNavigate } from "react-router-dom";
import { Button, theme, Tooltip } from "antd";
import {
  QuestionOutlined,
  CloseOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  FileExcelOutlined,
  FileExcelFilled,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  ClearOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { TbSitemap } from "react-icons/tb";

export const CircleButton = ({ icon = <QuestionOutlined />, title = "", ...props }) => {
  return (
    <Tooltip title={title}>
      <Button
        shape="circle"
        type="default"
        size="default"
        icon={icon}
        {...props}
      />
    </Tooltip>
  );
};

export const AddButton = ({
  title = "Agregar",
  icon = <PlusOutlined />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton type="primary" icon={icon} {...props} />
    </Tooltip>
  );
};

export const ImportButton = ({
  title = "Importar",
  icon = <FileExcelOutlined />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton icon={icon} {...props} />
    </Tooltip>
  );
};

export const ExportButton = ({
  title = "Exportar",
  icon = <FileExcelFilled />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton icon={icon} {...props} />
    </Tooltip>
  );
};  

export const PrintPDFButton = ({
  title = "Imprimir",
  icon = <FilePdfOutlined />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton icon={icon} {...props} />
    </Tooltip>
  );
};

export const CloseButton = ({
  title = "Cancelar",
  icon = <CloseOutlined />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton danger icon={icon} {...props} />
    </Tooltip>
  );
};

export const ClearButton = ({
  title = "Limpiar",
  icon = <ClearOutlined />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton danger icon={icon} {...props} />
    </Tooltip>
  );
};

export const RemoveButton = ({
  title = "Quitar",
  icon = <DeleteOutlined />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton danger icon={icon} {...props} />
    </Tooltip>
  );
};

export const NextButton = ({
  title = "Siguiente",
  icon = <ArrowRightOutlined />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton icon={icon} {...props} />
    </Tooltip>
  );
};

export const RelationButton = ({
  title = "Relaciones",
  icon = <TbSitemap size="1.3em" />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton icon={icon} {...props} />
    </Tooltip>
  );
};

export const EditButton = ({
  title = "Editar",
  icon = <EditOutlined />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton icon={icon} {...props} />
    </Tooltip>
  );
};

export const NewButton = ({
  title = "Nuevo",
  icon = <HiOutlineDocumentPlus size="1.3em" />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton icon={icon} {...props} />
    </Tooltip>
  );
};

export const SendMailButton = ({
  title = "Enviar",
  icon = <MailOutlined />,
  ...props
}) => {
  return (
    <Tooltip title={title}>
      <CircleButton icon={icon} {...props} />
    </Tooltip>
  );
};

export const PreviousButton = ({
  title = "Anterior",
  onClick = null,
  icon = <ArrowLeftOutlined />,
  ...props
}) => {
  const navigate = useNavigate();
  if (!onClick) {
    onClick = () => navigate(-1);
  }
  return (
    <Tooltip title={title}>
      <CircleButton onClick={onClick} icon={icon} {...props} />
    </Tooltip>
  );
};

export const SaveButton = ({ title = "Guardar", ...props }) => {
  const {
    token: { colorSuccess, colorSuccessBg },
  } = theme.useToken();
  return (
    <Tooltip title={title}>
      <CircleButton
        type="primary"
        style={{
          background: colorSuccess,
          "--hover-background": colorSuccessBg,
          "--hover-opacity": 0.5,
        }}
        icon={<SaveOutlined />}
        {...props}
      />
    </Tooltip>
  );
};
