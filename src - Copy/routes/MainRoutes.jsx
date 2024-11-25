import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const PartsPage = Loadable(lazy(() => import('pages/PartsPage')));
const ChatPage = Loadable(lazy(() => import('pages/ChatPage'))); // Добавлен ChatPage
const ManagePartsPage = Loadable(lazy(() => import('pages/ManagePartsPage'))); // Добавлен ManagePartsPage

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'parts',
      element: <PartsPage />
    },
    {
      path: 'chat',
      element: <ChatPage />
    },
    {
      path: 'manage-parts',
      element: <ManagePartsPage />
    }
  ]
};

export default MainRoutes;
