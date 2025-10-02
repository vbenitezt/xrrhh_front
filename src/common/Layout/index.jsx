import React, { useEffect, useMemo, useState } from "react";
import {
  MoonOutlined,
  SunOutlined,
  LogoutOutlined,
  MenuOutlined,
  SyncOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  Typography,
  Select,
  Drawer,
  Input,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { useThemeStore } from "../store/themeStore";
import { CircleButton } from "../../components/Buttons/CustomButtons";
import { useGlobalFilterStore } from "../store/globalFiltersStore";
import { sidebarItems } from "./sidebar.base";
import { useMenuStore } from "../store/menuStore";
import { useLogoutMutate } from "../../services/auth";

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Layer = ({ children }) => {

  const navigate = useNavigate();

  const { theme: currentTheme, changeTheme } = useThemeStore();
  const { selectedCompany, setSelectedCompany, search, setSearch } = useGlobalFilterStore();
  const { profile } = useAuthStore();
  const { collapsed, setCollapsed } = useMenuStore();

  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (profile?.companies && profile?.companies?.length === 1) {
      setSelectedCompany(profile?.companies[0]?.value)
    }
  }, [profile])

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { mutate: logoutMutate, isPending: logoutIsLoading } = useLogoutMutate();

  const items = [
    {
      label: (

        <div className="flex gap-2 justify-center items-center">
          <p className="text-center">{profile?.desc_user}</p>
          <CircleButton
            type="default"
            icon={currentTheme === "dark" ? <SunOutlined /> : <MoonOutlined />}
            onClick={() => changeTheme()}
          />
        </div>

      ),
      key: "0",
    },
    {
      type: "divider",
    },
    profile?.is_superuser && window.location.hostname.includes("dev") &&
    {
      label: "Herramientas",
      onClick: () => {
        navigate("/herramientas");
      },
      key: "3",
      icon: <ToolOutlined />
    },
    {
      label: "Cerrar Sesión",
      key: "4",
      onClick: () => {
        logoutMutate();
      },
      icon: <LogoutOutlined />
    },
  ];

  return (
    <Layout className="overflow-hidden w-screen h-screen">
      <Sider
        className="hidden h-full sm:block"
        style={{ background: colorBgContainer }}
        width={200}
        trigger={null}
        collapsed={collapsed}
      >
        <div className="flex flex-row gap-2 justify-center items-center mt-2 text-center">
          <Avatar
            className="w-8 h-8"
            src="/logo.jpg"
            alt="Logo"
            onClick={() => setCollapsed(!collapsed)}
          />
          {!collapsed && (
            <Title
              level={4}
              className="flex justify-center items-center mt-2 h-full text-center"
            >
              XRRHH
            </Title>
          )}
        </div>
        <AppMenu profile={profile} collapsed={collapsed} />
        <Drawer
          open={openDrawer}
          closable
          onClose={() => setOpenDrawer(false)}
          placement="left"
        >
          <AppMenu
            profile={profile}
            collapsed={false}
            onNavigate={() => setOpenDrawer(false)}
          />
        </Drawer>
      </Sider>
      <Layout className="w-screen h-screen">
        <Header
          style={{ background: colorBgContainer }}
          className="flex flex-row gap-2 justify-between items-center p-6 m-0 w-full"
        >
          <span className="block sm:hidden">
            <CircleButton onClick={() => setOpenDrawer(true)} icon={<MenuOutlined />} />
          </span>
          <div className="flex flex-col items-center w-full md:flex-row lg:justify-between">
            <Search
              placeholder="Buscar..."
              allowClear
              className="w-1/2 lg:w-1/4"
              onSearch={setSearch}
              defaultValue={search}
            // size="large"
            />
            {profile?.companies &&
              profile?.companies?.length > 1 ?
              <Select
                className="w-1/2 lg:w-1/4"
                allowClear
                defaultValue={selectedCompany}
                onChange={setSelectedCompany}
                options={profile?.companies}
              />
              : <div></div>
            }
          </div>
          <div className="flex flex-row gap-1">
            <Dropdown
              overlayStyle={{ justifyContent: "center" }}
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
                src={
                  profile?.photo_url &&
                  profile?.photo_url + `?${dayjs().format("YYYYMMDDHHmmssSSS")}`
                }
              >
                {logoutIsLoading ? <Spin /> : !profile?.photo_url &&
                  profile?.initials &&
                  profile?.initials}
              </Avatar>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="flex px-6 py-2 mx-6 my-2 flex-overflow-hidden"
          style={{
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Layout className="flex overflow-y-auto w-full h-full bg-transparent">
            {children}
          </Layout>
        </Content>
        <Footer className="text-center">
          XRRHH ©{new Date().getFullYear()} Desarrollado por Soluciones Spa
        </Footer>
      </Layout>
    </Layout>
  );
};

const AppMenu = ({ className, profile, collapsed, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const items = useMemo(() => sidebarItems({ profile }), [profile]);

  const findItemWithParents = useMemo(() => {
    const traverse = (menuItems = [], targetKey, parents = []) => {
      for (const item of menuItems) {
        if (item.key === targetKey) {
          return { item, parents };
        }

        if (item.children?.length) {
          const result = traverse(item.children, targetKey, [...parents, item.key]);
          if (result) {
            return result;
          }
        }
      }
      return null;
    };

    return traverse;
  }, []);

  useEffect(() => {
    const match = findItemWithParents(items, location.pathname);

    if (match?.item) {
      setSelectedKeys([match.item.key]);
      if (!collapsed) {
        setOpenKeys(match.parents);
      }
    } else {
      setSelectedKeys([]);
      if (!collapsed) {
        setOpenKeys([]);
      }
    }
  }, [collapsed, items, location.pathname, findItemWithParents]);

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
    }
  }, [collapsed]);

  const handleMenuClick = ({ key }) => {
    if (key) {
      navigate(key);
      if (typeof onNavigate === "function") {
        onNavigate();
      }
    }
  };

  const handleOpenChange = (keys) => {
    if (!collapsed) {
      setOpenKeys(keys);
    }
  };

  return (
    <Menu
      className={`overflow-y-auto h-[calc(100vh-100px)] ${className}`}
      mode="inline"
      selectedKeys={selectedKeys}
      openKeys={collapsed ? [] : openKeys}
      inlineCollapsed={collapsed}
      onOpenChange={handleOpenChange}
      onClick={handleMenuClick}
      style={{ borderInlineEnd: 0, background: "transparent" }}
      items={items}
    />
  )
}

export default Layer;
