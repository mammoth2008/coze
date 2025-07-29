// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { createRenderer, option } from '@coze-editor/editor/react';
import universal from '@coze-editor/editor/preset-universal';
import { mixLanguages } from '@coze-editor/editor';
import { keymap, EditorView } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';

const RawEditorTheme = EditorView.theme({
  '&.cm-editor': {
    outline: 'none',
  },
  '&.cm-content': {
    wordBreak: 'break-all',
  },
});

const minHeightOption = (value?: string | number) =>
  EditorView.theme({
    '.cm-content, .cm-gutter, .cm-right-gutter': {
      minHeight:
        typeof value === 'number'
          ? `${value}px`
          : typeof value === 'string'
            ? value
            : 'unset',
    },
  });

const lineHeightOption = (value?: string | number) =>
  EditorView.theme({
    '.cm-content, .cm-gutter, .cm-right-gutter': {
      lineHeight:
        typeof value === 'number'
          ? `${value}px`
          : typeof value === 'string'
            ? value
            : 'unset',
    },
  });

const extensions = [
  mixLanguages({}),
  RawEditorTheme,
  // ...其他 extensions
  history(),
  keymap.of([...defaultKeymap, ...historyKeymap]),
];

export const TextEditor = createRenderer(
  [
    ...universal,
    option('minHeight', minHeightOption),
    option('lineHeight', lineHeightOption),
  ],
  extensions,
);
