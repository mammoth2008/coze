// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
export const LOCAL_STORAGE_KEYS = [
  'workspace-spaceId',
  'playground-info',
  'playground-mockset',
  'trace-selected-columns',
  'trace-columns-key-order',
  'prompt-submit-tip-hide',
  'enterprise-id',
  'create-enterprise-success',
  'navbar-collapsed',
  'metrics-filter',
  'metrics-filter-type',
  'evaluate-used-up-notify',
  // 首次登录标识
  'first-login-flag',
  'metrics-filter-preset-time-range',
  'trace-selected-columns-open',
] as const;

export type LocalStorageKeys = (typeof LOCAL_STORAGE_KEYS)[number];

export type LocalStorageCacheConfigMap = {
  [key in LocalStorageKeys]?: { bindAccount: boolean };
};

export const cacheConfig: LocalStorageCacheConfigMap = {
  'workspace-spaceId': {
    bindAccount: true,
  },
  'trace-selected-columns': {
    bindAccount: true,
  },
  'trace-columns-key-order': {
    bindAccount: true,
  },
  'enterprise-id': {
    bindAccount: true,
  },
  'metrics-filter': {
    bindAccount: true,
  },
  'metrics-filter-type': {
    bindAccount: true,
  },
  'evaluate-used-up-notify': {
    bindAccount: true,
  },
  'first-login-flag': {
    bindAccount: true,
  },
  'metrics-filter-preset-time-range': {
    bindAccount: true,
  },
};
