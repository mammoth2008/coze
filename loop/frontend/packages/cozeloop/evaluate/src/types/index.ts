// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import {
  type FieldData as DatasetCellFieldData,
  type Content as DatasetCellContent,
} from '@cozeloop/api-schema/evaluation';

export { DatasetCellContent };

/**
 * 逻辑筛选条件
 */
export interface LogicFilter {
  /** 逻辑操作符 */
  op?: string;
  /** 表达式 */
  exprs?: Array<{
    /** 左侧字段 */
    left: string;
    /** 操作符 */
    op: string;
    /** 右侧值 */
    right: unknown;
  }>;
}
/** 数据集一行数据 */
export type DatasetRow = Record<string, DatasetCellFieldData | undefined>;
/** 数据详情弹框中步骤变化值，上一条-1，下一条1，原地刷新0 */
export enum DetailItemStepSwitch {
  Prev = -1,
  Next = 1,
  Current = 0,
}
