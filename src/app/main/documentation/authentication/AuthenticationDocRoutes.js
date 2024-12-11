import { lazy } from 'react';

const AuthenticationDocRoutes = [
  {
    path: '/documentation/authentication/firebase',
    component: lazy(() => import('./firebase/FirebaseAuthDoc'))
  }
];

export default AuthenticationDocRoutes;
