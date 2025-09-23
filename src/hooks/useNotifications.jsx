import { App } from "antd";
import { useState } from "react";
import { v4 } from "uuid";
import { LoadingOutlined } from '@ant-design/icons';

const useNotification = () => {
  const { notification } = App.useApp();
  const [key] = useState(v4())
  const notify = (
    message = "Dummy Message",
    type = "success",
    description = "",
    placement = "topRight",
  ) => {
    switch (type) {
      case "success":
        notification.success({
          key,
          message,
          description,
          placement,
        });
        break;
      case "error":
        notification.error({
          key,
          message,
          description,
          placement,
        });
        break;
      case "info":
        notification.info({
          key,
          message,
          description,
          placement,
        });
        break;
      case "loading":
        notification.info({
          key,
          message,
          description,
          placement,
          icon: <LoadingOutlined />,
        });
        break;
      default:
        notification.success({
          key,
          message,
          description,
          placement,
        });
        break;
    }
    return key;
  };
  return {
    notify,
    key,
  };
};

export default useNotification;
