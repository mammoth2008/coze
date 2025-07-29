// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { I18n } from '@cozeloop/i18n-adapter';
import { Guard, GuardPoint } from '@cozeloop/guard';
import { TableHeader } from '@cozeloop/components';
import { useNavigateModule } from '@cozeloop/biz-hooks-adapter';
import { type Experiment } from '@cozeloop/api-schema/evaluation';
import { StoneEvaluationApi } from '@cozeloop/api-schema';
import { Button, Modal } from '@coze-arch/coze-design';

import { verifyContrastExperiment } from '../../utils/experiment';

export function ExperimentRowSelectionActions({
  spaceID,
  experiments = [],
  onCancelSelect,
  onRefresh,
  onReportCompare,
}: {
  spaceID: Int64;
  experiments: Experiment[];
  onCancelSelect?: () => void;
  onRefresh?: () => void;
  onReportCompare?: (status: string) => void;
}) {
  const navigate = useNavigateModule();
  return (
    <TableHeader
      actions={
        <>
          <div className="text-xs">
            {I18n.t('x_data_item_selected', { num: experiments.length })}
            <span
              className="ml-1 text-[rgb(var(--coze-up-brand-9))] cursor-pointer"
              onClick={() => {
                onCancelSelect?.();
              }}
            >
              {I18n.t('unselect')}
            </span>
          </div>
          <Button
            color="primary"
            disabled={experiments.length < 2}
            onClick={() => {
              if (!verifyContrastExperiment(experiments)) {
                onReportCompare?.('fail');
                return;
              } else {
                onReportCompare?.('success');
                navigate(
                  `evaluation/experiments/contrast?experiment_ids=${experiments.map(experiment => experiment.id).join(',')}`,
                );
              }
            }}
          >
            {I18n.t('experiment_comparison')}
          </Button>

          <Guard point={GuardPoint['eval.experiments.batch_delete']}>
            <Button
              color="red"
              disabled={!experiments.length}
              onClick={() => {
                if (!experiments?.length) {
                  return;
                }
                Modal.confirm({
                  title: I18n.t('batch_delete_experiment'),
                  content: I18n.t('confirm_batch_delete_x_experiment', {
                    num: experiments.length,
                  }),
                  okText: I18n.t('delete'),
                  cancelText: I18n.t('Cancel'),
                  okButtonColor: 'red',
                  width: 420,
                  autoLoading: true,
                  async onOk() {
                    await StoneEvaluationApi.BatchDeleteExperiments({
                      workspace_id: spaceID,
                      expt_ids: experiments.map(item => item.id ?? ''),
                    });
                    onRefresh?.();
                  },
                });
              }}
            >
              {I18n.t('delete')}
            </Button>
          </Guard>
        </>
      }
    />
  );
}
