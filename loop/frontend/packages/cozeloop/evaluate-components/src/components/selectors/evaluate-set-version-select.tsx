// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { useRequest } from 'ahooks';
import { BaseSearchFormSelect } from '@cozeloop/components';
import { useBaseURL, useSpace } from '@cozeloop/biz-hooks-adapter';
import { StoneEvaluationApi } from '@cozeloop/api-schema';
import { type FormSelect, Typography } from '@coze-arch/coze-design';

import NoVersionJumper from '../common/no-version-jumper';
import { I18n } from '@cozeloop/i18n-adapter';

export function EvaluateSetVersionSelect({
  evaluationSetId,
  ...props
}: React.ComponentProps<typeof FormSelect> & {
  evaluationSetId?: string;
}) {
  const { spaceID } = useSpace();
  const { baseURL } = useBaseURL();

  const service = useRequest(
    async () => {
      if (!evaluationSetId) {
        return [];
      }
      const [res1, res2] = await Promise.all([
        StoneEvaluationApi.ListEvaluationSetVersions({
          workspace_id: spaceID,
          evaluation_set_id: evaluationSetId,
          page_size: 200,
        }),
        StoneEvaluationApi.GetEvaluationSet({
          workspace_id: spaceID,
          evaluation_set_id: evaluationSetId,
        }),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list: any[] =
        res1.versions?.map(item => ({
          value: item.id,
          label: (
            <div className="flex flex-row items-center w-full pr-2">
              <div className="flex-shrink-0">{item.version}</div>
              <Typography.Text
                className="flex-1 w-0 ml-3 coz-fg-secondary text-xs font-medium"
                ellipsis={{ showTooltip: true }}
              >
                {item.description}
              </Typography.Text>
            </div>
          ),
          ...item,
        })) || [];
      // 没有历史版本
      if (!res1?.versions) {
        list?.unshift({
          value: '__UNCOMMITTED__',
          label: (
            <NoVersionJumper
              targetUrl={`${baseURL}/evaluation/datasets/${evaluationSetId}`}
              isShowTag={res2?.evaluation_set?.change_uncommitted}
            />
          ),
          disabled: true,
        });
      }
      return list;
    },
    {
      refreshDeps: [evaluationSetId],
    },
  );

  return (
    <BaseSearchFormSelect
      placeholder={I18n.t('please_select', {
        field: I18n.t('evaluation_set_version'),
      })}
      remote
      loading={service.loading}
      showRefreshBtn={true}
      onClickRefresh={() => service.run()}
      optionList={service.data}
      {...props}
    />
  );
}
