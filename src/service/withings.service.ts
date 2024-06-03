import { storage } from '@dvcol/web-extension-utils/chrome/storage';
import { WithingsClient } from '@dvcol/withings-http-client';

import type { CancellablePromise } from '@dvcol/base-http-client/utils/fetch';
import type { AuthorizationRequest, WithingsAuthToken } from '@dvcol/withings-http-client/models';

import { Constants } from '~/models/constants.model';
import { LoadingBarService } from '~/service/loading-bar.service';
import { WithingsSettings } from '~/settings/withings.settings';
import { createTab } from '~/utils/browser/browser.utils';

export class WithingsService {
  private static client = new WithingsClient(WithingsSettings);

  static get isAuthorized() {
    return this.client.auth?.token?.isExpired() === false;
  }

  static async approve(query: AuthorizationRequest) {
    const url = this.client.authorizationUrl(query)?.toString();
    if (!url) throw new Error('Failed to create authorization URL');
    return createTab({ url });
  }

  private static async saveAuth(auth = this.client.auth) {
    await storage.sync.set(Constants.ClientAuth, auth);
    return auth;
  }

  private static async restoreAuth() {
    const token = await storage.sync.get<WithingsAuthToken>(Constants.ClientAuth);
    if (!token) {
      console.warn('No token found in storage, could not restore auth.');
      return null;
    }
    return this.client.importToken(token);
  }

  static async authorize(code: string, state?: string) {
    const token = await this.client.exchangeCode({ code, state });
    return this.saveAuth(token);
  }

  private static async refresh() {
    return this.client.refreshToken();
  }

  private static async loadingBar<T>(query: Promise<T> | CancellablePromise<T>) {
    const timeout = setTimeout(() => LoadingBarService.start(), 500);
    try {
      await query;
      LoadingBarService.succeed();
    } catch (error) {
      LoadingBarService.fail();
    } finally {
      clearTimeout(timeout);
    }
  }

  static listen() {
    this.client.onAuthChange(async _auth => {
      console.debug('TraktClient.onAuthChange', { ..._auth });
    });

    this.client.onCall(async call => {
      console.debug('TraktClient.onCall', call);
      await this.loadingBar(call.query);
    });

    return this.restoreAuth();
  }
}
