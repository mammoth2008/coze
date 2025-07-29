// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0

package service

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"

	mqmocks "github.com/coze-dev/coze-loop/backend/infra/mq/mocks"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity/collector/component"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity/collector/exporter"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity/collector/processor"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/entity/collector/receiver"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/service/collector/exporter/clickhouseexporter"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/service/collector/processor/queueprocessor"
	"github.com/coze-dev/coze-loop/backend/modules/observability/domain/trace/service/collector/receiver/rmqreceiver"
)

func TestService_Start(t *testing.T) {
	type fields struct {
		set Settings
	}
	type args struct {
		ctx context.Context
	}
	tests := []struct {
		name         string
		args         args
		want         *Graph
		wantErr      bool
		fieldsGetter func(ctrl *gomock.Controller) fields
	}{
		{
			name: "build service successfully",
			args: args{
				ctx: context.Background(),
			},
			fieldsGetter: func(ctrl *gomock.Controller) fields {
				mqConsumer := mqmocks.NewMockIConsumer(ctrl)
				mqConsumer.EXPECT().Start().Return(nil)
				mqConsumer.EXPECT().Close().Return(nil)
				mqConsumer.EXPECT().RegisterHandler(gomock.Any()).Return()
				mqFactory := mqmocks.NewMockIFactory(ctrl)
				mqFactory.EXPECT().NewConsumer(gomock.Any()).Return(mqConsumer, nil)
				// receiver
				receiverId := getComponentID("rmq/default")
				receiverBuilder := receiver.NewBuilder(map[component.ID]component.Config{
					receiverId: &rmqreceiver.Config{
						Addr:          []string{"a"},
						ConsumerGroup: "a",
						Topic:         "b",
					},
				}, map[component.Type]receiver.Factory{
					receiverId.Type(): rmqreceiver.NewFactory(mqFactory),
				})
				// processor
				processorId := getComponentID("queue/default")
				processorBuilder := processor.NewBuilder(map[component.ID]component.Config{
					processorId: &queueprocessor.Config{
						PoolName:        "1",
						MaxPoolSize:     1,
						QueueSize:       1,
						MaxBatchSize:    1,
						TickIntervalsMs: 1,
						ShardCount:      1,
					},
				}, map[component.Type]processor.Factory{
					processorId.Type(): queueprocessor.NewFactory(),
				})
				// exporter
				exporterId := getComponentID("clickhouse/default")
				exporterBuilder := exporter.NewBuilder(map[component.ID]component.Config{
					exporterId: &clickhouseexporter.Config{},
				}, map[component.Type]exporter.Factory{
					exporterId.Type(): clickhouseexporter.NewFactory(nil),
				})
				return fields{
					set: Settings{
						ReceiverBuilder:  receiverBuilder,
						ProcessorBuilder: processorBuilder,
						ExporterBuilder:  exporterBuilder,
						PipelineConfig: &Config{
							Receivers:  []component.ID{receiverId},
							Processors: []component.ID{processorId},
							Exporters:  []component.ID{exporterId},
						},
					},
				}
			},
			wantErr: false,
		},
		{
			name: "start service failed",
			args: args{
				ctx: context.Background(),
			},
			fieldsGetter: func(ctrl *gomock.Controller) fields {
				mqConsumer := mqmocks.NewMockIConsumer(ctrl)
				mqConsumer.EXPECT().Start().Return(assert.AnError)
				mqConsumer.EXPECT().Close().Return(nil)
				mqConsumer.EXPECT().RegisterHandler(gomock.Any()).Return()
				mqFactory := mqmocks.NewMockIFactory(ctrl)
				mqFactory.EXPECT().NewConsumer(gomock.Any()).Return(mqConsumer, nil)
				// receiver
				receiverId := getComponentID("rmq/default")
				receiverBuilder := receiver.NewBuilder(map[component.ID]component.Config{
					receiverId: &rmqreceiver.Config{
						Addr:          []string{""},
						ConsumerGroup: "",
						Topic:         "b",
					},
				}, map[component.Type]receiver.Factory{
					receiverId.Type(): rmqreceiver.NewFactory(mqFactory),
				})
				// processor
				processorId := getComponentID("queue/default")
				processorBuilder := processor.NewBuilder(map[component.ID]component.Config{
					processorId: &queueprocessor.Config{
						PoolName:        "1",
						MaxPoolSize:     1,
						QueueSize:       1,
						MaxBatchSize:    1,
						TickIntervalsMs: 1,
						ShardCount:      1,
					},
				}, map[component.Type]processor.Factory{
					processorId.Type(): queueprocessor.NewFactory(),
				})
				// exporter
				exporterId := getComponentID("clickhouse/default")
				exporterBuilder := exporter.NewBuilder(map[component.ID]component.Config{
					exporterId: &clickhouseexporter.Config{},
				}, map[component.Type]exporter.Factory{
					exporterId.Type(): clickhouseexporter.NewFactory(nil),
				})
				return fields{
					set: Settings{
						ReceiverBuilder:  receiverBuilder,
						ProcessorBuilder: processorBuilder,
						ExporterBuilder:  exporterBuilder,
						PipelineConfig: &Config{
							Receivers:  []component.ID{receiverId},
							Processors: []component.ID{processorId},
							Exporters:  []component.ID{exporterId},
						},
					},
				}
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()
			fields := tt.fieldsGetter(ctrl)
			s, err := NewService(tt.args.ctx, fields.set)
			if err != nil {
				t.Fatal(err)
			}
			err = s.Start(tt.args.ctx)
			assert.Equal(t, tt.wantErr, err != nil)
			_ = s.State()
			_ = s.Shutdown(tt.args.ctx)
		})
	}
}
