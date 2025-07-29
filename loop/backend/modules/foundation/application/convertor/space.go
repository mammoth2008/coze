// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0

package convertor

import (
	"strconv"

	"github.com/coze-dev/coze-loop/backend/kitex_gen/coze/loop/foundation/domain/space"
	"github.com/coze-dev/coze-loop/backend/modules/foundation/domain/user/entity"
	"github.com/coze-dev/coze-loop/backend/pkg/lang/conv"
	"github.com/coze-dev/coze-loop/backend/pkg/lang/ptr"
)

func SpaceDO2DTO(spaceDO *entity.Space) *space.Space {
	return &space.Space{
		ID:             spaceDO.ID,
		Name:           spaceDO.Name,
		Description:    spaceDO.Description,
		SpaceType:      space.SpaceType(spaceDO.SpaceType),
		OwnerUserID:    conv.ToString(spaceDO.OwnerID),
		CreateAt:       ptr.Of(spaceDO.CreatedAt.UnixMilli()),
		UpdateAt:       ptr.Of(spaceDO.UpdatedAt.UnixMilli()),
		EnterpriseID:   nil,
		OrganizationID: nil,
	}
}

func SpaceDTO2DO(spaceDTO *space.Space) *entity.Space {
	userID, err := strconv.ParseInt(spaceDTO.OwnerUserID, 10, 64)
	if err != nil {
		return nil
	}

	return &entity.Space{
		ID:          spaceDTO.ID,
		Name:        spaceDTO.Name,
		Description: spaceDTO.Description,
		IconURI:     "",
		SpaceType:   entity.SpaceType(spaceDTO.SpaceType),
		OwnerID:     userID,
	}
}
