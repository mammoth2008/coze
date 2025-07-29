// Copyright (c) 2025 coze-dev Authors
// SPDX-License-Identifier: Apache-2.0

package registry

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/mock/gomock"

	"github.com/coze-dev/coze-loop/backend/infra/mq"
	"github.com/coze-dev/coze-loop/backend/infra/mq/mocks"
)

func TestDefaultConsumerRegistry_StartAll(t *testing.T) {
	tests := []struct {
		name          string
		workers       []mq.IConsumerWorker
		setupMocks    func(*mocks.MockIFactory, []*mocks.MockIConsumer, []*mocks.MockIConsumerWorker)
		expectedError error
	}{
		{
			name: "successfully start all workers",
			workers: []mq.IConsumerWorker{
				mocks.NewMockIConsumerWorker(gomock.NewController(t)),
				mocks.NewMockIConsumerWorker(gomock.NewController(t)),
			},
			setupMocks: func(factory *mocks.MockIFactory, consumers []*mocks.MockIConsumer, workers []*mocks.MockIConsumerWorker) {
				cfg := &mq.ConsumerConfig{}
				for i := range workers {
					workers[i].EXPECT().ConsumerCfg(gomock.Any()).Return(cfg, nil)
					consumers[i].EXPECT().RegisterHandler(gomock.Any()).Return()
					consumers[i].EXPECT().Start().Return(nil)
					factory.EXPECT().NewConsumer(gomock.Any()).Return(consumers[i], nil)
				}
			},
			expectedError: nil,
		},
		{
			name: "fail to get consumer config",
			workers: []mq.IConsumerWorker{
				mocks.NewMockIConsumerWorker(gomock.NewController(t)),
			},
			setupMocks: func(factory *mocks.MockIFactory, consumers []*mocks.MockIConsumer, workers []*mocks.MockIConsumerWorker) {
				workers[0].EXPECT().ConsumerCfg(gomock.Any()).Return(nil, errors.New("config error"))
			},
			expectedError: errors.New("config error"),
		},
		{
			name: "fail to create consumer",
			workers: []mq.IConsumerWorker{
				mocks.NewMockIConsumerWorker(gomock.NewController(t)),
			},
			setupMocks: func(factory *mocks.MockIFactory, consumers []*mocks.MockIConsumer, workers []*mocks.MockIConsumerWorker) {
				cfg := &mq.ConsumerConfig{}
				workers[0].EXPECT().ConsumerCfg(gomock.Any()).Return(cfg, nil)
				factory.EXPECT().NewConsumer(gomock.Any()).Return(nil, errors.New("create error"))
			},
			expectedError: errors.New("create error"),
		},
		{
			name: "fail to start consumer",
			workers: []mq.IConsumerWorker{
				mocks.NewMockIConsumerWorker(gomock.NewController(t)),
			},
			setupMocks: func(factory *mocks.MockIFactory, consumers []*mocks.MockIConsumer, workers []*mocks.MockIConsumerWorker) {
				cfg := &mq.ConsumerConfig{}
				workers[0].EXPECT().ConsumerCfg(gomock.Any()).Return(cfg, nil)
				consumers[0].EXPECT().RegisterHandler(gomock.Any()).Return()
				consumers[0].EXPECT().Start().Return(errors.New("start error"))
				factory.EXPECT().NewConsumer(gomock.Any()).Return(consumers[0], nil)
			},
			expectedError: errors.New("start error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			factory := mocks.NewMockIFactory(ctrl)
			consumers := make([]*mocks.MockIConsumer, len(tt.workers))
			workers := make([]*mocks.MockIConsumerWorker, len(tt.workers))

			for i := range tt.workers {
				consumers[i] = mocks.NewMockIConsumer(ctrl)
				workers[i] = tt.workers[i].(*mocks.MockIConsumerWorker)
			}

			tt.setupMocks(factory, consumers, workers)

			registry := NewConsumerRegistry(factory).Register(tt.workers)

			err := registry.StartAll(context.Background())
			if tt.expectedError != nil {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.expectedError.Error())
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestSafeConsumerHandlerDecorator_HandleMessage(t *testing.T) {
	tests := []struct {
		name          string
		setupMock     func(*mocks.MockIConsumerWorker)
		expectedError error
	}{
		{
			name: "successfully handle message",
			setupMock: func(w *mocks.MockIConsumerWorker) {
				w.EXPECT().HandleMessage(gomock.Any(), gomock.Any()).Return(nil)
			},
			expectedError: nil,
		},
		{
			name: "handler returns error",
			setupMock: func(w *mocks.MockIConsumerWorker) {
				w.EXPECT().HandleMessage(gomock.Any(), gomock.Any()).DoAndReturn(func(context.Context, *mq.MessageExt) error {
					panic("test panic")
				})
			},
			expectedError: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			defer ctrl.Finish()

			handler := mocks.NewMockIConsumerWorker(ctrl)
			tt.setupMock(handler)

			decorator := &safeConsumerHandlerDecorator{handler: handler}
			err := decorator.HandleMessage(context.Background(), &mq.MessageExt{})

			if tt.expectedError != nil {
				assert.Error(t, err)
				assert.Equal(t, tt.expectedError.Error(), err.Error())
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
