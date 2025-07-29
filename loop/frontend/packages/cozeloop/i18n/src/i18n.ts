// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import {
  localeEnUS as loopLocaleEnUS,
  localeZhCN as loopLocaleZhCN,
} from '@cozeloop/loop-lng';
import { intlClient, type IntlClientOptions } from '@cozeloop/intl';

import { type CozeloopI18n } from './locale-types';

// eslint-disable-next-line @typescript-eslint/naming-convention -- skip
const I18n: CozeloopI18n = intlClient;

/**
 * initialize I18n
 */
async function initIntl(options: IntlClientOptions = {}) {
  await intlClient.init({
    ...options,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'i18next',
      /** keep `i18next` with backend */
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18next',
      caches: ['cookie'],
    },
    resources: {
      'zh-CN': {
        translation: Object.assign({}, loopLocaleZhCN),
      },
      'en-US': {
        translation: Object.assign({}, loopLocaleEnUS),
      },
    },
  });
}

I18n.t('please_add');

I18n.t('Confirm');

export { I18n, initIntl };
