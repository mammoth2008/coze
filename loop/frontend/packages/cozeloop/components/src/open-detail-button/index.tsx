// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import classNames from 'classnames';
import { I18n } from '@cozeloop/i18n-adapter';
import { IconCozLongArrowTopRight } from '@coze-arch/coze-design/icons';
import { Tooltip, Button } from '@coze-arch/coze-design';

interface Props {
  url: string;
  className?: string;
}

export function OpenDetailButton({ url, className }: Props) {
  return (
    <Tooltip theme="dark" content={I18n.t('view_detail')}>
      <Button
        onClick={e => {
          e.stopPropagation();
          window.open(url);
        }}
        className={classNames(
          'flex-shrink-0 !h-6 !w-6 !min-w-[24px] !p-[5px]',
          className,
        )}
        size="small"
        color="secondary"
        icon={
          <IconCozLongArrowTopRight className="h-[14px] w-[14px] coz-fg-secondary" />
        }
      ></Button>
    </Tooltip>
  );
}
