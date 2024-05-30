import { WithingsClient } from '@dvcol/withings-http-client';

import type { AuthorizationRequest } from '@dvcol/withings-http-client/models';

import { WithingsSettings } from '~/settings/withings.settings';
import { createTab } from '~/utils/browser/browser.utils';

export class WithingsService {
  private static client = new WithingsClient(WithingsSettings);

  static get isAuthorized() {
    return this.client.auth?.token?.isExpired() === false;
  }

  static async approve(query?: AuthorizationRequest) {
    const url = this.client.authorizationUrl(query)?.toString();
    if (!url) throw new Error('Failed to create authorization URL');
    return createTab({ url });
  }
}
