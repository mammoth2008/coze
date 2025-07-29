// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0

package mq

import (
	"context"

	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity"
)

//go:generate mockgen -destination=mocks/producer.go -package=mocks . ITraceProducer
type ITraceProducer interface {
	IngestSpans(ctx context.Context, data *entity.TraceData) error
}
