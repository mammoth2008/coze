// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import classNames from 'classnames';
import { FieldDisplayFormat } from '@cozeloop/api-schema/data';
import { Typography } from '@coze-arch/coze-design';

import { LoopTag } from '../tag';
import { getColumnType } from './util';
import {
  DataType,
  dataTypeMap,
  displayFormatType,
  type DatasetItemProps,
} from './type';
import { TextDatasetItem } from './text';
import { MultipartDatasetItem } from './multipart';
import { ImageDatasetItem } from './image';
import { EmptyDatasetItem } from './empty';
import { AudioDatasetItem } from './audio';

const ItemContenRenderMap = {
  text: TextDatasetItem,
  image: ImageDatasetItem,
  audio: AudioDatasetItem,
  multipart: MultipartDatasetItem,
};

export const DatasetItem = (props: DatasetItemProps) => {
  const {
    fieldSchema,
    fieldContent,
    showColumnKey,
    className,
    isEdit,
    showEmpty,
  } = props;
  const Component =
    ItemContenRenderMap[fieldContent?.content_type || 'text'] ||
    TextDatasetItem;
  return (
    <div className={classNames('flex flex-col gap-2', className)}>
      {showColumnKey ? (
        <div className="flex items-center gap-1">
          <Typography.Text className="text-[14px] !font-medium">
            {fieldSchema?.name}
          </Typography.Text>
          <LoopTag color="primary">
            {dataTypeMap[getColumnType(fieldSchema)] ||
              dataTypeMap[DataType.String]}
          </LoopTag>
          <LoopTag color="primary">
            {
              displayFormatType[
                fieldContent?.format ||
                  fieldSchema?.default_display_format ||
                  FieldDisplayFormat.PlainText
              ]
            }
          </LoopTag>
        </div>
      ) : null}
      {showEmpty && fieldContent?.text === undefined && !isEdit ? (
        <EmptyDatasetItem />
      ) : (
        <Component {...props} />
      )}
    </div>
  );
};
