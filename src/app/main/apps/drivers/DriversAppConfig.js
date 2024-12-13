import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const DriversAppConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/apps/drivers/:id',
      component: lazy(() => import('./DriversApp'))
    },
    {
      path: '/apps/drivers',
      component: () => <Redirect to="/apps/drivers/all" />
    }
  ]
};

export default DriversAppConfig;
