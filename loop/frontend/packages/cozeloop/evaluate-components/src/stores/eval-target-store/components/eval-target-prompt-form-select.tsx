// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { I18n } from '@cozeloop/i18n-adapter';
import {
  type CommonFieldProps,
  type SelectProps,
  withField,
} from '@coze-arch/coze-design';

import { PromptEvalTargetSelect } from '../../../components/selectors/evaluate-target';

const FormSelectInner = withField(PromptEvalTargetSelect);

const PromptEvalTargetFormSelect: React.FC<
  SelectProps & CommonFieldProps
> = props => (
  <FormSelectInner
    remote
    onChangeWithObject
    label="Prompt key"
    rules={[
      {
        required: true,
        message: I18n.t('please_select', { field: I18n.t('prompt_key') }),
      },
    ]}
    placeholder={I18n.t('please_select', { field: I18n.t('prompt_key') })}
    showCreateBtn={true}
    {...props}
  />
);

export default PromptEvalTargetFormSelect;
