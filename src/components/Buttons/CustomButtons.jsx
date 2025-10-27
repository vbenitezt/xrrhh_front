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

export const CircleButton = ({ icon = <QuestionOutlined />, title = "", danger = false, ...props }) => {
  return (
    <Tooltip title={title} placement="top" getPopupContainer={(trigger) => { return trigger.body }}>
      <Button
        shape="circle"
        type="default"
        size="default"
        icon={icon}
        {...(danger ? { danger: true } : {})}
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
    <CircleButton type="primary" icon={icon} title={title} {...props} />
  );
};

export const ImportButton = ({
  title = "Importar",
  icon = <FileExcelOutlined />,
  ...props
}) => {
  return (
    <CircleButton icon={icon} title={title} {...props} />
  );
};

export const ExportButton = ({
  title = "Exportar",
  icon = <FileExcelFilled />,
  ...props
}) => {
  return (
    <CircleButton icon={icon} title={title} {...props} />
  );
};

export const PrintPDFButton = ({
  title = "Imprimir",
  icon = <FilePdfOutlined />,
  ...props
}) => {
  return (
    <CircleButton icon={icon} title={title} {...props} />

  );
};

export const CloseButton = ({
  title = "Cancelar",
  icon = <CloseOutlined />,
  ...props
}) => {
  return (
    <CircleButton danger icon={icon} title={title} {...props} />
  );
};

export const ClearButton = ({
  title = "Limpiar",
  icon = <ClearOutlined />,
  ...props
}) => {
  return (
    <CircleButton danger icon={icon} title={title} {...props} />
  );
};

export const RemoveButton = ({
  title = "Quitar",
  icon = <DeleteOutlined />,
  ...props
}) => {
  return (
    <CircleButton danger icon={icon} title={title} {...props} />
  );
};

export const NextButton = ({
  title = "Siguiente",
  icon = <ArrowRightOutlined />,
  ...props
}) => {
  return (
    <CircleButton icon={icon} title={title} {...props} />
  );
};

export const RelationButton = ({
  title = "Relaciones",
  icon = <TbSitemap size="1.3em" />,
  ...props
}) => {
  return (
    <CircleButton icon={icon} title={title} {...props} />
  );
};

export const EditButton = ({
  title = "Editar",
  icon = <EditOutlined />,
  ...props
}) => {
  return (
    <CircleButton icon={icon} title={title} {...props} />
  );
};

export const NewButton = ({
  title = "Nuevo",
  icon = <HiOutlineDocumentPlus size="1.3em" />,
  ...props
}) => {
  return (
    <CircleButton icon={icon} title={title} {...props} />
  );
};

export const SendMailButton = ({
  title = "Enviar",
  icon = <MailOutlined />,
  ...props
}) => {
  return (
    <CircleButton icon={icon} title={title} {...props} />
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
    <CircleButton onClick={onClick} icon={icon} title={title} {...props} />
  );
};

export const SaveButton = ({ title = "Guardar", ...props }) => {
  const {
    token: { colorSuccess, colorSuccessBg },
  } = theme.useToken();
  return (
    <CircleButton
      type="primary"
      style={{
        background: colorSuccess,
        "--hover-background": colorSuccessBg,
        "--hover-opacity": 0.5,
      }}
      icon={<SaveOutlined />}
      title={title}
      {...props}
    />
  );
};
