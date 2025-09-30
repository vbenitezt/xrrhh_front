import React, { useEffect } from "react";
import { Modal, Typography } from "antd";
import { AddButton } from "../Buttons/CustomButtons";
import { v4 } from "uuid";


const { Title } = Typography;

const BaseModal = ({
  title,
  headLabel,
  text,
  component = <></>,
  onOk = () => { },
  onOkText = "Aceptar",
  onCancelText = "Cancelar",
  onCancel = () => { },
  isModalOpen,
  setIsModalOpen,
  extraButtons = [],
  filters = <></>,
  width = 520,
  hasButton = true,
  isSaving = false,
  ...props
}) => {
  useEffect(() => { }, [isModalOpen]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-row justify-between w-full gap-1">
        {headLabel && <Title level={4}>{headLabel}</Title>}
        {hasButton &&
          <div key={v4()} className="flex flex-row items-center justify-start gap-1">
            <AddButton disabled={isSaving} onClick={showModal} title={text} />
            {extraButtons.map(button => button)}
          </div>
        }
        {filters}
      </div>
      <Modal
        {...props}
        width={width}
        title={title}
        okText={onOkText}
        cancelText={onCancelText}
        destroyOnHidden
        okButtonProps={{
          htmlType: "submit",
          type: "default"
        }}
        cancelButtonProps={{ danger: true }}
        open={isModalOpen}
        onOk={onOk}
        onCancel={onCancel}
      >
        {component}
      </Modal>
    </>
  );
};
export default BaseModal;
