import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('Option 3', '3', <ContainerOutlined />),
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Option 7', '7'),
    getItem('Option 8', '8'),
  ]),
  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
  ]),
];
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div
    className='flex flex-col w-auto h-full pt-2 bg-slate-200'>
      <Button
        className={`flex flex-row items-center gap-2 min-w-full justify-center`}
        type="link"
        icon={<img className="w-10 h-10" src="./src/assets/logo.jpg" alt="Logo" />}
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16,
        }}
      >
       { !collapsed && <h1 className='text-gray-900'>XSalud</h1>}
      </Button>
      <Menu
        className='rounded bg-slate-200'
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="ligth"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};
export default Sidebar;