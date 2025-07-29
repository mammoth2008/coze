// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { useSyncUrlParams } from '../../hooks/use-sync-url-params';
import { QueryTable, type QueryTableProps } from './table';

export interface Props extends QueryTableProps {
  disableUrlParams?: boolean;
}
export const Queries = ({ disableUrlParams, ...resetProps }: Props) => (
  <div className="flex-1 w-full flex gap-3 h-full overflow-hidden max-w-full box-border">
    <div className="flex flex-col flex-1 gap-3 min-w-0 overflow-hidden">
      <div className="flex flex-1 min-h-0 w-full overflow-hidden box-border gap-3 mb-3">
        <QueryTable
          className="analytics-content-box flex-1 w-0"
          {...resetProps}
        />
      </div>
    </div>

    <HooksPlugin disableUrlParams={disableUrlParams} />
  </div>
);

// 如果直接放在父组件里会导致子组件多次 render
const HooksPlugin = ({ disableUrlParams }: Pick<Props, 'disableUrlParams'>) => {
  useSyncUrlParams(disableUrlParams);
  return <></>;
};
