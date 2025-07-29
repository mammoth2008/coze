// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0

package convert

import (
	"github.com/bytedance/gg/gptr"

	"github.com/coze-dev/coze-loop/backend/modules/evaluation/domain/entity"
	"github.com/coze-dev/coze-loop/backend/modules/evaluation/infra/repo/experiment/mysql/gorm_gen/model"
	"github.com/coze-dev/coze-loop/backend/pkg/lang/conv"
)

func NewExptItemResultConvertor() ExptItemResultConvertor {
	return ExptItemResultConvertor{}
}

type ExptItemResultConvertor struct{}

func (ExptItemResultConvertor) PO2RunLogPO(id int64, result *model.ExptItemResult) *model.ExptItemResultRunLog {
	return &model.ExptItemResultRunLog{
		ID:        id,
		SpaceID:   result.SpaceID,
		ExptID:    result.ExptID,
		ExptRunID: result.ExptRunID,
		ItemID:    result.ItemID,
		Status:    result.Status,
		ErrMsg:    result.ErrMsg,
		LogID:     result.LogID,
	}
}

func (ExptItemResultConvertor) PO2DO(rl *model.ExptItemResult) *entity.ExptItemResult {
	po := &entity.ExptItemResult{
		ID:        rl.ID,
		SpaceID:   rl.SpaceID,
		ExptID:    rl.ExptID,
		ExptRunID: rl.ExptRunID,
		ItemID:    rl.ItemID,
		ItemIdx:   gptr.Indirect(rl.ItemIdx),
		Status:    entity.ItemRunState(rl.Status),
		ErrMsg:    conv.UnsafeBytesToString(gptr.Indirect(rl.ErrMsg)),
		LogID:     rl.LogID,
	}
	return po
}

func (ExptItemResultConvertor) DO2PO(result *entity.ExptItemResult) *model.ExptItemResult {
	po := &model.ExptItemResult{
		ID:        result.ID,
		SpaceID:   result.SpaceID,
		ExptID:    result.ExptID,
		ExptRunID: result.ExptRunID,
		ItemID:    result.ItemID,
		ItemIdx:   gptr.Of(result.ItemIdx),
		Status:    int32(result.Status),
		ErrMsg:    gptr.Of(conv.UnsafeStringToBytes(result.ErrMsg)),
		LogID:     result.LogID,
	}

	return po
}

func NewExptTurnResultConvertor() ExptTurnResultConvertor {
	return ExptTurnResultConvertor{}
}

type ExptTurnResultConvertor struct{}

func (ExptTurnResultConvertor) PO2DO(tr *model.ExptTurnResult, evaluatorResults *entity.EvaluatorResults) *entity.ExptTurnResult {
	return &entity.ExptTurnResult{
		ID:               tr.ID,
		SpaceID:          tr.SpaceID,
		ExptID:           tr.ExptID,
		ExptRunID:        tr.ExptRunID,
		ItemID:           tr.ItemID,
		TurnID:           tr.TurnID,
		Status:           tr.Status,
		TraceID:          tr.TraceID,
		TargetResultID:   tr.TargetResultID,
		LogID:            tr.LogID,
		ErrMsg:           conv.UnsafeBytesToString(gptr.Indirect(tr.ErrMsg)),
		EvaluatorResults: evaluatorResults,
		TurnIdx:          gptr.Indirect(tr.TurnIdx),
	}
}

func (ExptTurnResultConvertor) DO2PO(tr *entity.ExptTurnResult) *model.ExptTurnResult {
	return &model.ExptTurnResult{
		ID:             tr.ID,
		SpaceID:        tr.SpaceID,
		ExptID:         tr.ExptID,
		ExptRunID:      tr.ExptRunID,
		ItemID:         tr.ItemID,
		TurnID:         tr.TurnID,
		Status:         tr.Status,
		TraceID:        tr.TraceID,
		TargetResultID: tr.TargetResultID,
		LogID:          tr.LogID,
		ErrMsg:         gptr.Of(conv.UnsafeStringToBytes(tr.ErrMsg)),
		TurnIdx:        gptr.Of(tr.TurnIdx),
	}
}
