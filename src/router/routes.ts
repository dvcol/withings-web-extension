import { replace } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';

import type { RouteDefinition, RoutePrecondition, WrappedComponent } from 'svelte-spa-router';

import { WithingsService } from '~/service/withings.service';

export const RouteName = {
  Login: 'login',
  Notify: 'notify',
} as const;

export type RouteNames = (typeof RouteName)[keyof typeof RouteName];

export const RoutePath: Record<keyof typeof RouteName, string> = {
  Login: `/${RouteName.Login}`,
  Notify: `/${RouteName.Notify}`,
};

export type RouteData = {
  name: RouteNames;
};

const authGuard: RoutePrecondition = ({ userData: data }) => {
  console.info('authGuard', { data }, WithingsService.isAuthorized);
  if ((data as RouteData)?.name === RouteName.Login) return true;
  if (!WithingsService.isAuthorized) {
    replace(RoutePath.Login).catch(console.error);
    return false;
  }
  return true;
};

export const Route: Record<
  string,
  {
    name: string;
    path: string;
    component: WrappedComponent;
  }
> = {
  Login: {
    name: RouteName.Login,
    path: RoutePath.Login,
    component: wrap({
      asyncComponent: () => import('~/components/login/LoginComponent.svelte'),
      conditions: [authGuard],
      userData: { name: RouteName.Login } satisfies RouteData,
    }),
  },
  Notify: {
    name: RouteName.Notify,
    path: RoutePath.Notify,
    component: wrap({
      asyncComponent: () => import('~/components/notify/NotifyComponent.svelte'),
      conditions: [authGuard],
      userData: { name: RouteName.Notify } satisfies RouteData,
    }),
  },
} as const;

export const routeMap = Object.values(Route).map(route => ({ name: route.name, path: route.path }));

export const routeDefinition: RouteDefinition = {
  // Home
  '/': Route.Notify.component,

  // Routes
  [RoutePath.Notify]: Route.Notify.component,
  [RoutePath.Login]: Route.Login.component,

  // Catch-all
  '*': Route.Notify.component,
};
