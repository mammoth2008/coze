// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { I18n } from '@cozeloop/i18n-adapter';
import { type OperatorRenderProps } from '@cozeloop/components';
import { Select } from '@coze-arch/coze-design';

import { dataTypeList, type RenderProps } from './logic-types';

export default function OperatorRender(
  props: OperatorRenderProps<string, string, string | number | undefined> &
    RenderProps,
) {
  const { expr, onExprChange, fields, disabled = false } = props;
  const field = fields.find(item => item.name === expr.left);
  const dataType = dataTypeList.find(item => item.type === field?.type);
  if (!field || !dataType) {
    return null;
  }
  const { disabledOperations = [] } = field;
  let options = dataType.operations ?? [];
  if (disabledOperations.length > 0) {
    options = options.filter(item => !disabledOperations.includes(item.value));
  }
  return (
    <div className="w-24">
      <Select
        placeholder={I18n.t('operator')}
        value={expr.operator}
        style={{ width: '100%' }}
        disabled={disabled}
        optionList={options}
        onChange={val => {
          onExprChange?.({
            ...expr,
            operator: val as string | undefined,
          });
        }}
      />
    </div>
  );
}
