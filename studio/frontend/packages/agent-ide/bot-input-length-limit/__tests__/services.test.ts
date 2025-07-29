/*
 * Copyright 2025 coze-dev Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  type BotInputLengthConfig,
  type WorkInfoOnboardingContent,
} from '../src/services/type';
import { BotInputLengthService, botInputLengthService } from '../src/services';

// 模拟 SuggestedQuestionsShowMode 枚举
enum SuggestedQuestionsShowMode {
  Random = 0,
  All = 1,
}

// 模拟配置
const mockConfig: BotInputLengthConfig = {
  botName: 10,
  botDescription: 100,
  onboarding: 50,
  onboardingSuggestion: 20,
  suggestionPrompt: 200,
  projectName: 10,
  projectDescription: 100,
};

// 模拟获取配置的函数
const mockGetConfig = vi.fn().mockReturnValue(mockConfig);

describe('BotInputLengthService', () => {
  let service: BotInputLengthService;

  beforeEach(() => {
    // 重置模拟
    vi.clearAllMocks();
    // 创建服务实例
    service = new BotInputLengthService(mockGetConfig);
  });

  describe('getInputLengthLimit', () => {
    it('应该返回指定字段的长度限制', () => {
      expect(service.getInputLengthLimit('botName')).toBe(10);
      expect(service.getInputLengthLimit('botDescription')).toBe(100);
      expect(service.getInputLengthLimit('onboarding')).toBe(50);
      expect(service.getInputLengthLimit('onboardingSuggestion')).toBe(20);
      expect(service.getInputLengthLimit('suggestionPrompt')).toBe(200);
      expect(service.getInputLengthLimit('projectName')).toBe(10);
      expect(service.getInputLengthLimit('projectDescription')).toBe(100);

      // 验证配置获取函数被调用
      expect(mockGetConfig).toHaveBeenCalledTimes(7);
    });
  });

  describe('getValueLength', () => {
    it('应该返回字符串的字形簇数量', () => {
      // 普通字符串
      expect(service.getValueLength('hello')).toBe(5);

      // 包含表情符号的字符串（表情符号算作一个字形簇）
      expect(service.getValueLength('hi😊')).toBe(3);

      // 包含组合字符的字符串
      expect(service.getValueLength('café')).toBe(4);

      // 空字符串
      expect(service.getValueLength('')).toBe(0);

      // undefined
      expect(service.getValueLength(undefined)).toBe(0);
    });
  });

  describe('sliceStringByMaxLength', () => {
    it('应该根据字段限制截取字符串', () => {
      // 字符串长度小于限制
      expect(
        service.sliceStringByMaxLength({ value: 'hello', field: 'botName' }),
      ).toBe('hello');

      // 字符串长度等于限制
      expect(
        service.sliceStringByMaxLength({
          value: '1234567890',
          field: 'botName',
        }),
      ).toBe('1234567890');

      // 字符串长度大于限制
      expect(
        service.sliceStringByMaxLength({
          value: '12345678901234567890',
          field: 'botName',
        }),
      ).toBe('1234567890');

      // 包含表情符号的字符串
      expect(
        service.sliceStringByMaxLength({
          value: 'hello😊world',
          field: 'botName',
        }),
      ).toBe('hello😊worl');

      // 验证配置获取函数被调用
      expect(mockGetConfig).toHaveBeenCalledTimes(4);
    });
  });

  describe('sliceWorkInfoOnboardingByMaxLength', () => {
    it('应该截取工作信息的开场白和建议问题', () => {
      const workInfo: WorkInfoOnboardingContent = {
        prologue:
          'This is a very long prologue that exceeds the limit of 50 characters and should be truncated',
        suggested_questions: [
          {
            id: '1',
            content:
              'This is a very long suggested question that exceeds the limit',
            highlight: true,
          },
          { id: '2', content: 'Short question' },
          {
            id: '3',
            content:
              'Another very long suggested question that should be truncated',
            highlight: false,
          },
        ],
        suggested_questions_show_mode: SuggestedQuestionsShowMode.All,
      };

      const result = service.sliceWorkInfoOnboardingByMaxLength(workInfo);

      // 验证开场白被截取
      expect(result.prologue).toBe(
        'This is a very long prologue that exceeds the limi',
      );
      expect(result.prologue.length).toBeLessThanOrEqual(50);

      // 验证建议问题被截取
      expect(result.suggested_questions[0]?.content).toBe(
        'This is a very long ',
      );
      expect(result.suggested_questions[0]?.content.length).toBeLessThanOrEqual(
        20,
      );
      expect(result.suggested_questions[0]?.id).toBe('1');
      expect(result.suggested_questions[0]?.highlight).toBe(true);

      expect(result.suggested_questions[1]?.content).toBe('Short question');
      expect(result.suggested_questions[1]?.id).toBe('2');

      expect(result.suggested_questions[2]?.content).toBe(
        'Another very long su',
      );
      expect(result.suggested_questions[2]?.content.length).toBeLessThanOrEqual(
        20,
      );
      expect(result.suggested_questions[2]?.id).toBe('3');
      expect(result.suggested_questions[2]?.highlight).toBe(false);

      // 验证显示模式保持不变
      expect(result.suggested_questions_show_mode).toBe(
        SuggestedQuestionsShowMode.All,
      );
    });

    it('应该处理空的工作信息', () => {
      const workInfo: WorkInfoOnboardingContent = {
        prologue: '',
        suggested_questions: [],
        suggested_questions_show_mode: SuggestedQuestionsShowMode.Random,
      };

      const result = service.sliceWorkInfoOnboardingByMaxLength(workInfo);

      expect(result.prologue).toBe('');
      expect(result.suggested_questions).toEqual([]);
      expect(result.suggested_questions_show_mode).toBe(
        SuggestedQuestionsShowMode.Random,
      );
    });
  });
});

// 测试导出的单例
describe('botInputLengthService', () => {
  it('应该导出一个 BotInputLengthService 的实例', () => {
    // 验证导出的单例是 BotInputLengthService 的实例
    expect(botInputLengthService).toBeInstanceOf(BotInputLengthService);
  });
});
