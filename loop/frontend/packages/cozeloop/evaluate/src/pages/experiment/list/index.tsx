// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @coze-arch/max-line-per-function */
import { useCallback } from 'react';

import { sendEvent, EVENT_NAMES } from '@cozeloop/tea-adapter';
import { GuardPoint, Guard } from '@cozeloop/guard';
import {
  ColumnsManage,
  RefreshButton,
  ExperimentRowSelectionActions,
  ExperimentNameSearch,
  ExperimentStatusSelect,
  getTableSelectionRows,
  ExperimentListEmptyState,
  ExperimentEvaluatorLogicFilter,
  useExperimentListStore,
  type SemiTableSort,
} from '@cozeloop/evaluate-components';
import { PrimaryPage } from '@cozeloop/components';
import { useNavigateModule, useSpace } from '@cozeloop/biz-hooks-adapter';
import {
  type ExptStatus,
  type Experiment,
  FieldType,
} from '@cozeloop/api-schema/evaluation';
import { IconCozPlus } from '@coze-arch/coze-design/icons';
import { Button, Spin } from '@coze-arch/coze-design';

import TableForExperiment, {
  TableHeader,
} from '@/components/table-for-experiment';

import styles from './index.module.less';
import { I18n } from '@cozeloop/i18n-adapter';

interface Filter {
  name?: string;
  status?: ExptStatus[];
}

const filterFields: { key: keyof Filter; type: FieldType }[] = [
  {
    key: 'status',
    type: FieldType.ExptStatus,
  },
];

const columnsOptions = {
  enableSort: true,
  enableIdColumn: false,
  columnManageStorageKey: 'experiment_list_column_manage',
};

/**
 * 实验列表页面
 */
export default function ExperimentList() {
  const { spaceID } = useSpace();
  const navigateModule = useNavigateModule();
  const {
    service,
    columns,
    defaultColumns,
    setColumns,
    filter,
    setFilter,
    logicFilter,
    batchOperate,
    setBatchOperate,
    selectedExperiments,
    setSelectedExperiments,
    isDatabaseEmpty,
    onSortChange,
    onFilterDebounceChange,
    onLogicFilterChange,
  } = useExperimentListStore<Filter>({
    filterFields,
    columnsOptions,
    pageSizeStorageKey: 'experiment_list_page_size',
  });

  const filters = (
    <>
      <ExperimentNameSearch
        value={filter?.name}
        onChange={val => {
          setFilter(old => ({ ...old, name: val }));
          onFilterDebounceChange();
        }}
      />
      <ExperimentStatusSelect
        value={filter?.status}
        onChange={val => {
          setFilter(old => ({ ...old, status: val as ExptStatus[] }));
          onFilterDebounceChange();
        }}
      />
      <ExperimentEvaluatorLogicFilter
        value={logicFilter}
        onChange={onLogicFilterChange}
      />
    </>
  );

  const actions = !batchOperate ? (
    <>
      <RefreshButton onRefresh={service.refresh} />
      <ColumnsManage
        columns={columns}
        defaultColumns={defaultColumns}
        storageKey={columnsOptions.columnManageStorageKey}
        onColumnsChange={setColumns}
      />
      <Button
        color="primary"
        onClick={() => {
          setBatchOperate(!batchOperate);
          setSelectedExperiments([]);
        }}
      >
        {I18n.t('batch_select')}
      </Button>
      <Guard point={GuardPoint['eval.experiments.create']} realtime>
        <Button
          icon={<IconCozPlus />}
          onClick={() => {
            sendEvent(EVENT_NAMES.cozeloop_experiement_create, {
              from: 'experiment_list',
            });
            navigateModule('evaluation/experiments/create');
          }}
        >
          {I18n.t('new_experiment')}
        </Button>
      </Guard>
    </>
  ) : (
    <ExperimentRowSelectionActions
      spaceID={spaceID}
      experiments={selectedExperiments}
      onRefresh={service.refresh}
      onCancelSelect={() => {
        setBatchOperate(false);
        setSelectedExperiments([]);
      }}
      onReportCompare={(status?: string) => {
        sendEvent(EVENT_NAMES.cozeloop_experiment_compare_count, {
          from: 'expt_list',
          status: status ?? 'success',
        });
        sendEvent(EVENT_NAMES.cozeloop_experiment_compare, {
          from: 'experiment_list',
        });
      }}
    />
  );

  const tableRowSelection = batchOperate
    ? {
        selectedRowKeys: selectedExperiments.map(e => e.id ?? ''),
        onChange(
          newKeys: (string | number)[] = [],
          rows: { id?: string }[] = [],
        ) {
          const newExperiments = getTableSelectionRows(
            newKeys as string[],
            rows,
            selectedExperiments,
          );
          setSelectedExperiments(newExperiments);
        },
      }
    : false;

  const tableOnRowClick = useCallback(record => {
    // 如果当前有选中的文本，不触发点击事件
    if (!window.getSelection()?.isCollapsed) {
      return;
    }
    navigateModule(`evaluation/experiments/${record.id}`);
  }, []);

  const tableOnChange = useCallback(
    changeInfo => {
      if (changeInfo.extra?.changeType === 'sorter' && changeInfo.sorter?.key) {
        onSortChange(changeInfo.sorter as SemiTableSort);
      }
    },
    [onSortChange],
  );

  const table = (
    <TableForExperiment<Experiment>
      service={service}
      heightFull={true}
      wrapperClassName={styles['experiment-list-table-wrapper']}
      pageSizeStorageKey="experiment_list_page_size"
      tableProps={{
        rowKey: 'id',
        columns,
        sticky: { top: 0 },
        rowSelection: tableRowSelection,
        onRow: record => ({
          onClick: () => tableOnRowClick(record),
        }),
        loading: service.loading,
        onChange: tableOnChange,
      }}
      empty={<ExperimentListEmptyState hasFilterCondition={!isDatabaseEmpty} />}
    />
  );

  return (
    <PrimaryPage
      pageTitle={I18n.t('experiment')}
      filterSlot={<TableHeader actions={actions} filters={filters} />}
      className="h-full overflow-hidden"
    >
      {isDatabaseEmpty ? (
        <Spin
          spinning={service.loading}
          wrapperClassName="!h-full"
          childStyle={{ height: '100%' }}
        >
          <ExperimentListEmptyState hasFilterCondition={!isDatabaseEmpty} />
        </Spin>
      ) : (
        table
      )}
    </PrimaryPage>
  );
}
