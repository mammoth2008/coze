// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { type Dispatch, type SetStateAction } from 'react';

import { subscribeWithSelector } from 'zustand/middleware';
import { create } from 'zustand';
import { produce } from 'immer';
import {
  type Prompt,
  type Message,
  type VariableDef,
  type ToolCallConfig,
  type ModelConfig,
  type Tool,
} from '@cozeloop/api-schema/prompt';
import { type Model } from '@cozeloop/api-schema/llm-manage';

import { getInputVariablesFromPrompt, getMockVariables } from '@/utils/prompt';

import { usePromptMockDataStore } from './use-mockdata-store';

// import { usePromptMockDataStore } from './use-prompt-mockdata-store';
export interface PromptState {
  promptInfo?: Prompt;
  messageList?: Array<Message & { key?: string }>;
  variables?: Array<VariableDef>;
  toolCallConfig?: ToolCallConfig;
  modelConfig?: ModelConfig;
  tools?: Array<Tool>;
  currentModel?: Model;
}

export type PromptActionType<S> = Dispatch<SetStateAction<S>>;

interface PromptAction {
  setPromptInfo: PromptActionType<Prompt | undefined>;
  setMessageList: PromptActionType<
    Array<Message & { key?: string }> | undefined
  >;
  setVariables: PromptActionType<Array<VariableDef> | undefined>;
  setToolCallConfig: PromptActionType<ToolCallConfig | undefined>;
  setModelConfig: PromptActionType<ModelConfig | undefined>;
  setTools: PromptActionType<Array<Tool> | undefined>;
  setCurrentModel: PromptActionType<Model | undefined>;
  clearStore: () => void;
}

export const usePromptStore = create<PromptState & PromptAction>()(
  subscribeWithSelector((set, get) => ({
    promptInfo: undefined,
    setPromptInfo: (val: SetStateAction<Prompt | undefined>) =>
      set(
        produce((state: PromptState) => {
          state.promptInfo =
            val instanceof Function ? val(get().promptInfo) : val;
        }),
      ),
    messageList: [],
    setMessageList: (
      val: SetStateAction<Array<Message & { key?: string }> | undefined>,
    ) => {
      set(
        produce((state: PromptState) => {
          state.messageList =
            val instanceof Function ? val(get().messageList) : val;
        }),
      );
      const { messageList = [] } = get();
      const { mockVariables = [], setMockVariables } =
        usePromptMockDataStore.getState();
      const variables = getInputVariablesFromPrompt(messageList);
      const newMockVariables = getMockVariables(variables, mockVariables);
      set(
        produce(state => {
          state.variables = variables;
        }),
      );
      setMockVariables(newMockVariables);
    },
    variables: [],
    setVariables: (val: SetStateAction<Array<VariableDef> | undefined>) =>
      set(
        produce((state: PromptState) => {
          state.variables =
            val instanceof Function ? val(get().variables) : val;
        }),
      ),
    toolCallConfig: undefined,
    setToolCallConfig: (val: SetStateAction<ToolCallConfig | undefined>) =>
      set(
        produce((state: PromptState) => {
          state.toolCallConfig =
            val instanceof Function ? val(get().toolCallConfig) : val;
        }),
      ),
    modelConfig: undefined,
    setModelConfig: (val: SetStateAction<ModelConfig | undefined>) =>
      set(
        produce((state: PromptState) => {
          state.modelConfig =
            val instanceof Function ? val(get().modelConfig) : val;
        }),
      ),
    tools: [],
    setTools: (val: SetStateAction<Array<Tool> | undefined>) =>
      set(
        produce((state: PromptState) => {
          state.tools = val instanceof Function ? val(get().tools) : val;
        }),
      ),
    currentModel: undefined,
    setCurrentModel: (val: SetStateAction<Model | undefined>) =>
      set(
        produce((state: PromptState) => {
          state.currentModel =
            val instanceof Function ? val(get().currentModel) : val;
        }),
      ),
    clearStore: () =>
      set(
        produce((state: PromptState) => {
          state.promptInfo = undefined;
          state.messageList = [];
          state.variables = [];
          state.toolCallConfig = undefined;
          state.modelConfig = undefined;
          state.tools = [];
          state.currentModel = undefined;
        }),
      ),
  })),
);
