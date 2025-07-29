// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0

import { I18n } from '@cozeloop/i18n-adapter';

export const evaluateSetValidators = {
  evaluationSet: [
    {
      required: true,
      message: I18n.t('please_select', { field: I18n.t('evaluation_set') }),
    },
  ],
  evaluationSetVersion: [
    {
      required: true,
      message: I18n.t('please_select', { field: I18n.t('version_number') }),
    },
  ],
  // evaluationSetVersion: [
  //   { required: true, message: '请选择评测集版本详情' },
  // ],
};
