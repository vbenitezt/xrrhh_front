import React from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, theme, Typography } from "antd";

const { Meta } = Card;
const { Title } = Typography;

const PlanCard = ({ plan, onClick = () => {}, selected = false }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const cardStyle = {
    cursor: "pointer",
    border: selected ? `2px solid ${colorPrimary}` : "1px solid #f0f0f0",
    boxShadow: selected ? `0 4px 8px rgba(${colorPrimary}, 0.5)` : "",
  };
  return (
    <Card
      hoverable
      style={cardStyle}
      onClick={() => onClick(plan)}
      className={`w-full p-2 lg:w-[32%]`}
      cover={
        <div className="flex flex-col w-full h-full p-3">
          <Title level={2}>{plan.desc_plan}</Title>
        </div>
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <Meta
        avatar={
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
        }
        title={`Valor: ${plan.value} UF`}
        description={`Hasta ${plan.companies_quantity} empresa y ${plan.users_quantity} usuarios`}
      />
    </Card>
  );
};

export default PlanCard;
