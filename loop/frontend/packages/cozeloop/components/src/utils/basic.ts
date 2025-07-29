// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import copy from 'copy-to-clipboard';
import { I18n } from '@cozeloop/i18n-adapter';
import { Toast } from '@coze-arch/coze-design';

export const handleCopy = async (value: string, hideToast?: boolean) => {
  try {
    copy(value);
    !hideToast &&
      Toast.success({
        content: I18n.t('copy_success'),
        showClose: false,
        zIndex: 99999,
      });
    return Promise.resolve(true);
  } catch (e) {
    Toast.warning({
      content: I18n.t('copy_failed'),
      showClose: false,
      zIndex: 99999,
    });
    console.error(e);
    return Promise.resolve(false);
  }
};

export const getBaseUrl = (spaceID?: string) =>
  `/console/enterprise/personal/space/${spaceID || ''}`;
