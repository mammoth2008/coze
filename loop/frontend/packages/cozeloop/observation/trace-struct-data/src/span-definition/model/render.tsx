// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { isEmpty } from 'lodash-es';
import { I18n } from '@cozeloop/i18n-adapter';
import { handleCopy as copy } from '@cozeloop/components';
import { IconCozCopy } from '@coze-arch/coze-design/icons';
import { Button, Collapse, Tooltip, Typography } from '@coze-arch/coze-design';

import { beautifyJson } from '../../utils/json';
import { type RemoveUndefinedOrString } from '../../types/utils';
import { type RawMessage, type Span, TagType } from '../../types';
import { ReactComponent as IconSpanPluginTool } from '../../icons/icon-plugin-tool.svg';
import { SpanFieldRender } from '../../components/span-field-render';
import { RawContent } from '../../components/raw-content';
import type { Tool, Input, Output } from './index';

import styles from './index.module.less';

interface ModelDataRender {
  error: (error?: string) => React.ReactNode;
  input: (
    input: RemoveUndefinedOrString<Input>,
    attrTos: Span['attr_tos'],
  ) => React.ReactNode;
  output: (
    output: RemoveUndefinedOrString<Output>,
    attrTos: Span['attr_tos'],
  ) => React.ReactNode;
  reasoningContent: (reasoningContent?: string) => React.ReactNode;
  tool: (tool?: Tool) => React.ReactNode;
}

const ModelTool = (tool?: Tool) => {
  const handleCopy = (data: object) => {
    const str = beautifyJson(data);
    copy(str);
  };

  if (!tool || !Array.isArray(tool) || isEmpty(tool)) {
    return (
      <RawContent
        structuredContent={tool as string}
        tagType={TagType.Functions}
      />
    );
  }
  return (
    <Collapse className={styles['function-collapse']}>
      {tool.map((raw, index) => (
        <Collapse.Panel
          className={styles['function-panel-content']}
          header={
            <div className="flex w-full items-center justify-between">
              <Typography.Text
                ellipsis
                className="!font-mono"
                icon={
                  <IconSpanPluginTool
                    style={{ width: '16px', height: '16px' }}
                  />
                }
              >
                {raw?.function?.name}
              </Typography.Text>

              <Tooltip content={I18n.t('Copy')} theme="dark">
                <Button
                  className="!w-[24px] !h-[24px] box-border mr-1"
                  size="small"
                  color="secondary"
                  icon={
                    <IconCozCopy className="flex items-center justify-center w-[14px] h-[14px] text-[var(--coz-fg-secondary)]" />
                  }
                  onClick={e => {
                    e.stopPropagation();
                    handleCopy(raw);
                  }}
                />
              </Tooltip>
            </div>
          }
          itemKey={`${index}`}
          key={index}
        >
          <div className="flex flex-col px-3">
            <p className="text-xs">{raw?.function?.description}</p>
            <div>
              {Object.entries(raw?.function?.parameters?.properties || {}).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[auto,1fr] overflow-hidden rounded-lg mt-2"
                    style={{ border: '1px solid #1D1C2314' }}
                  >
                    <div
                      className="col-span-2  px-4 py-2 font-mono text-sm"
                      style={{
                        borderBottom: '1px solid #1D1C2314',
                        backgroundColor: 'var(--semi-color-info-light-default)',
                      }}
                    >
                      {raw?.function?.parameters?.required?.includes(key) ? (
                        <span className="text-[red]">*</span>
                      ) : (
                        ''
                      )}
                      {key}
                    </div>
                    <div className="px-4 py-2 text-sm font-semibold">
                      {I18n.t('analytics_trace_type')}
                    </div>
                    <div className="px-4 py-2 text-sm">{value?.type}</div>
                    <div
                      className="border-t  px-4 py-2 text-sm font-semibold"
                      style={{ borderTop: '1px solid #1D1C2314' }}
                    >
                      {I18n.t('analytics_trace_description')}
                    </div>
                    <div
                      className="whitespace-pre-wrap px-4 py-2 text-sm"
                      style={{ borderTop: '1px solid #1D1C2314' }}
                    >
                      {value?.description}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export const ModelDataRender: ModelDataRender = {
  error: (error?: string) => (
    <RawContent structuredContent={error ?? ''} tagType={TagType.Error} />
  ),
  input: (input, attrTos) => (
    <SpanFieldRender
      attrTos={attrTos}
      messages={input}
      tagType={TagType.Input}
    />
  ),
  output: (output, attrTos) => (
    <SpanFieldRender
      attrTos={attrTos}
      messages={output.choices.reduce((acc, cur) => {
        acc.push(cur.message);
        return acc;
      }, [] as RawMessage[])}
      tagType={TagType.Output}
    />
  ),
  reasoningContent: (reasoningContent?: string) => (
    <RawContent
      structuredContent={reasoningContent ?? ''}
      tagType={TagType.ReasoningContent}
    />
  ),
  tool: ModelTool,
} as const;
