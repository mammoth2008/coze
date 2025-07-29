// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

import { type SizedColumn } from '../typings/index';

export const useSizedColumns = (
  containerWidth: number,
  columns: SizedColumn[],
) => {
  const [sizedColumns, setSizedColumns] = useState(columns);
  useEffect(() => {
    const totalSize = columns.reduce(
      (prev, current) => prev + (current.width ?? 0),
      0,
    );

    if (totalSize < containerWidth) {
      const newColumns = columns.map(column => {
        const { width: colWidth } = column;
        const newWidth = Math.floor(
          ((colWidth ?? 0) / totalSize) * containerWidth,
        );
        return { ...column, width: newWidth };
      });
      setSizedColumns(newColumns);
    } else {
      setSizedColumns(columns);
    }
  }, [containerWidth, columns]);
  return sizedColumns;
};
