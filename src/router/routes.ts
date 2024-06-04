import { replace } from 'svelte-spa-router';
import wrap from 'svelte-spa-router/wrap';

import type { RouteDefinition, RoutePrecondition, WrappedComponent } from 'svelte-spa-router';

import { WithingsService } from '~/service/withings.service';

export const RouteName = {
  Login: 'login',
  Subscribe: 'subscribe',
  Subscriptions: 'subscriptions',
} as const;

export type RouteNames = (typeof RouteName)[keyof typeof RouteName];

export const RoutePath: Record<keyof typeof RouteName, string> = {
  Login: `/${RouteName.Login}`,
  Subscribe: `/${RouteName.Subscribe}`,
  Subscriptions: `/${RouteName.Subscriptions}`,
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
  Subscriptions: {
    name: RouteName.Subscriptions,
    path: RoutePath.Subscriptions,
    component: wrap({
      asyncComponent: () => import('~/components/subscriptions/SubscriptionsComponent.svelte'),
      conditions: [authGuard],
      userData: { name: RouteName.Subscriptions } satisfies RouteData,
    }),
  },
  Subscribe: {
    name: RouteName.Subscribe,
    path: RoutePath.Subscribe,
    component: wrap({
      asyncComponent: () => import('~/components/subscribe/SubscribeComponent.svelte'),
      conditions: [authGuard],
      userData: { name: RouteName.Subscribe } satisfies RouteData,
    }),
  },
  Login: {
    name: RouteName.Login,
    path: RoutePath.Login,
    component: wrap({
      asyncComponent: () => import('~/components/login/LoginComponent.svelte'),
      conditions: [authGuard],
      userData: { name: RouteName.Login } satisfies RouteData,
    }),
  },
} as const;

export const routeMap = Object.values(Route).map(route => ({ name: route.name, path: route.path }));

export const routeDefinition: RouteDefinition = {
  // Home
  '/': Route.Subscriptions.component,

  // Routes
  [RoutePath.Subscriptions]: Route.Subscriptions.component,
  [RoutePath.Subscribe]: Route.Subscribe.component,
  [RoutePath.Login]: Route.Login.component,

  // Catch-all
  '*': Route.Subscriptions.component,
};
