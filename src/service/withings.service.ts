import { WithingsClient } from '@dvcol/withings-http-client';

import type { CancellablePromise } from '@dvcol/base-http-client/utils/fetch';
import type { AuthorizationRequest } from '@dvcol/withings-http-client/models';

import { LoadingBarService } from '~/service/loading-bar.service';
import { WithingsSettings } from '~/settings/withings.settings';
import { createTab } from '~/utils/browser/browser.utils';

export class WithingsService {
  private static client = new WithingsClient(WithingsSettings);

  static get isAuthorized() {
    return this.client.auth?.token?.isExpired() === false;
  }

  private static async loadingBar<T>(query: Promise<T> | CancellablePromise) {
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
  }

  static async approve(query?: AuthorizationRequest) {
    const url = this.client.authorizationUrl(query)?.toString();
    if (!url) throw new Error('Failed to create authorization URL');
    return createTab({ url });
  }
}
