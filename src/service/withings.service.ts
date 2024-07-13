import { storage } from '@dvcol/web-extension-utils/chrome/storage';
import { WithingsClient } from '@dvcol/withings-http-client';

import { withingsApi } from '@dvcol/withings-http-client/api';

import { WithingsAuthToken } from '@dvcol/withings-http-client/models';
import { derived, get, writable } from 'svelte/store';

import type { CancellablePromise } from '@dvcol/base-http-client/utils/fetch';
import type {
  AuthorizationRequest,
  WithingsApiResponse,
  WithingsClientAuthentication,
  WithingsNotify,
  WithingsNotifyAppliCodes,
} from '@dvcol/withings-http-client/models';

import { Constants } from '~/models/constants.model';
import { LoadingBarService } from '~/service/loading-bar.service';
import { WithingsSettings } from '~/settings/withings.settings';
import { createTab } from '~/utils/browser/browser.utils';

export class WithingsService {
  private static client = new WithingsClient(WithingsSettings, {}, withingsApi);
  private static auth$ = writable<WithingsClientAuthentication>(this.client.auth);

  static get isAuthorized$() {
    return derived(this.auth$, $auth => {
      console.debug('WithingsService.isAuthorized$', $auth);
      return $auth?.token?.access_token && $auth?.token?.isExpired() === false;
    });
  }

  static get isAuthorized() {
    return get(this.isAuthorized$);
  }

  private static async saveAuth(auth = this.client.auth) {
    if (auth) await storage.sync.set(Constants.ClientAuth, auth);
    else await storage.sync.remove(Constants.ClientAuth);
    return auth;
  }

  private static async restoreAuth() {
    const auth = await storage.sync.get<WithingsClientAuthentication>(Constants.ClientAuth);

    if (auth?.state) this.client.importState(auth.state);
    if (!auth?.token?.access_token) {
      console.warn('No token found in storage, could not restore auth.');
      return null;
    }
    console.debug('Restoring auth from storage', auth);
    const imported = await this.client.importToken(new WithingsAuthToken(auth.token));
    return this.saveAuth(imported);
  }

  static async approve(query: AuthorizationRequest) {
    const url = this.client.authorizationUrl(query)?.toString();
    if (!url) throw new Error('Failed to create authorization URL');
    await this.saveAuth();
    return createTab({ url });
  }

  static async login(code: string, state?: string): Promise<WithingsClientAuthentication> {
    const token = await this.client.exchangeCode({ code, state });
    return this.saveAuth(token);
  }

  static async logout(): Promise<WithingsClientAuthentication> {
    this.client.clearAuth();
    return this.saveAuth();
  }

  private static async refresh() {
    return this.client.refreshToken();
  }

  private static async loadingBar<T>(query: Promise<T> | CancellablePromise<T>) {
    const timeout = setTimeout(() => LoadingBarService.start(), 500);
    try {
      await query;
      console.debug('TraktService.loadingBar', 'succeed');
      LoadingBarService.succeed();
    } catch (error) {
      console.error('TraktService.loadingBar', 'fails', error);
      LoadingBarService.fail();
    } finally {
      clearTimeout(timeout);
    }
  }

  static listen() {
    this.client.onAuthChange(async _auth => {
      console.debug('TraktClient.onAuthChange', { ..._auth });
      this.auth$.set(_auth);
    });

    this.client.onCall(async call => {
      console.debug('TraktClient.onCall', call);
      await this.loadingBar(call.query);
    });

    return this.restoreAuth();
  }

  static async subscriptions() {
    const response = await WithingsService.client.notify.list();
    const data = await response.json();
    return data.body.profiles;
  }

  static async subscribe(appli: WithingsNotifyAppliCodes, callbackurl: string, comment?: string) {
    const response: WithingsApiResponse = await WithingsService.client.notify.subscribe({
      callbackurl,
      comment,
      appli,
    });
    return response.json();
  }

  static async revoke(subscription: WithingsNotify) {
    const response = await WithingsService.client.notify.revoke({
      callbackurl: subscription.callbackurl,
      appli: subscription.appli,
    });
    return response.json();
  }
}
