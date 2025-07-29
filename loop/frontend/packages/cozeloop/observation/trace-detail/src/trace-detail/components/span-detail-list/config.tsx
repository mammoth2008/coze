// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable complexity */

import { SpanContentType } from '@/trace-detail/utils/span';
import { type Span } from '@/trace-detail/typings/params';

import { type Field } from '../common/field-list';

export const getSpanTagList = (span: Span) => {
  if (!span) {
    return [];
  }
  const { custom_tags, span_type } = span;
  if (!span_type) {
    return [];
  }
  const tagList: { [key: string]: Field[] } = {
    [SpanContentType.Model]: [
      {
        key: 'model_provider',
        title: 'ModelProvider',
        item: custom_tags?.model_provider ?? '-',
        enableCopy: false,
      },
      {
        key: 'model_name',
        title: 'ModelName',
        item: custom_tags?.model_name ?? '-',
        enableCopy: false,
      },
      {
        key: 'stream',
        title: 'Stream',
        item: custom_tags?.stream ?? '-',
        enableCopy: false,
      },
      {
        key: 'latency_first_resp',
        title: 'LatencyFirstResp',
        item:
          custom_tags?.latency_first_resp !== undefined
            ? `${custom_tags?.latency_first_resp}ms`
            : '-',
        enableCopy: false,
      },
    ],
    [SpanContentType.Prompt]: [
      {
        key: 'prompt_provider',
        title: 'PromptProvider',
        item: custom_tags?.prompt_provider ?? '-',
        enableCopy: false,
      },
      {
        key: 'prompt_key',
        title: 'PromptKey',
        item: custom_tags?.prompt_key ?? '-',
        enableCopy: false,
      },
      {
        key: 'prompt_version',
        title: 'PromptVersion',
        item: custom_tags?.prompt_version ?? '-',
        enableCopy: false,
      },
    ],
  };
  return (tagList?.[span_type] || []).filter(item => item.item);
};
