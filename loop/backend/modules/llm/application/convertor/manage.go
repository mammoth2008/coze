// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0

package convertor

import (
	"github.com/coze-dev/coze-loop/backend/kitex_gen/coze/loop/llm/domain/common"
	"github.com/coze-dev/coze-loop/backend/kitex_gen/coze/loop/llm/domain/manage"
	"github.com/coze-dev/coze-loop/backend/modules/llm/domain/entity"
	"github.com/coze-dev/coze-loop/backend/pkg/lang/ptr"
	"github.com/coze-dev/coze-loop/backend/pkg/lang/slices"
)

func ModelsDO2DTO(models []*entity.Model, mask bool) []*manage.Model {
	return slices.Transform(models, func(model *entity.Model, _ int) *manage.Model {
		return ModelDO2DTO(model, mask)
	})
}

func ModelDO2DTO(model *entity.Model, mask bool) *manage.Model {
	if model == nil {
		return nil
	}
	var pc *manage.ProtocolConfig
	if !mask {
		pc = ProtocolConfigDO2DTO(model.ProtocolConfig)
	}
	return &manage.Model{
		ModelID:         ptr.Of(model.ID),
		WorkspaceID:     ptr.Of(model.WorkspaceID),
		Name:            ptr.Of(model.Name),
		Desc:            ptr.Of(model.Desc),
		Ability:         AbilityDO2DTO(model.Ability),
		Protocol:        ptr.Of(manage.Protocol(model.Protocol)),
		ProtocolConfig:  pc,
		ScenarioConfigs: ScenarioConfigMapDO2DTO(model.ScenarioConfigs),
		ParamConfig:     ParamConfigDO2DTO(model.ParamConfig),
	}
}

func AbilityDO2DTO(a *entity.Ability) *manage.Ability {
	if a == nil {
		return nil
	}
	return &manage.Ability{
		MaxContextTokens:  a.MaxContextTokens,
		MaxInputTokens:    a.MaxInputTokens,
		MaxOutputTokens:   a.MaxOutputTokens,
		FunctionCall:      ptr.Of(a.FunctionCall),
		JSONMode:          ptr.Of(a.JsonMode),
		MultiModal:        ptr.Of(a.MultiModal),
		AbilityMultiModal: AbilityMultiModalDO2DTO(a.AbilityMultiModal),
	}
}

func AbilityMultiModalDO2DTO(a *entity.AbilityMultiModal) *manage.AbilityMultiModal {
	if a == nil {
		return nil
	}
	return &manage.AbilityMultiModal{
		Image:        ptr.Of(a.Image),
		AbilityImage: AbilityImageDO2DTO(a.AbilityImage),
	}
}

func AbilityImageDO2DTO(a *entity.AbilityImage) *manage.AbilityImage {
	if a == nil {
		return nil
	}
	return &manage.AbilityImage{
		URLEnabled:    ptr.Of(a.URLEnabled),
		BinaryEnabled: ptr.Of(a.BinaryEnabled),
		MaxImageSize:  ptr.Of(a.MaxImageSize),
		MaxImageCount: ptr.Of(a.MaxImageCount),
	}
}

func ProtocolConfigDO2DTO(p *entity.ProtocolConfig) *manage.ProtocolConfig {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfig{
		BaseURL:                ptr.Of(p.BaseURL),
		APIKey:                 ptr.Of(p.APIKey),
		Model:                  ptr.Of(p.Model),
		ProtocolConfigArk:      ProtocolConfigArkDO2DTO(p.ProtocolConfigArk),
		ProtocolConfigOpenai:   ProtocolConfigOpenaiDO2DTO(p.ProtocolConfigOpenAI),
		ProtocolConfigClaude:   ProtocolConfigClaudeDO2DTO(p.ProtocolConfigClaude),
		ProtocolConfigDeepseek: ProtocolConfigDeepSeekDO2DTO(p.ProtocolConfigDeepSeek),
		ProtocolConfigGemini:   ProtocolConfigGeminiDO2DTO(p.ProtocolConfigGemini),
		ProtocolConfigQwen:     ProtocolConfigQwenDO2DTO(p.ProtocolConfigQwen),
		ProtocolConfigQianfan:  ProtocolConfigQianfanDO2DTO(p.ProtocolConfigQianfan),
		ProtocolConfigOllama:   ProtocolConfigOllamaDO2DTO(p.ProtocolConfigOllama),
		ProtocolConfigArkbot:   ProtocolConfigArkbotDO2DTO(p.ProtocolConfigArkBot),
	}
}

func ProtocolConfigArkDO2DTO(p *entity.ProtocolConfigArk) *manage.ProtocolConfigArk {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfigArk{
		Region:        ptr.Of(p.Region),
		AccessKey:     ptr.Of(p.AccessKey),
		SecretKey:     ptr.Of(p.SecretKey),
		RetryTimes:    p.RetryTimes,
		CustomHeaders: p.CustomHeaders,
	}
}

func ProtocolConfigOpenaiDO2DTO(p *entity.ProtocolConfigOpenAI) *manage.ProtocolConfigOpenAI {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfigOpenAI{
		ByAzure:                  ptr.Of(p.ByAzure),
		APIVersion:               ptr.Of(p.ApiVersion),
		ResponseFormatType:       ptr.Of(p.ResponseFormatType),
		ResponseFormatJSONSchema: ptr.Of(p.ResponseFormatJsonSchema),
	}
}

func ProtocolConfigClaudeDO2DTO(p *entity.ProtocolConfigClaude) *manage.ProtocolConfigClaude {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfigClaude{
		ByBedrock:       ptr.Of(p.ByBedrock),
		AccessKey:       ptr.Of(p.AccessKey),
		SecretAccessKey: ptr.Of(p.SecretAccessKey),
		SessionToken:    ptr.Of(p.SessionToken),
		Region:          ptr.Of(p.Region),
	}
}

func ProtocolConfigDeepSeekDO2DTO(p *entity.ProtocolConfigDeepSeek) *manage.ProtocolConfigDeepSeek {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfigDeepSeek{ResponseFormatType: ptr.Of(p.ResponseFormatType)}
}

func ProtocolConfigGeminiDO2DTO(p *entity.ProtocolConfigGemini) *manage.ProtocolConfigGemini {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfigGemini{
		ResponseSchema:      p.ResponseSchema,
		EnableCodeExecution: ptr.Of(p.EnableCodeExecution),
		SafetySettings: slices.Transform(p.SafetySettings, func(s entity.ProtocolConfigGeminiSafetySetting, _ int) *manage.ProtocolConfigGeminiSafetySetting {
			return GeminiSafetySettingDO2DTO(s)
		}),
	}
}

func GeminiSafetySettingDO2DTO(s entity.ProtocolConfigGeminiSafetySetting) *manage.ProtocolConfigGeminiSafetySetting {
	return &manage.ProtocolConfigGeminiSafetySetting{
		Category:  ptr.Of(s.Category),
		Threshold: ptr.Of(s.Threshold),
	}
}

func ProtocolConfigQwenDO2DTO(p *entity.ProtocolConfigQwen) *manage.ProtocolConfigQwen {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfigQwen{
		ResponseFormatType:       p.ResponseFormatType,
		ResponseFormatJSONSchema: p.ResponseFormatJsonSchema,
	}
}

func ProtocolConfigQianfanDO2DTO(p *entity.ProtocolConfigQianfan) *manage.ProtocolConfigQianfan {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfigQianfan{
		LlmRetryCount: ptr.PtrConvert(p.LLMRetryCount, func(f int) int32 {
			return int32(f)
		}),
		LlmRetryTimeout: ptr.PtrConvert(p.LLMRetryTimeout, func(f float32) float64 {
			return float64(f)
		}),
		LlmRetryBackoffFactor: ptr.PtrConvert(p.LLMRetryBackoffFactor, func(f float32) float64 {
			return float64(f)
		}),
		ParallelToolCalls:        p.ParallelToolCalls,
		ResponseFormatType:       p.ResponseFormatType,
		ResponseFormatJSONSchema: p.ResponseFormatJsonSchema,
	}
}

func ProtocolConfigOllamaDO2DTO(p *entity.ProtocolConfigOllama) *manage.ProtocolConfigOllama {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfigOllama{
		Format:      p.Format,
		KeepAliveMs: p.KeepAliveMs,
	}
}

func ProtocolConfigArkbotDO2DTO(p *entity.ProtocolConfigArkBot) *manage.ProtocolConfigArkbot {
	if p == nil {
		return nil
	}
	return &manage.ProtocolConfigArkbot{
		Region:        ptr.Of(p.Region),
		AccessKey:     ptr.Of(p.AccessKey),
		SecretKey:     ptr.Of(p.SecretKey),
		RetryTimes:    p.RetryTimes,
		CustomHeaders: p.CustomHeaders,
	}
}

func ScenarioConfigMapDO2DTO(s map[entity.Scenario]*entity.ScenarioConfig) map[common.Scenario]*manage.ScenarioConfig {
	if s == nil {
		return nil
	}
	res := make(map[common.Scenario]*manage.ScenarioConfig)
	for k, v := range s {
		res[ScenarioDO2DTO(k)] = ScenarioConfigDO2DTO(v)
	}
	return res
}

func ScenarioConfigDO2DTO(s *entity.ScenarioConfig) *manage.ScenarioConfig {
	if s == nil {
		return nil
	}
	return &manage.ScenarioConfig{
		Scenario:    ptr.Of(ScenarioDO2DTO(s.Scenario)),
		Quota:       QuotaDO2DTO(s.Quota),
		Unavailable: ptr.Of(s.Unavailable),
	}
}

func QuotaDO2DTO(q *entity.Quota) *manage.Quota {
	if q == nil {
		return nil
	}
	return &manage.Quota{
		Qpm: ptr.Of(q.Qpm),
		Tpm: ptr.Of(q.Tpm),
	}
}

func ParamConfigDO2DTO(p *entity.ParamConfig) *manage.ParamConfig {
	if p == nil {
		return nil
	}
	return &manage.ParamConfig{
		ParamSchemas: slices.Transform(p.ParamSchemas, func(s *entity.ParamSchema, _ int) *manage.ParamSchema {
			return ParamSchemaDO2DTO(s)
		}),
	}
}

func ParamSchemaDO2DTO(ps *entity.ParamSchema) *manage.ParamSchema {
	if ps == nil {
		return nil
	}
	return &manage.ParamSchema{
		Name:         ptr.Of(ps.Name),
		Label:        ptr.Of(ps.Label),
		Desc:         ptr.Of(ps.Desc),
		Type:         ptr.Of(manage.ParamType(ps.Type)),
		Min:          ptr.Of(ps.Min),
		Max:          ptr.Of(ps.Max),
		DefaultValue: ptr.Of(ps.DefaultValue),
		Options:      ParamOptionsDO2DTO(ps.Options),
	}
}

func ParamOptionsDO2DTO(os []*entity.ParamOption) []*manage.ParamOption {
	return slices.Transform(os, func(o *entity.ParamOption, _ int) *manage.ParamOption {
		return ParamOptionDO2DTO(o)
	})
}

func ParamOptionDO2DTO(o *entity.ParamOption) *manage.ParamOption {
	if o == nil {
		return nil
	}
	return &manage.ParamOption{
		Value: ptr.Of(o.Value),
		Label: ptr.Of(o.Label),
	}
}
