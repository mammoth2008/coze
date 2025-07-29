// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @typescript-eslint/no-explicit-any */
import { I18n } from '@cozeloop/i18n-adapter';
import { sourceNameRuleValidator } from '@cozeloop/evaluate-components';

import { checkExperimentName } from '@/request/experiment';

export const baseInfoValidators: Record<string, any[]> = {
  name: [
    {
      required: true,
      message: I18n.t('please_input', { field: I18n.t('name') }),
    },
    { validator: sourceNameRuleValidator },
    {
      asyncValidator: async (_, value: string, spaceID: string) => {
        let err: Error | null = null;
        if (value) {
          try {
            const result = await checkExperimentName({
              workspace_id: spaceID,
              name: value,
            });
            if (!result.pass) {
              err = new Error(
                I18n.t('field_exists', { field: I18n.t('name') }),
              );
            }
          } catch (e) {
            console.error(I18n.t('interface_problem'), e);
          }
          if (err !== null) {
            throw err;
          }
        }
      },
    },
  ],
  desc: [],
};
