// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

import { I18n } from '@cozeloop/i18n-adapter';
import { IDWithCopy, ColumnsManage } from '@cozeloop/evaluate-components';
import { ResizeSidesheet } from '@cozeloop/components';
import {
  type ColumnEvaluator,
  type FieldSchema,
} from '@cozeloop/api-schema/evaluation';
import { IconCozWarningCircleFillPalette } from '@coze-arch/coze-design/icons';
import { Banner, Spin, type ColumnProps } from '@coze-arch/coze-design';

import { getDatasetColumns } from '@/utils/experiment';
import { type ExperimentItem } from '@/types/experiment/experiment-detail';
import { type DetailItemStepSwitch } from '@/types';
import { type ExperimentDetailActiveItemStore } from '@/hooks/use-experiment-detail-active-item';
import {
  ExperimentItemDetailTable,
  ExperimentItemRunStatus,
} from '@/components/experiment';

import EvaluatorResultTable from './evaluator-result-table';
import EvalActualOutputTable from './eval-actual-output-table';

import styles from './index.module.less';

export default function ExperimentItemDetail({
  fieldSchemas,
  columnEvaluators,
  spaceID,
  activeItemStore,
  onClose,
  onStepChange,
}: {
  fieldSchemas: FieldSchema[];
  columnEvaluators: ColumnEvaluator[];
  spaceID: Int64;
  activeItemStore: ExperimentDetailActiveItemStore<ExperimentItem>;
  onClose?: () => void;
  onStepChange?: (stepChange: DetailItemStepSwitch) => void;
}) {
  const [datasetColumns, setDatasetColumns] = useState<ColumnProps[]>([]);
  const [defaultDatasetColumns, setDefaultDatasetColumns] = useState<
    ColumnProps[]
  >([]);
  const expand = true;
  const item = activeItemStore.activeItem;

  useEffect(() => {
    const newColumns = [
      ...getDatasetColumns(fieldSchemas, { expand, prefix: 'datasetRow.' }),
    ].map(e => ({ ...e, width: 300 }));
    setDatasetColumns(newColumns);
    setDefaultDatasetColumns(newColumns);
  }, [fieldSchemas, expand]);

  if (!item) {
    return null;
  }

  const idString = item?.groupID?.toString() ?? '';
  const header = (
    <div className="flex items-center h-5 gap-2 text-sm font-normal">
      <div className="flex items-center text-[18px] font-medium">
        {I18n.t('view_detail')}：
        <IDWithCopy
          id={idString}
          prefix={
            <div className="ml-2">
              <ExperimentItemRunStatus status={item?.runState} />
            </div>
          }
        />
      </div>
      <div className="ml-auto" />
      <ColumnsManage
        columns={datasetColumns}
        defaultColumns={defaultDatasetColumns}
        onColumnsChange={setDatasetColumns}
      />
    </div>
  );
  return (
    <ResizeSidesheet
      title={header}
      closable={false}
      visible={true}
      dragOptions={{
        defaultWidth: 880,
        minWidth: 448,
        maxWidth: 1382,
      }}
      className={styles['experiment-item-detail-wrapper']}
      onCancel={onClose}
      bodyStyle={{ padding: 0 }}
    >
      <Spin spinning={activeItemStore.loading}>
        {item?.itemErrorMsg ? (
          <Banner
            type="danger"
            className="rounded-small !px-3 !py-2"
            fullMode={false}
            icon={
              <div className="h-[22px] flex items-center">
                <IconCozWarningCircleFillPalette className="text-[16px] text-[rgb(var(--coze-red-5))]" />
              </div>
            }
            description={item?.itemErrorMsg}
          />
        ) : null}
        <div
          className="font-bold text-xl px-5 py-3"
          style={{
            background: 'var(--coz-bg, #F0F0F7)',
            borderBottom: '1px solid var(--coz-stroke-primary',
          }}
        >
          {I18n.t('evaluation_set_data')}
        </div>
        <div className="overflow-auto">
          <ExperimentItemDetailTable
            rowKey="turnID"
            columns={datasetColumns.filter(column => !column.hidden)}
            dataSource={[item]}
            className="border-0 border-b border-[var(--coz-stroke-primary)] border-solid"
            weakHeader={true}
            tdClassName="text-[var(--coz-fg-secondary)]"
            thClassName="text-xs"
          />
        </div>
        <div className="text-[var(--coz-fg-plus)]">
          <EvalActualOutputTable expand={expand} item={item} />
        </div>
        <div
          className="font-bold text-xl px-5 py-3 border-0 border-t border-[var(--coz-stroke-primary)] border-solid"
          style={{
            background: 'var(--coz-bg, #F0F0F7)',
          }}
        >
          {I18n.t('evaluator_score')}
        </div>
        <EvaluatorResultTable
          spaceID={spaceID}
          evaluatorRecordMap={item?.evaluatorsResult}
          columnEvaluators={columnEvaluators}
          onRefresh={() => onStepChange?.(0)}
        />
        <div className="place-self-center mt-2 text-[var(--coz-fg-dim)] text-xs leading-4">
          {I18n.t('generated_by_ai_tip')}
        </div>
      </Spin>
    </ResizeSidesheet>
  );
}
