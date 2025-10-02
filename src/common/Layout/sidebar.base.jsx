import getRoutes from "../../routes";

const renderIcon = (IconComponent) => {
  if (!IconComponent) return undefined;
  return <IconComponent size="1.4em" />;
};

const buildMenuItems = (items = []) =>
  items
    .filter(Boolean)
    .map((route, index) => {
      if (route.type === "menu" && route.insideBar && route.children?.length) {
        const key = route.key ?? `menu-${index}`;
        return {
          key,
          icon: renderIcon(route.icon),
          label: route.label,
          children: buildMenuItems(route.children),
        };
      }

      if (route.type === "route" && route.insideBar) {
        return {
          key: route.path,
          icon: renderIcon(route.icon),
          label: route.label,
        };
      }

      if (route.children?.length) {
        return buildMenuItems(route.children);
      }

      return null;
    })
    .flat()
    .filter(Boolean);

export const sidebarItems = ({ profile }) => {
  const routes = getRoutes({ profile });
  return buildMenuItems(routes);
};