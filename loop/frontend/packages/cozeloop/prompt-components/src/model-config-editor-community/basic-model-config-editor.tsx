// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { useLatest } from 'ahooks';
import { I18n } from '@cozeloop/i18n-adapter';
import { type Model } from '@cozeloop/api-schema/llm-manage';
import {
  Form,
  type FormApi,
  type SelectProps,
  Typography,
} from '@coze-arch/coze-design';

import { convertModelToModelConfig, type ModelConfigWithName } from './utils';
import { ModelSelectWithObject } from './model-select';
import { ModelConfigFormCommunity } from './model-config-form-community';

export interface BasicModelConfigPopoverProps {
  models?: Model[] | undefined;
  value?: ModelConfigWithName;
  disabled?: boolean;
  modelSelectProps?: SelectProps;
  defaultActiveFirstModel?: boolean;
  onChange?: (value?: ModelConfigWithName) => void;
  onModelChange?: (value?: Model) => void;
}

export function BasicModelConfigEditor({
  value,
  disabled,
  modelSelectProps,
  onChange,
  defaultActiveFirstModel = false,
  models = [],
  onModelChange,
}: BasicModelConfigPopoverProps) {
  const formApi = useRef<FormApi<ModelConfigWithName>>();
  const [initValues, setInitValues] = useState<ModelConfigWithName>();
  const [selectModel, setSelectModel] = useState<Model | undefined>();
  const selectModelRef = useLatest(selectModel);
  const loadedRef = useRef(false);

  // 处理默认选中第一个的逻辑
  useEffect(() => {
    // 通过条件：设置了默认选中第一个模型，并且没有传入value，models不为空，没有加载过
    if (
      !defaultActiveFirstModel ||
      value ||
      loadedRef.current ||
      !models?.length
    ) {
      return;
    }
    const model = models[0];
    // 默认选中第一个模型
    if (model) {
      setSelectModel?.(model);
      const modelConfig = convertModelToModelConfig(model);
      setInitValues(modelConfig);
      formApi.current?.setValues?.(modelConfig, {
        isOverride: true,
      });
      onModelChange?.(model);
    }
    loadedRef.current = true;
  }, [value, models]);

  // 处理初始加载时已传入值预览模型的逻辑
  useEffect(() => {
    // 通过条件：传入了value，并且selectModel为空，并且models不为空，并且没有加载过
    if (
      !value ||
      selectModelRef.current ||
      loadedRef.current ||
      !models?.length
    ) {
      return;
    }
    const model = models.find(
      item => `${item.model_id}` === `${value.model_id}`,
    );
    if (model) {
      setSelectModel?.(model);
      onModelChange?.(model);
    } else {
      const newModel = {
        model_id: value.model_id,
        name: value.model_id,
      };
      setSelectModel?.(newModel);
      onModelChange?.(newModel);
    }
    loadedRef.current = true;
  }, [value, models]);

  return (
    <Form<ModelConfigWithName>
      labelWidth={120}
      // 有值时value生效，否则 initValues 生效
      initValues={value || initValues}
      onValueChange={values => {
        onChange?.({ ...values });
      }}
      getFormApi={api => (formApi.current = api)}
      disabled={disabled}
    >
      <ModelSelectWithObject
        {...modelSelectProps}
        className={classNames('grow', modelSelectProps?.className)}
        value={selectModel}
        disabled={disabled}
        onChange={newModel => {
          setSelectModel(newModel);
          const modelConfig = newModel
            ? convertModelToModelConfig(newModel)
            : {};
          setInitValues(modelConfig);
          formApi.current?.setValues?.(modelConfig, {
            isOverride: true,
          });
          onModelChange?.(newModel);
        }}
        modelList={models}
      />

      <Typography.Title heading={6} style={{ marginTop: 12, marginBottom: 12 }}>
        {I18n.t('parameter_config')}
      </Typography.Title>
      <ModelConfigFormCommunity model={selectModel} />
    </Form>
  );
}
