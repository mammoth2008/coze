// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0

package convertor

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/coze-dev/coze-loop/backend/kitex_gen/coze/loop/prompt/domain/prompt"
	"github.com/coze-dev/coze-loop/backend/kitex_gen/coze/loop/prompt/openapi"
	"github.com/coze-dev/coze-loop/backend/modules/prompt/domain/entity"
	"github.com/coze-dev/coze-loop/backend/pkg/lang/ptr"
)

type openAPIPromptTestCase struct {
	name string
	do   *entity.Prompt
	dto  *openapi.Prompt
}

func mockOpenAPIPromptCases() []openAPIPromptTestCase {
	return []openAPIPromptTestCase{
		{
			name: "nil input",
			do:   nil,
			dto:  nil,
		},
		{
			name: "empty prompt",
			do: &entity.Prompt{
				ID:        0,
				SpaceID:   0,
				PromptKey: "",
			},
			dto: &openapi.Prompt{
				WorkspaceID: ptr.Of(int64(0)),
				PromptKey:   ptr.Of(""),
				Version:     ptr.Of(""),
			},
		},
		{
			name: "basic prompt with only ID and workspace",
			do: &entity.Prompt{
				ID:        123,
				SpaceID:   456,
				PromptKey: "test_prompt",
				PromptCommit: &entity.PromptCommit{
					CommitInfo: &entity.CommitInfo{
						Version: "1.0.0",
					},
				},
			},
			dto: &openapi.Prompt{
				WorkspaceID: ptr.Of(int64(456)),
				PromptKey:   ptr.Of("test_prompt"),
				Version:     ptr.Of("1.0.0"),
			},
		},
		{
			name: "prompt with template only",
			do: &entity.Prompt{
				ID:        123,
				SpaceID:   456,
				PromptKey: "test_prompt",
				PromptBasic: &entity.PromptBasic{
					LatestVersion: "1.0.0",
				},
				PromptCommit: &entity.PromptCommit{
					CommitInfo: &entity.CommitInfo{
						Version: "1.0.0",
					},
					PromptDetail: &entity.PromptDetail{
						PromptTemplate: &entity.PromptTemplate{
							TemplateType: entity.TemplateTypeNormal,
							Messages: []*entity.Message{
								{
									Role:    entity.RoleSystem,
									Content: ptr.Of("You are a helpful assistant."),
								},
							},
							VariableDefs: []*entity.VariableDef{
								{
									Key:  "var1",
									Desc: "Variable 1",
									Type: entity.VariableTypeString,
								},
							},
						},
					},
				},
			},
			dto: &openapi.Prompt{
				WorkspaceID: ptr.Of(int64(456)),
				PromptKey:   ptr.Of("test_prompt"),
				Version:     ptr.Of("1.0.0"),
				PromptTemplate: &openapi.PromptTemplate{
					TemplateType: ptr.Of(prompt.TemplateTypeNormal),
					Messages: []*openapi.Message{
						{
							Role:    ptr.Of(prompt.RoleSystem),
							Content: ptr.Of("You are a helpful assistant."),
						},
					},
					VariableDefs: []*openapi.VariableDef{
						{
							Key:  ptr.Of("var1"),
							Desc: ptr.Of("Variable 1"),
							Type: ptr.Of(prompt.VariableTypeString),
						},
					},
				},
			},
		},
		{
			name: "prompt with tools only",
			do: &entity.Prompt{
				ID:        123,
				SpaceID:   456,
				PromptKey: "test_prompt",
				PromptBasic: &entity.PromptBasic{
					LatestVersion: "1.0.0",
				},
				PromptCommit: &entity.PromptCommit{
					CommitInfo: &entity.CommitInfo{
						Version: "1.0.0",
					},
					PromptDetail: &entity.PromptDetail{
						Tools: []*entity.Tool{
							{
								Type: entity.ToolTypeFunction,
								Function: &entity.Function{
									Name:        "test_function",
									Description: "Test Function",
									Parameters:  `{"type":"object","properties":{}}`,
								},
							},
						},
					},
				},
			},
			dto: &openapi.Prompt{
				WorkspaceID: ptr.Of(int64(456)),
				PromptKey:   ptr.Of("test_prompt"),
				Version:     ptr.Of("1.0.0"),
				Tools: []*openapi.Tool{
					{
						Type: ptr.Of(prompt.ToolTypeFunction),
						Function: &openapi.Function{
							Name:        ptr.Of("test_function"),
							Description: ptr.Of("Test Function"),
							Parameters:  ptr.Of(`{"type":"object","properties":{}}`),
						},
					},
				},
			},
		},
		{
			name: "prompt with tool call config only",
			do: &entity.Prompt{
				ID:        123,
				SpaceID:   456,
				PromptKey: "test_prompt",
				PromptBasic: &entity.PromptBasic{
					LatestVersion: "1.0.0",
				},
				PromptCommit: &entity.PromptCommit{
					CommitInfo: &entity.CommitInfo{
						Version: "1.0.0",
					},
					PromptDetail: &entity.PromptDetail{
						ToolCallConfig: &entity.ToolCallConfig{
							ToolChoice: entity.ToolChoiceTypeAuto,
						},
					},
				},
			},
			dto: &openapi.Prompt{
				WorkspaceID: ptr.Of(int64(456)),
				PromptKey:   ptr.Of("test_prompt"),
				Version:     ptr.Of("1.0.0"),
				ToolCallConfig: &openapi.ToolCallConfig{
					ToolChoice: ptr.Of(prompt.ToolChoiceTypeAuto),
				},
			},
		},
		{
			name: "prompt with model config only",
			do: &entity.Prompt{
				ID:        123,
				SpaceID:   456,
				PromptKey: "test_prompt",
				PromptBasic: &entity.PromptBasic{
					LatestVersion: "1.0.0",
				},
				PromptCommit: &entity.PromptCommit{
					CommitInfo: &entity.CommitInfo{
						Version: "1.0.0",
					},
					PromptDetail: &entity.PromptDetail{
						ModelConfig: &entity.ModelConfig{
							ModelID:          789,
							Temperature:      ptr.Of(0.7),
							MaxTokens:        ptr.Of(int32(1000)),
							TopK:             ptr.Of(int32(50)),
							TopP:             ptr.Of(0.9),
							PresencePenalty:  ptr.Of(0.5),
							FrequencyPenalty: ptr.Of(0.5),
							JSONMode:         ptr.Of(true),
						},
					},
				},
			},
			dto: &openapi.Prompt{
				WorkspaceID: ptr.Of(int64(456)),
				PromptKey:   ptr.Of("test_prompt"),
				Version:     ptr.Of("1.0.0"),
				LlmConfig: &openapi.LLMConfig{
					Temperature:      ptr.Of(0.7),
					MaxTokens:        ptr.Of(int32(1000)),
					TopK:             ptr.Of(int32(50)),
					TopP:             ptr.Of(0.9),
					PresencePenalty:  ptr.Of(0.5),
					FrequencyPenalty: ptr.Of(0.5),
					JSONMode:         ptr.Of(true),
				},
			},
		},
		{
			name: "complete prompt with all fields",
			do: &entity.Prompt{
				ID:        123,
				SpaceID:   456,
				PromptKey: "test_prompt",
				PromptBasic: &entity.PromptBasic{
					LatestVersion: "1.0.0",
				},
				PromptCommit: &entity.PromptCommit{
					CommitInfo: &entity.CommitInfo{
						Version: "1.0.0",
					},
					PromptDetail: &entity.PromptDetail{
						PromptTemplate: &entity.PromptTemplate{
							TemplateType: entity.TemplateTypeNormal,
							Messages: []*entity.Message{
								{
									Role:    entity.RoleSystem,
									Content: ptr.Of("You are a helpful assistant."),
								},
							},
							VariableDefs: []*entity.VariableDef{
								{
									Key:  "var1",
									Desc: "Variable 1",
									Type: entity.VariableTypeString,
								},
							},
						},
						Tools: []*entity.Tool{
							{
								Type: entity.ToolTypeFunction,
								Function: &entity.Function{
									Name:        "test_function",
									Description: "Test Function",
									Parameters:  `{"type":"object","properties":{}}`,
								},
							},
						},
						ToolCallConfig: &entity.ToolCallConfig{
							ToolChoice: entity.ToolChoiceTypeAuto,
						},
						ModelConfig: &entity.ModelConfig{
							ModelID:          789,
							Temperature:      ptr.Of(0.7),
							MaxTokens:        ptr.Of(int32(1000)),
							TopK:             ptr.Of(int32(50)),
							TopP:             ptr.Of(0.9),
							PresencePenalty:  ptr.Of(0.5),
							FrequencyPenalty: ptr.Of(0.5),
							JSONMode:         ptr.Of(true),
						},
					},
				},
			},
			dto: &openapi.Prompt{
				WorkspaceID: ptr.Of(int64(456)),
				PromptKey:   ptr.Of("test_prompt"),
				Version:     ptr.Of("1.0.0"),
				PromptTemplate: &openapi.PromptTemplate{
					TemplateType: ptr.Of(prompt.TemplateTypeNormal),
					Messages: []*openapi.Message{
						{
							Role:    ptr.Of(prompt.RoleSystem),
							Content: ptr.Of("You are a helpful assistant."),
						},
					},
					VariableDefs: []*openapi.VariableDef{
						{
							Key:  ptr.Of("var1"),
							Desc: ptr.Of("Variable 1"),
							Type: ptr.Of(prompt.VariableTypeString),
						},
					},
				},
				Tools: []*openapi.Tool{
					{
						Type: ptr.Of(prompt.ToolTypeFunction),
						Function: &openapi.Function{
							Name:        ptr.Of("test_function"),
							Description: ptr.Of("Test Function"),
							Parameters:  ptr.Of(`{"type":"object","properties":{}}`),
						},
					},
				},
				ToolCallConfig: &openapi.ToolCallConfig{
					ToolChoice: ptr.Of(prompt.ToolChoiceTypeAuto),
				},
				LlmConfig: &openapi.LLMConfig{
					Temperature:      ptr.Of(0.7),
					MaxTokens:        ptr.Of(int32(1000)),
					TopK:             ptr.Of(int32(50)),
					TopP:             ptr.Of(0.9),
					PresencePenalty:  ptr.Of(0.5),
					FrequencyPenalty: ptr.Of(0.5),
					JSONMode:         ptr.Of(true),
				},
			},
		},
		{
			name: "prompt with nil prompt detail",
			do: &entity.Prompt{
				ID:        123,
				SpaceID:   456,
				PromptKey: "test_prompt",
				PromptBasic: &entity.PromptBasic{
					LatestVersion: "1.0.0",
				},
				PromptCommit: &entity.PromptCommit{
					CommitInfo: &entity.CommitInfo{
						Version: "1.0.0",
					},
					PromptDetail: nil,
				},
			},
			dto: &openapi.Prompt{
				WorkspaceID: ptr.Of(int64(456)),
				PromptKey:   ptr.Of("test_prompt"),
				Version:     ptr.Of("1.0.0"),
			},
		},
	}
}

func TestOpenAPIPromptDO2DTO(t *testing.T) {
	for _, tt := range mockOpenAPIPromptCases() {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			result := OpenAPIPromptDO2DTO(tt.do)
			assert.Equal(t, tt.dto, result)
		})
	}
}

// 测试单个组件的转换函数
func TestOpenAPIPromptTemplateDO2DTO(t *testing.T) {
	tests := []struct {
		name string
		do   *entity.PromptTemplate
		want *openapi.PromptTemplate
	}{
		{
			name: "nil input",
			do:   nil,
			want: nil,
		},
		{
			name: "valid prompt template",
			do: &entity.PromptTemplate{
				TemplateType: entity.TemplateTypeNormal,
				Messages: []*entity.Message{
					{
						Role:    entity.RoleSystem,
						Content: ptr.Of("You are a helpful assistant."),
					},
				},
				VariableDefs: []*entity.VariableDef{
					{
						Key:  "var1",
						Desc: "Variable 1",
						Type: entity.VariableTypeString,
					},
				},
			},
			want: &openapi.PromptTemplate{
				TemplateType: ptr.Of(prompt.TemplateTypeNormal),
				Messages: []*openapi.Message{
					{
						Role:    ptr.Of(prompt.RoleSystem),
						Content: ptr.Of("You are a helpful assistant."),
					},
				},
				VariableDefs: []*openapi.VariableDef{
					{
						Key:  ptr.Of("var1"),
						Desc: ptr.Of("Variable 1"),
						Type: ptr.Of(prompt.VariableTypeString),
					},
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			assert.Equal(t, tt.want, OpenAPIPromptTemplateDO2DTO(tt.do))
		})
	}
}

func TestOpenAPIModelConfigDO2DTO(t *testing.T) {
	tests := []struct {
		name string
		do   *entity.ModelConfig
		want *openapi.LLMConfig
	}{
		{
			name: "nil input",
			do:   nil,
			want: nil,
		},
		{
			name: "valid model config",
			do: &entity.ModelConfig{
				ModelID:          789,
				Temperature:      ptr.Of(0.7),
				MaxTokens:        ptr.Of(int32(1000)),
				TopK:             ptr.Of(int32(50)),
				TopP:             ptr.Of(0.9),
				PresencePenalty:  ptr.Of(0.5),
				FrequencyPenalty: ptr.Of(0.5),
				JSONMode:         ptr.Of(true),
			},
			want: &openapi.LLMConfig{
				Temperature:      ptr.Of(0.7),
				MaxTokens:        ptr.Of(int32(1000)),
				TopK:             ptr.Of(int32(50)),
				TopP:             ptr.Of(0.9),
				PresencePenalty:  ptr.Of(0.5),
				FrequencyPenalty: ptr.Of(0.5),
				JSONMode:         ptr.Of(true),
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			assert.Equal(t, tt.want, OpenAPIModelConfigDO2DTO(tt.do))
		})
	}
}

func TestOpenAPIToolCallConfigDO2DTO(t *testing.T) {
	tests := []struct {
		name string
		do   *entity.ToolCallConfig
		want *openapi.ToolCallConfig
	}{
		{
			name: "nil input",
			do:   nil,
			want: nil,
		},
		{
			name: "valid tool call config",
			do: &entity.ToolCallConfig{
				ToolChoice: entity.ToolChoiceTypeAuto,
			},
			want: &openapi.ToolCallConfig{
				ToolChoice: ptr.Of(prompt.ToolChoiceTypeAuto),
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			assert.Equal(t, tt.want, OpenAPIToolCallConfigDO2DTO(tt.do))
		})
	}
}
