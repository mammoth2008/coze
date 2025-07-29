import * as evaluator from './domain/evaluator';
export { evaluator };
import * as common from './domain/common';
export { common };
import * as base from './../../../base';
export { base };
import { createAPI } from './../../config';
export interface ListEvaluatorsRequest {
  workspace_id: string,
  search_name?: string,
  creator_ids?: string[],
  evaluator_type?: evaluator.EvaluatorType[],
  with_version?: boolean,
  page_size?: number,
  page_number?: number,
  order_bys?: common.OrderBy[],
}
export interface ListEvaluatorsResponse {
  evaluators?: evaluator.Evaluator[],
  total?: string,
}
export interface BatchGetEvaluatorsRequest {
  workspace_id: string,
  evaluator_ids?: string[],
  /** 是否查询已删除的评估器，默认不查询 */
  include_deleted?: boolean,
}
export interface BatchGetEvaluatorsResponse {
  evaluators?: evaluator.Evaluator[]
}
export interface GetEvaluatorRequest {
  workspace_id: string,
  evaluator_id?: string,
  /** 是否查询已删除的评估器，默认不查询 */
  include_deleted?: boolean,
}
export interface GetEvaluatorResponse {
  evaluator?: evaluator.Evaluator
}
export interface CreateEvaluatorRequest {
  evaluator: evaluator.Evaluator,
  cid?: string,
}
export interface CreateEvaluatorResponse {
  evaluator_id?: string
}
export interface UpdateEvaluatorDraftRequest {
  /** 评估器 id */
  evaluator_id: string,
  /** 空间 id */
  workspace_id: string,
  evaluator_content: evaluator.EvaluatorContent,
  evaluator_type: evaluator.EvaluatorType,
}
export interface UpdateEvaluatorDraftResponse {
  evaluator?: evaluator.Evaluator
}
export interface UpdateEvaluatorRequest {
  /** 评估器 id */
  evaluator_id: string,
  /** 空间 id */
  workspace_id: string,
  evaluator_type: evaluator.EvaluatorType,
  /** 展示用名称 */
  name?: string,
  /** 描述 */
  description?: string,
}
export interface UpdateEvaluatorResponse {}
export interface CloneEvaluatorRequest {
  workspace_id: string,
  evaluator_id: string,
}
export interface CloneEvaluatorResponse {
  evaluator_id?: string
}
export interface ListEvaluatorVersionsRequest {
  workspace_id: string,
  evaluator_id?: string,
  query_versions?: string[],
  page_size?: number,
  page_number?: number,
  order_bys?: common.OrderBy[],
}
export interface ListEvaluatorVersionsResponse {
  evaluator_versions?: evaluator.EvaluatorVersion[],
  total?: string,
}
export interface GetEvaluatorVersionRequest {
  workspace_id: string,
  evaluator_version_id: string,
  /** 是否查询已删除的评估器，默认不查询 */
  include_deleted?: boolean,
}
export interface GetEvaluatorVersionResponse {
  evaluator?: evaluator.Evaluator
}
export interface BatchGetEvaluatorVersionsRequest {
  workspace_id: string,
  evaluator_version_ids?: string[],
  /** 是否查询已删除的评估器，默认不查询 */
  include_deleted?: boolean,
}
export interface BatchGetEvaluatorVersionsResponse {
  evaluators?: evaluator.Evaluator[]
}
export interface SubmitEvaluatorVersionRequest {
  workspace_id: string,
  evaluator_id: string,
  version: string,
  description?: string,
  cid?: string,
}
export interface SubmitEvaluatorVersionResponse {
  evaluator?: evaluator.Evaluator
}
export interface ListTemplatesRequest {
  builtin_template_type: evaluator.TemplateType
}
export interface ListTemplatesResponse {
  builtin_template_keys?: evaluator.EvaluatorContent[]
}
export interface GetTemplateInfoRequest {
  builtin_template_type: evaluator.TemplateType,
  builtin_template_key: string,
}
export interface GetTemplateInfoResponse {
  builtin_template?: evaluator.EvaluatorContent
}
export interface RunEvaluatorRequest {
  /** 空间 id */
  workspace_id: string,
  /** 评测规则 id */
  evaluator_version_id: string,
  /** 评测数据输入: 数据集行内容 + 评测目标输出内容与历史记录 + 评测目标的 trace */
  input_data: evaluator.EvaluatorInputData,
  /** experiment id */
  experiment_id?: string,
  /** experiment run id */
  experiment_run_id?: string,
  item_id?: string,
  turn_id?: string,
  ext?: {
    [key: string | number]: string
  },
}
export interface RunEvaluatorResponse {
  record: evaluator.EvaluatorRecord
}
export interface DebugEvaluatorRequest {
  /** 空间 id */
  workspace_id: string,
  /** 待调试评估器内容 */
  evaluator_content: evaluator.EvaluatorContent,
  /** 评测数据输入: 数据集行内容 + 评测目标输出内容与历史记录 + 评测目标的 trace */
  input_data: evaluator.EvaluatorInputData,
  evaluator_type: evaluator.EvaluatorType,
}
export interface DebugEvaluatorResponse {
  /** 输出数据 */
  evaluator_output_data?: evaluator.EvaluatorOutputData
}
export interface DeleteEvaluatorRequest {
  evaluator_id?: string,
  workspace_id: string,
}
export interface DeleteEvaluatorResponse {}
export interface CheckEvaluatorNameRequest {
  workspace_id: string,
  name: string,
  evaluator_id?: string,
}
export interface CheckEvaluatorNameResponse {
  pass?: boolean,
  message?: string,
}
export interface ListEvaluatorRecordRequest {
  workspace_id: string,
  evaluator_id: string,
  experiment_run_ids?: string[],
  /** 分页大小 (0, 200]，默认为 20 */
  page_size?: number,
  page_token?: string,
}
export interface ListEvaluatorRecordResponse {
  records: evaluator.EvaluatorRecord[]
}
export interface GetEvaluatorRecordRequest {
  workspace_id: string,
  evaluator_record_id: string,
  /** 是否查询已删除的，默认不查询 */
  include_deleted?: boolean,
}
export interface GetEvaluatorRecordResponse {
  record: evaluator.EvaluatorRecord
}
export interface BatchGetEvaluatorRecordsRequest {
  workspace_id: string,
  evaluator_record_ids?: string[],
  /** 是否查询已删除的，默认不查询 */
  include_deleted?: boolean,
}
export interface BatchGetEvaluatorRecordsResponse {
  records: evaluator.EvaluatorRecord[]
}
export interface UpdateEvaluatorRecordRequest {
  workspace_id: string,
  evaluator_record_id: string,
  correction: evaluator.Correction,
}
export interface UpdateEvaluatorRecordResponse {
  record: evaluator.EvaluatorRecord
}
export interface GetDefaultPromptEvaluatorToolsRequest {}
export interface GetDefaultPromptEvaluatorToolsResponse {
  tools: evaluator.Tool[]
}
/**
 * 评估器
 * 按查询条件查询evaluator
*/
export const ListEvaluators = /*#__PURE__*/createAPI<ListEvaluatorsRequest, ListEvaluatorsResponse>({
  "url": "/api/evaluation/v1/evaluators/list",
  "method": "POST",
  "name": "ListEvaluators",
  "reqType": "ListEvaluatorsRequest",
  "reqMapping": {
    "body": ["workspace_id", "search_name", "creator_ids", "evaluator_type", "with_version", "page_size", "page_number", "order_bys"]
  },
  "resType": "ListEvaluatorsResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 按id批量查询evaluator */
export const BatchGetEvaluators = /*#__PURE__*/createAPI<BatchGetEvaluatorsRequest, BatchGetEvaluatorsResponse>({
  "url": "/api/evaluation/v1/evaluators/batch_get",
  "method": "POST",
  "name": "BatchGetEvaluators",
  "reqType": "BatchGetEvaluatorsRequest",
  "reqMapping": {
    "body": ["workspace_id", "evaluator_ids", "include_deleted"]
  },
  "resType": "BatchGetEvaluatorsResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 按id单个查询evaluator */
export const GetEvaluator = /*#__PURE__*/createAPI<GetEvaluatorRequest, GetEvaluatorResponse>({
  "url": "/api/evaluation/v1/evaluators/:evaluator_id",
  "method": "GET",
  "name": "GetEvaluator",
  "reqType": "GetEvaluatorRequest",
  "reqMapping": {
    "query": ["workspace_id", "include_deleted"],
    "path": ["evaluator_id"]
  },
  "resType": "GetEvaluatorResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 创建evaluator */
export const CreateEvaluator = /*#__PURE__*/createAPI<CreateEvaluatorRequest, CreateEvaluatorResponse>({
  "url": "/api/evaluation/v1/evaluators",
  "method": "POST",
  "name": "CreateEvaluator",
  "reqType": "CreateEvaluatorRequest",
  "reqMapping": {
    "body": ["evaluator", "cid"]
  },
  "resType": "CreateEvaluatorResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 修改evaluator元信息 */
export const UpdateEvaluator = /*#__PURE__*/createAPI<UpdateEvaluatorRequest, UpdateEvaluatorResponse>({
  "url": "/api/evaluation/v1/evaluators/:evaluator_id",
  "method": "PATCH",
  "name": "UpdateEvaluator",
  "reqType": "UpdateEvaluatorRequest",
  "reqMapping": {
    "path": ["evaluator_id"],
    "body": ["workspace_id", "evaluator_type", "name", "description"]
  },
  "resType": "UpdateEvaluatorResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 修改evaluator草稿 */
export const UpdateEvaluatorDraft = /*#__PURE__*/createAPI<UpdateEvaluatorDraftRequest, UpdateEvaluatorDraftResponse>({
  "url": "/api/evaluation/v1/evaluators/:evaluator_id/update_draft",
  "method": "PATCH",
  "name": "UpdateEvaluatorDraft",
  "reqType": "UpdateEvaluatorDraftRequest",
  "reqMapping": {
    "path": ["evaluator_id"],
    "body": ["workspace_id", "evaluator_content", "evaluator_type"]
  },
  "resType": "UpdateEvaluatorDraftResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 批量删除evaluator */
export const DeleteEvaluator = /*#__PURE__*/createAPI<DeleteEvaluatorRequest, DeleteEvaluatorResponse>({
  "url": "/api/evaluation/v1/evaluators/:evaluator_id",
  "method": "DELETE",
  "name": "DeleteEvaluator",
  "reqType": "DeleteEvaluatorRequest",
  "reqMapping": {
    "path": ["evaluator_id"],
    "query": ["workspace_id"]
  },
  "resType": "DeleteEvaluatorResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 校验evaluator名称是否重复 */
export const CheckEvaluatorName = /*#__PURE__*/createAPI<CheckEvaluatorNameRequest, CheckEvaluatorNameResponse>({
  "url": "/api/evaluation/v1/evaluators/check_name",
  "method": "POST",
  "name": "CheckEvaluatorName",
  "reqType": "CheckEvaluatorNameRequest",
  "reqMapping": {
    "body": ["workspace_id", "name", "evaluator_id"]
  },
  "resType": "CheckEvaluatorNameResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/**
 * 评估器版本
 * 按evaluator id查询evaluator version
*/
export const ListEvaluatorVersions = /*#__PURE__*/createAPI<ListEvaluatorVersionsRequest, ListEvaluatorVersionsResponse>({
  "url": "/api/evaluation/v1/evaluators/:evaluator_id/versions/list",
  "method": "POST",
  "name": "ListEvaluatorVersions",
  "reqType": "ListEvaluatorVersionsRequest",
  "reqMapping": {
    "body": ["workspace_id", "query_versions", "page_size", "page_number", "order_bys"],
    "path": ["evaluator_id"]
  },
  "resType": "ListEvaluatorVersionsResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 按版本id单个查询evaluator version */
export const GetEvaluatorVersion = /*#__PURE__*/createAPI<GetEvaluatorVersionRequest, GetEvaluatorVersionResponse>({
  "url": "/api/evaluation/v1/evaluators_versions/:evaluator_version_id",
  "method": "GET",
  "name": "GetEvaluatorVersion",
  "reqType": "GetEvaluatorVersionRequest",
  "reqMapping": {
    "query": ["workspace_id", "include_deleted"],
    "path": ["evaluator_version_id"]
  },
  "resType": "GetEvaluatorVersionResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 按版本id批量查询evaluator version */
export const BatchGetEvaluatorVersions = /*#__PURE__*/createAPI<BatchGetEvaluatorVersionsRequest, BatchGetEvaluatorVersionsResponse>({
  "url": "/api/evaluation/v1/evaluators_versions/batch_get",
  "method": "POST",
  "name": "BatchGetEvaluatorVersions",
  "reqType": "BatchGetEvaluatorVersionsRequest",
  "reqMapping": {
    "body": ["workspace_id", "evaluator_version_ids", "include_deleted"]
  },
  "resType": "BatchGetEvaluatorVersionsResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 提交evaluator版本 */
export const SubmitEvaluatorVersion = /*#__PURE__*/createAPI<SubmitEvaluatorVersionRequest, SubmitEvaluatorVersionResponse>({
  "url": "/api/evaluation/v1/evaluators/:evaluator_id/submit_version",
  "method": "POST",
  "name": "SubmitEvaluatorVersion",
  "reqType": "SubmitEvaluatorVersionRequest",
  "reqMapping": {
    "body": ["workspace_id", "version", "description", "cid"],
    "path": ["evaluator_id"]
  },
  "resType": "SubmitEvaluatorVersionResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/**
 * 评估器预置模版
 * 获取内置评估器模板列表（不含具体内容）
*/
export const ListTemplates = /*#__PURE__*/createAPI<ListTemplatesRequest, ListTemplatesResponse>({
  "url": "/api/evaluation/v1/evaluators/list_template",
  "method": "POST",
  "name": "ListTemplates",
  "reqType": "ListTemplatesRequest",
  "reqMapping": {
    "query": ["builtin_template_type"]
  },
  "resType": "ListTemplatesResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 按key单个查询内置评估器模板详情 */
export const GetTemplateInfo = /*#__PURE__*/createAPI<GetTemplateInfoRequest, GetTemplateInfoResponse>({
  "url": "/api/evaluation/v1/evaluators/get_template_info",
  "method": "POST",
  "name": "GetTemplateInfo",
  "reqType": "GetTemplateInfoRequest",
  "reqMapping": {
    "query": ["builtin_template_type", "builtin_template_key"]
  },
  "resType": "GetTemplateInfoResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 获取prompt evaluator tools配置 */
export const GetDefaultPromptEvaluatorTools = /*#__PURE__*/createAPI<GetDefaultPromptEvaluatorToolsRequest, GetDefaultPromptEvaluatorToolsResponse>({
  "url": "/api/evaluation/v1/evaluators/default_prompt_evaluator_tools",
  "method": "POST",
  "name": "GetDefaultPromptEvaluatorTools",
  "reqType": "GetDefaultPromptEvaluatorToolsRequest",
  "reqMapping": {},
  "resType": "GetDefaultPromptEvaluatorToolsResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/**
 * 评估器执行
 * evaluator 运行
*/
export const RunEvaluator = /*#__PURE__*/createAPI<RunEvaluatorRequest, RunEvaluatorResponse>({
  "url": "/api/evaluation/v1/evaluators_versions/:evaluator_version_id/run",
  "method": "POST",
  "name": "RunEvaluator",
  "reqType": "RunEvaluatorRequest",
  "reqMapping": {
    "body": ["workspace_id", "input_data", "experiment_id", "experiment_run_id", "item_id", "turn_id", "ext"],
    "path": ["evaluator_version_id"]
  },
  "resType": "RunEvaluatorResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** evaluator 调试 */
export const DebugEvaluator = /*#__PURE__*/createAPI<DebugEvaluatorRequest, DebugEvaluatorResponse>({
  "url": "/api/evaluation/v1/evaluators/debug",
  "method": "POST",
  "name": "DebugEvaluator",
  "reqType": "DebugEvaluatorRequest",
  "reqMapping": {
    "body": ["workspace_id", "evaluator_content", "input_data", "evaluator_type"]
  },
  "resType": "DebugEvaluatorResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/**
 * 评估器执行结果
 * 修正evaluator运行分数
*/
export const UpdateEvaluatorRecord = /*#__PURE__*/createAPI<UpdateEvaluatorRecordRequest, UpdateEvaluatorRecordResponse>({
  "url": "/api/evaluation/v1/evaluator_records/:evaluator_record_id",
  "method": "PATCH",
  "name": "UpdateEvaluatorRecord",
  "reqType": "UpdateEvaluatorRecordRequest",
  "reqMapping": {
    "body": ["workspace_id", "correction"],
    "path": ["evaluator_record_id"]
  },
  "resType": "UpdateEvaluatorRecordResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 按id查询单个evaluator运行结果 */
export const GetEvaluatorRecord = /*#__PURE__*/createAPI<GetEvaluatorRecordRequest, GetEvaluatorRecordResponse>({
  "url": "/api/evaluation/v1/evaluator_records/:evaluator_record_id",
  "method": "GET",
  "name": "GetEvaluatorRecord",
  "reqType": "GetEvaluatorRecordRequest",
  "reqMapping": {
    "query": ["workspace_id", "include_deleted"],
    "path": ["evaluator_record_id"]
  },
  "resType": "GetEvaluatorRecordResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});
/** 按id批量查询evaluator运行结果 */
export const BatchGetEvaluatorRecords = /*#__PURE__*/createAPI<BatchGetEvaluatorRecordsRequest, BatchGetEvaluatorRecordsResponse>({
  "url": "/api/evaluation/v1/evaluator_records/get_batch",
  "method": "POST",
  "name": "BatchGetEvaluatorRecords",
  "reqType": "BatchGetEvaluatorRecordsRequest",
  "reqMapping": {
    "body": ["workspace_id", "evaluator_record_ids", "include_deleted"]
  },
  "resType": "BatchGetEvaluatorRecordsResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.evaluator",
  "service": "evaluationEvaluator"
});