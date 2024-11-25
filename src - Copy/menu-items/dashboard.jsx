// assets
import { DashboardOutlined, CarOutlined, MessageOutlined, PlusOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  CarOutlined,
  MessageOutlined,
  PlusOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigācija',
  type: 'group',
  children: [
    // {
    //   id: 'dashboard',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/dashboard/default',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'parts',
      title: 'Rezerves daļas',
      type: 'item',
      url: '/parts',
      icon: icons.CarOutlined,
      breadcrumbs: false
    },
    // {
    //   id: 'chat',
    //   title: 'Чат',
    //   type: 'item',
    //   url: '/chat',
    //   icon: icons.MessageOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'manage-parts',
      title: 'Pievienot/Izņemt',
      type: 'item',
      url: '/manage-parts',
      icon: icons.PlusOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
