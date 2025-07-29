// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useMemo, useEffect } from 'react';

import { isEmpty } from 'lodash-es';
import classNames from 'classnames';
import { I18n } from '@cozeloop/i18n-adapter';
import { type FieldMeta } from '@cozeloop/api-schema/observation';
import { type OptionProps, Select } from '@coze-arch/coze-design';

import {
  LOGIC_OPERATOR_RECORDS,
  SELECT_MULTIPLE_RENDER_CMP_OP_LIST,
  SELECT_RENDER_CMP_OP_LIST,
} from './consts';

import styles from './index.module.less';

interface OperatorRendererProps {
  expr: {
    left?: string;
    operator?: number | string;
    right?: string | number | string[] | number[];
  };
  onExprChange?: (value: {
    operator?: string;
    right?: string | number | string[] | number[];
  }) => void;
  tagFilterRecord: Record<string, FieldMeta>;
  disabled?: boolean;
  defaultImmutableKeys?: string[];
  checkIsInvalidateExpr: (expr: string) => boolean;
}

export const OperatorRenderer = ({
  expr,
  onExprChange,
  tagFilterRecord,
  disabled,
  defaultImmutableKeys,
  checkIsInvalidateExpr,
}: OperatorRendererProps) => {
  const { left = '', operator, right } = expr;

  const tagOperatorOption: OptionProps[] = useMemo(
    () =>
      tagFilterRecord[left]?.filter_types?.map(item => ({
        label: I18n.unsafeT(LOGIC_OPERATOR_RECORDS[item]?.label ?? ''),
        value: item,
      })) ?? [],
    [left, tagFilterRecord],
  );

  const valueOperator = useMemo(
    () =>
      !isEmpty(tagOperatorOption) && !operator
        ? tagOperatorOption[0].value
        : operator,
    [tagOperatorOption, operator],
  ) as string | undefined;

  const handleChange = useCallback(
    (v: unknown) => {
      const typedValue = v as string;
      const isOperatorRenderTypeChange =
        valueOperator && typedValue
          ? SELECT_RENDER_CMP_OP_LIST.includes(valueOperator) !==
              SELECT_RENDER_CMP_OP_LIST.includes(typedValue) ||
            SELECT_MULTIPLE_RENDER_CMP_OP_LIST.includes(valueOperator) !==
              SELECT_MULTIPLE_RENDER_CMP_OP_LIST.includes(typedValue)
          : true;

      onExprChange?.({
        operator: typedValue,
        right: isOperatorRenderTypeChange ? undefined : right,
      });
    },
    [onExprChange, right, valueOperator],
  );

  // ---------------- 这里实现了默认填充下拉框第一个 start ----------------
  useEffect(() => {
    if (!left) {
      return;
    }
    handleChange(valueOperator);
  }, [left, valueOperator]);
  // ----------------  这里实现了默认填充下拉框第一个 end ----------------

  const isInvalidateExpr = checkIsInvalidateExpr(left);
  return (
    <div
      className={classNames(styles['expr-op-item-content'], {
        [styles['expr-op-item-content-invalidate']]: isInvalidateExpr,
      })}
    >
      {left ? (
        <Select
          style={{ width: '100%' }}
          disabled={disabled || defaultImmutableKeys?.includes(left)}
          value={valueOperator}
          onChange={handleChange}
          optionList={tagOperatorOption}
        />
      ) : null}
    </div>
  );
};
