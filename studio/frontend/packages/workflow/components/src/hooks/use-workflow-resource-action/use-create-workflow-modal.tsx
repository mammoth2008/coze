/*
 * Copyright 2025 coze-dev Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
import { useMemo, useState } from 'react';

import { useBoolean } from 'ahooks';
import {
  type FrontWorkflowInfo,
  WorkflowMode,
  isGeneralWorkflow,
  type BindBizType,
} from '@coze-workflow/base';
import { I18n } from '@coze-arch/i18n';
import { useFlags } from '@coze-arch/bot-flags';
import { CustomError } from '@coze-arch/bot-error';

import { DataSourceType, WorkflowModalFrom } from '@/workflow-modal';
import { CreateWorkflowModal, type RuleItem } from '@/workflow-edit';
import { reporter } from '@/utils';
import { useWorkflowModal } from '@/hooks/use-workflow-modal';

import { type WorkflowResourceActionProps } from './type';

export const useCreateWorkflowModal = ({
  from = WorkflowModalFrom.SpaceWorkflowList,
  bindBizType,
  bindBizId,
  refreshPage,
  spaceId,
  goWorkflowDetail,
  projectId,
  onCreateSuccess,
  hiddenTemplateEntry,
  nameValidators,
}: WorkflowResourceActionProps & {
  from?: WorkflowModalFrom;
  /** 当前项目 id，只在项目内的 workflow 有该字段 */
  projectId?: string;
  bindBizType?: BindBizType;
  bindBizId?: string;
  onCreateSuccess?: ({ workflowId }: { workflowId: string }) => void;
  goWorkflowDetail?: (workflowId?: string, spaceId?: string) => void;
  /** 隐藏通过模板创建入口 */
  hiddenTemplateEntry?: boolean;
  nameValidators?: RuleItem[];
}) => {
  const [currentWorkflow, setCurrentWorkflow] = useState<FrontWorkflowInfo>();
  const [formMode, setFormMode] = useState<'add' | 'update'>('add');
  const [flowMode, setFlowMode] = useState<WorkflowMode>(WorkflowMode.Workflow);
  const [createModalVisible, { setTrue, setFalse: closeCreateModal }] =
    useBoolean(false);

  const [FLAGS] = useFlags();

  const openCreateModal = (mode?: WorkflowMode) => {
    setFormMode('add');
    setFlowMode(mode || WorkflowMode.Workflow);
    reporter.info({
      message: 'workflow_list_open_create_modal',
    });
    setTrue();
  };

  const openEditModal = () => {
    setFormMode('update');
    reporter.info({
      message: 'workflow_list_open_create_modal',
    });
    setTrue();
  };

  const handleEditWorkflow = (partialWorkflowInfo: FrontWorkflowInfo) => {
    setCurrentWorkflow(partialWorkflowInfo);
    setFlowMode(partialWorkflowInfo.flow_mode || WorkflowMode.Workflow);
    openEditModal();
  };

  const workflowModalInitState = useMemo(() => {
    // 即将支持，敬请期待
    if (isWorkflowMode || FLAGS['bot.community.store_imageflow']) {
      return {
        productCategory: 'all',
        isSpaceWorkflow: false,
        dataSourceType: DataSourceType.Product,
      };
    }
    return {
      workflowTag: 1,
      isSpaceWorkflow: false,
      dataSource: DataSourceType.Workflow,
    };
  }, [FLAGS, flowMode]);

  const { node: workflowModal } = useWorkflowModal({
    from,
    flowMode,
    dupText: I18n.t('Copy'),
    hiddenCreate: true,
    hiddenSpaceList: true,
    initState: workflowModalInitState,
    projectId,
    onAdd: () => {
      refreshPage?.();
    },
    onDupSuccess: val => {
      window.open(
        `/work_flow?space_id=${spaceId}&workflow_id=${val.workflow_id}&from=dupSuccess`,
      );
    },
  });

  const isWorkflowMode = useMemo(() => isGeneralWorkflow(flowMode), [flowMode]);

  return {
    openCreateModal,
    handleEditWorkflow,
    workflowModal,
    createWorkflowModal: (
      <CreateWorkflowModal
        initConfirmDisabled
        mode={formMode}
        flowMode={flowMode}
        projectId={projectId}
        visible={createModalVisible}
        onCancel={closeCreateModal}
        bindBizType={bindBizType}
        bindBizId={bindBizId}
        workFlow={formMode === 'update' ? currentWorkflow : undefined}
        getLatestWorkflowJson={undefined}
        customTitleRender={undefined}
        onSuccess={({ workflowId }) => {
          closeCreateModal();
          if (!workflowId) {
            throw new CustomError(
              '[Workflow] create failed',
              'create workflow failed, no workflow id',
            );
          }

          if (onCreateSuccess && formMode === 'add') {
            onCreateSuccess({ workflowId });
            return;
          }
          // 编辑模式，不跳转，刷新当前列表
          if (formMode === 'update') {
            refreshPage?.();
            return;
          }

          const navigateDelay = 500;
          //  由于后端数据同步慢，这里delay 500 ms
          setTimeout(() => {
            goWorkflowDetail?.(workflowId, spaceId);
          }, navigateDelay);
        }}
        spaceID={spaceId}
        nameValidators={nameValidators}
      />
    ),
  };
};
