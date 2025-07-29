// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { useEffect } from 'react';

import { I18n } from '@cozeloop/i18n-adapter';
import { IconCozInfoCircle } from '@coze-arch/coze-design/icons';
import { Tooltip } from '@coze-arch/coze-design';

import { useDefaultPromptEvaluatorToolsStore } from './use-default-prompt-evaluator-tools-store';

export function OutputInfo({ className }: { className?: string }) {
  const { toolsDescription, fetchData } = useDefaultPromptEvaluatorToolsStore();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={className}>
      <div className="flex flex-row items-center h-5 text-sm font-medium coz-fg-primary mb-2">
        {I18n.t('output')}
        <Tooltip content={I18n.t('extract_via_function_call')}>
          <IconCozInfoCircle className="ml-1 coz-fg-secondary" />
        </Tooltip>
      </div>

      <div className="coz-fg-secondary text-[13px] leading-5 font-normal mb-[6px]">
        <span className="font-medium">{I18n.t('score_is')}</span>
        {toolsDescription?.score}
      </div>
      <div className="coz-fg-secondary text-[13px] leading-5 font-normal">
        <span className="font-medium">
          {I18n.t('reason_is', { reason: '' })}
        </span>
        {toolsDescription?.reason}
      </div>
    </div>
  );
}
