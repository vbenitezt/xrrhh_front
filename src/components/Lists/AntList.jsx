import { Avatar, List } from "antd";

const AntList = ({ items }) => {
  return (
    <List>
      {items &&
        items.map((item, idx) => (
          <List.Item actions={item.actions} key={idx}>
            <List.Item.Meta
              avatar={<Avatar src={item.logo_url} alt="Logo"/>}
              title={item.name}
              description={item.desc}
            />
          </List.Item>
        ))}
    </List>
  );
};

export default AntList
