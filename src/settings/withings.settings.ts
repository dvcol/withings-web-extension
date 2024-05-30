import { Config } from '@dvcol/withings-http-client/config';

import type { WithingsClientSettings } from '@dvcol/withings-http-client/models';

import { chromeRuntimeId } from '~/utils/browser/browser.utils';

export const WithingsSettings: WithingsClientSettings = {
  client_id: import.meta.env.VITE_WITHINGS_CLIENT_ID,
  client_secret: import.meta.env.VITE_WITHINGS_SECRET,

  endpoint: Config.endpoint.api,

  redirect_uri: `https://dvcol.github.io/redirect-to?to=chrome-extension%3A%2F%2F${chromeRuntimeId}%2Fviews%2Foptions%2Findex.html`,
};
