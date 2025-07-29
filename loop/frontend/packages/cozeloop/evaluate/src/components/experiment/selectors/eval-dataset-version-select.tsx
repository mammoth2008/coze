// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { useDebounceFn, useRequest } from 'ahooks';
import { useSpace } from '@cozeloop/biz-hooks-adapter';
import { StoneEvaluationApi } from '@cozeloop/api-schema';
import { Select, type SelectProps } from '@coze-arch/coze-design';
import { I18n } from '@cozeloop/i18n-adapter';

export default function EvalDatasetVersionSelect(
  props: { datasetId: string } & SelectProps,
) {
  const { spaceID } = useSpace();
  const service = useRequest(async () => {
    const res = await StoneEvaluationApi.ListEvaluationSetVersions({
      workspace_id: spaceID,
      page_size: 100,
      evaluation_set_id: props.datasetId,
    });
    return res.versions?.map(item => ({
      value: item.id,
      label: item.version,
      ...item,
    }));
  });

  const handleSearch = useDebounceFn(service.run, {
    wait: 500,
  });

  return (
    <Select
      placeholder={I18n.t('please_select', {
        field: I18n.t('evaluation_set_version'),
      })}
      filter={true}
      searchPosition="dropdown"
      searchPlaceholder={I18n.t('please_input', { field: '' })}
      remote
      {...props}
      loading={service.loading}
      onSearch={handleSearch.run}
      optionList={service.data}
      onDropdownVisibleChange={visible => {
        if (visible) {
          service.refresh();
        }
      }}
    />
  );
}
