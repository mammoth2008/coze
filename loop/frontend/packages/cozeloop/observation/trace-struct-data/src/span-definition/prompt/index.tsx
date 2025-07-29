// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { isEmpty } from 'lodash-es';

import { safeJsonParse } from '../../utils/json';
import { type RemoveUndefinedOrString } from '../../types/utils';
import { TagType, type Span, type SpanDefinition } from '../../types';
import {
  promptInputSchema,
  type PromptInputSchema,
  promptOutputSchema,
} from './schema';
import { PromptDataRender } from './render';
export type Input = Pick<PromptInputSchema, 'arguments' | 'templates'> | string;
export type Output = { role: string; content?: string }[] | string;

const getInputAndTools = (input: string) => {
  const parsedInput = safeJsonParse(input);

  const validateInput = promptInputSchema.safeParse(parsedInput);

  if (typeof parsedInput === 'string' || !validateInput.success) {
    return {
      input: {
        content: input,
        isValidate: false,
        isEmpty: !input,
        originalContent: input,
        tagType: TagType.Input,
      },
      tool: {
        content: '',
        isValidate: false,
        isEmpty: true,
        originalContent: '',
        tagType: TagType.Functions,
      },
    };
  }

  const { templates } = validateInput.data;

  const inputContent = {
    isValidate: true,
    isEmpty: isEmpty(templates),
    originalContent: input,
    content: {
      templates,
      arguments: validateInput.data.arguments,
    },
    tagType: TagType.Input,
  };

  const toolContent = {
    isValidate: true,
    isEmpty: true,
    content: '',
    originalContent: '',
    tagType: TagType.Functions,
  };

  return {
    input: inputContent,
    tool: toolContent,
  };
};
const getOutputAndReasoningContent = (output: string) => {
  const parsedOutput = safeJsonParse(output);

  const validateOutput = promptOutputSchema.safeParse(parsedOutput);

  if (typeof parsedOutput === 'string' || !validateOutput.success) {
    return {
      output: {
        content: output,
        isValidate: false,
        isEmpty: !output,
        originalContent: output,
        tagType: TagType.Output,
      },
      reasoningContent: {
        content: '',
        isValidate: true,
        isEmpty: true,
        originalContent: '',
        tagType: TagType.ReasoningContent,
      },
    };
  }

  const prompts = validateOutput.data;

  let promptsContent: { role: string; content?: string }[] = [];

  if (Array.isArray(prompts)) {
    promptsContent = prompts;
  } else {
    promptsContent = (prompts?.prompts ?? []).map(m => ({
      role: m.role,
      content: m.content,
    }));
  }

  const outputContent = {
    isValidate: true,
    isEmpty: isEmpty(prompts),
    content: promptsContent,
    originalContent: output,
    tagType: TagType.Output,
  };

  return {
    output: outputContent,
    reasoningContent: {
      isValidate: true,
      isEmpty: true,
      content: '',
      originalContent: '',
      tagType: TagType.ReasoningContent,
    },
  };
};

export class PromptSpanDefinition
  implements SpanDefinition<string, Input, Output>
{
  name = 'prompt';
  inputSchema = promptInputSchema;
  outputSchema = promptOutputSchema;

  parseSpanContent(span: Span) {
    const { input, output } = span;
    const { error } = span.custom_tags ?? {};
    return {
      error: {
        isValidate: true,
        isEmpty: !error,
        content: error,
        originalContent: error,
        tagType: TagType.Error,
      },
      ...getInputAndTools(input),
      ...getOutputAndReasoningContent(output),
    };
  }

  renderError(_span: Span, errorContent: string) {
    return PromptDataRender.error(errorContent);
  }
  renderInput(_span: Span, inputContent: Input) {
    return PromptDataRender.input(
      inputContent as RemoveUndefinedOrString<Input>,
      _span.attr_tos,
    );
  }
  renderOutput(_span: Span, outputContent: Output) {
    return PromptDataRender.output(
      outputContent as RemoveUndefinedOrString<Output>,
      _span.attr_tos,
    );
  }
  renderTool(_span: Span, toolContent: string) {
    return PromptDataRender.tool(
      toolContent as RemoveUndefinedOrString<string>,
    );
  }
  renderReasoningContent(_span: Span, reasoningContent: string | undefined) {
    return PromptDataRender.reasoningContent(reasoningContent);
  }
}
