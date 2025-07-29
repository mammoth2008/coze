// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import classNames from 'classnames';
import { Typography } from '@coze-arch/coze-design';

export function DevLayout({
  title,
  actionBtns,
  children,
  className,
  style,
}: {
  title: string;
  actionBtns?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={classNames('flex flex-col h-full w-full', className)}
      style={style}
    >
      <div
        className="h-[40px] px-6 py-2 box-border coz-fg-plus w-full border-0 border-t border-b border-solid flex justify-between items-center"
        style={{ background: '#F6F6FB' }}
      >
        <Typography.Text strong>{title}</Typography.Text>
        {actionBtns}
      </div>
      {children}
    </div>
  );
}
