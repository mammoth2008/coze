// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';

import { PageLoading } from '@cozeloop/components';

import { routeConfig } from './routes';
import { useSetupI18n } from './hooks';
import { LocaleProvider } from './components';

import './index.css';

const router = createBrowserRouter(routeConfig);

export function App() {
  useSetupI18n();

  return (
    <Suspense fallback={<PageLoading />}>
      <LocaleProvider>
        <RouterProvider router={router} />
      </LocaleProvider>
    </Suspense>
  );
}
