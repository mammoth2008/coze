import * as expt from './domain/expt';
export { expt };
import * as common from './domain/common';
export { common };
import * as coze_loop_evaluation_eval_target from './coze.loop.evaluation.eval_target';
export { coze_loop_evaluation_eval_target };
import * as eval_set from './domain/eval_set';
export { eval_set };
import * as dataset from './../data/domain/dataset';
export { dataset };
import * as base from './../../../base';
export { base };
import { createAPI } from './../../config';
export interface CreateExperimentRequest {
  workspace_id: string,
  eval_set_version_id?: string,
  target_version_id?: string,
  evaluator_version_ids?: string[],
  name?: string,
  desc?: string,
  eval_set_id?: string,
  target_id?: string,
  target_field_mapping?: expt.TargetFieldMapping,
  evaluator_field_mapping?: expt.EvaluatorFieldMapping[],
  item_concur_num?: number,
  evaluators_concur_num?: number,
  create_eval_target_param?: coze_loop_evaluation_eval_target.CreateEvalTargetParam,
  expt_type?: expt.ExptType,
  max_alive_time?: number,
  source_type?: expt.SourceType,
  source_id?: string,
  session?: common.Session,
}
export interface CreateExperimentResponse {
  experiment?: expt.Experiment
}
export interface SubmitExperimentRequest {
  workspace_id: string,
  eval_set_version_id?: string,
  target_version_id?: string,
  evaluator_version_ids?: string[],
  name?: string,
  desc?: string,
  eval_set_id?: string,
  target_id?: string,
  target_field_mapping?: expt.TargetFieldMapping,
  evaluator_field_mapping?: expt.EvaluatorFieldMapping[],
  item_concur_num?: number,
  evaluators_concur_num?: number,
  create_eval_target_param?: coze_loop_evaluation_eval_target.CreateEvalTargetParam,
  expt_type?: expt.ExptType,
  max_alive_time?: number,
  source_type?: expt.SourceType,
  source_id?: string,
  session?: common.Session,
}
export interface SubmitExperimentResponse {
  experiment?: expt.Experiment,
  run_id?: string,
}
export interface ListExperimentsRequest {
  workspace_id: string,
  page_number?: number,
  page_size?: number,
  filter_option?: expt.ExptFilterOption,
  order_bys?: common.OrderBy[],
}
export interface ListExperimentsResponse {
  experiments?: expt.Experiment[],
  total?: number,
}
export interface BatchGetExperimentsRequest {
  workspace_id: string,
  expt_ids: string[],
}
export interface BatchGetExperimentsResponse {
  experiments?: expt.Experiment[]
}
export interface UpdateExperimentRequest {
  workspace_id: string,
  expt_id: string,
  name?: string,
  desc?: string,
}
export interface UpdateExperimentResponse {
  experiment?: expt.Experiment
}
export interface DeleteExperimentRequest {
  workspace_id: string,
  expt_id: string,
}
export interface DeleteExperimentResponse {}
export interface BatchDeleteExperimentsRequest {
  workspace_id: string,
  expt_ids: string[],
}
export interface BatchDeleteExperimentsResponse {}
export interface RunExperimentRequest {
  workspace_id?: string,
  expt_id?: string,
  item_ids?: string[],
  expt_type?: expt.ExptType,
  session?: common.Session,
}
export interface RunExperimentResponse {
  run_id?: string
}
export interface RetryExperimentRequest {
  retry_mode?: expt.ExptRetryMode,
  workspace_id?: string,
  expt_id?: string,
  item_ids?: string[],
}
export interface RetryExperimentResponse {
  run_id?: string
}
export interface KillExperimentRequest {
  expt_id?: string,
  workspace_id?: string,
}
export interface KillExperimentResponse {}
export interface CloneExperimentRequest {
  expt_id?: string,
  workspace_id?: string,
}
export interface CloneExperimentResponse {
  experiment?: expt.Experiment
}
export interface BatchGetExperimentResultRequest {
  workspace_id: string,
  experiment_ids: string[],
  /** Baseline experiment ID for experiment comparison */
  baseline_experiment_id?: string,
  /** key: experiment_id */
  filters?: {
    [key: string | number]: expt.ExperimentFilter
  },
  page_number?: number,
  page_size?: number,
}
export interface BatchGetExperimentResultResponse {
  /** 数据集表头信息 */
  column_eval_set_fields: expt.ColumnEvalSetField[],
  /** 评估器表头信息 */
  column_evaluators?: expt.ColumnEvaluator[],
  /** item粒度实验结果详情 */
  item_results?: expt.ItemResult[],
  total?: number,
}
export interface BatchGetExperimentAggrResultRequest {
  workspace_id: string,
  experiment_ids: string[],
}
export interface BatchGetExperimentAggrResultResponse {
  expt_aggregate_result?: expt.ExptAggregateResult[]
}
export interface CheckExperimentNameRequest {
  workspace_id: string,
  name?: string,
}
export interface CheckExperimentNameResponse {
  pass?: boolean,
  message?: string,
}
export interface InvokeExperimentRequest {
  workspace_id: number,
  evaluation_set_id: number,
  items?: eval_set.EvaluationSetItem[],
  /** items 中存在无效数据时，默认不会写入任何数据；设置 skipInvalidItems=true 会跳过无效数据，写入有效数据 */
  skip_invalid_items?: boolean,
  /** 批量写入 items 如果超出数据集容量限制，默认不会写入任何数据；设置 partialAdd=true 会写入不超出容量限制的前 N 条 */
  allow_partial_add?: boolean,
  experiment_id?: number,
  experiment_run_id?: number,
  ext?: {
    [key: string | number]: string
  },
  session?: common.Session,
}
export interface InvokeExperimentResponse {
  /** key: item 在 items 中的索引 */
  added_items?: {
    [key: string | number]: number
  },
  errors?: dataset.ItemErrorGroup[],
}
export interface FinishExperimentRequest {
  workspace_id?: number,
  experiment_id?: number,
  experiment_run_id?: number,
  cid?: string,
  session?: common.Session,
}
export interface FinishExperimentResponse {}
export interface ListExperimentStatsRequest {
  workspace_id: number,
  page_number?: number,
  page_size?: number,
  filter_option?: expt.ExptFilterOption,
  session?: common.Session,
}
export interface ListExperimentStatsResponse {
  expt_stats_infos?: expt.ExptStatsInfo[],
  total?: number,
}
export const CheckExperimentName = /*#__PURE__*/createAPI<CheckExperimentNameRequest, CheckExperimentNameResponse>({
  "url": "/api/evaluation/v1/experiments/check_name",
  "method": "POST",
  "name": "CheckExperimentName",
  "reqType": "CheckExperimentNameRequest",
  "reqMapping": {
    "body": ["workspace_id", "name"]
  },
  "resType": "CheckExperimentNameResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
/** SubmitExperiment 创建并提交运行 */
export const SubmitExperiment = /*#__PURE__*/createAPI<SubmitExperimentRequest, SubmitExperimentResponse>({
  "url": "/api/evaluation/v1/experiments/submit",
  "method": "POST",
  "name": "SubmitExperiment",
  "reqType": "SubmitExperimentRequest",
  "reqMapping": {
    "body": ["workspace_id", "eval_set_version_id", "target_version_id", "evaluator_version_ids", "name", "desc", "eval_set_id", "target_id", "target_field_mapping", "evaluator_field_mapping", "item_concur_num", "evaluators_concur_num", "create_eval_target_param", "expt_type", "max_alive_time", "source_type", "source_id", "session"]
  },
  "resType": "SubmitExperimentResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
export const BatchGetExperiments = /*#__PURE__*/createAPI<BatchGetExperimentsRequest, BatchGetExperimentsResponse>({
  "url": "/api/evaluation/v1/experiments/batch_get",
  "method": "POST",
  "name": "BatchGetExperiments",
  "reqType": "BatchGetExperimentsRequest",
  "reqMapping": {
    "body": ["workspace_id", "expt_ids"]
  },
  "resType": "BatchGetExperimentsResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
export const ListExperiments = /*#__PURE__*/createAPI<ListExperimentsRequest, ListExperimentsResponse>({
  "url": "/api/evaluation/v1/experiments/list",
  "method": "POST",
  "name": "ListExperiments",
  "reqType": "ListExperimentsRequest",
  "reqMapping": {
    "body": ["workspace_id", "page_number", "page_size", "filter_option", "order_bys"]
  },
  "resType": "ListExperimentsResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
export const UpdateExperiment = /*#__PURE__*/createAPI<UpdateExperimentRequest, UpdateExperimentResponse>({
  "url": "/api/evaluation/v1/experiments/:expt_id",
  "method": "PATCH",
  "name": "UpdateExperiment",
  "reqType": "UpdateExperimentRequest",
  "reqMapping": {
    "body": ["workspace_id", "name", "desc"],
    "path": ["expt_id"]
  },
  "resType": "UpdateExperimentResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
export const DeleteExperiment = /*#__PURE__*/createAPI<DeleteExperimentRequest, DeleteExperimentResponse>({
  "url": "/api/evaluation/v1/experiments/:expt_id",
  "method": "DELETE",
  "name": "DeleteExperiment",
  "reqType": "DeleteExperimentRequest",
  "reqMapping": {
    "body": ["workspace_id"],
    "path": ["expt_id"]
  },
  "resType": "DeleteExperimentResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
export const BatchDeleteExperiments = /*#__PURE__*/createAPI<BatchDeleteExperimentsRequest, BatchDeleteExperimentsResponse>({
  "url": "/api/evaluation/v1/experiments/batch_delete",
  "method": "DELETE",
  "name": "BatchDeleteExperiments",
  "reqType": "BatchDeleteExperimentsRequest",
  "reqMapping": {
    "body": ["workspace_id", "expt_ids"]
  },
  "resType": "BatchDeleteExperimentsResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
export const CloneExperiment = /*#__PURE__*/createAPI<CloneExperimentRequest, CloneExperimentResponse>({
  "url": "/api/evaluation/v1/experiments/:expt_id/clone",
  "method": "POST",
  "name": "CloneExperiment",
  "reqType": "CloneExperimentRequest",
  "reqMapping": {
    "path": ["expt_id"],
    "body": ["workspace_id"]
  },
  "resType": "CloneExperimentResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
export const RetryExperiment = /*#__PURE__*/createAPI<RetryExperimentRequest, RetryExperimentResponse>({
  "url": "/api/evaluation/v1/experiments/:expt_id/retry",
  "method": "POST",
  "name": "RetryExperiment",
  "reqType": "RetryExperimentRequest",
  "reqMapping": {
    "body": ["retry_mode", "workspace_id", "item_ids"],
    "path": ["expt_id"]
  },
  "resType": "RetryExperimentResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
export const KillExperiment = /*#__PURE__*/createAPI<KillExperimentRequest, KillExperimentResponse>({
  "url": "/api/evaluation/v1/experiments/:expt_id/kill",
  "method": "POST",
  "name": "KillExperiment",
  "reqType": "KillExperimentRequest",
  "reqMapping": {
    "path": ["expt_id"],
    "body": ["workspace_id"]
  },
  "resType": "KillExperimentResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
/** MGetExperimentResult 获取实验结果 */
export const BatchGetExperimentResult = /*#__PURE__*/createAPI<BatchGetExperimentResultRequest, BatchGetExperimentResultResponse>({
  "url": "/api/evaluation/v1/experiments/results/batch_get",
  "method": "POST",
  "name": "BatchGetExperimentResult",
  "reqType": "BatchGetExperimentResultRequest",
  "reqMapping": {
    "query": ["workspace_id", "page_number", "page_size"],
    "body": ["experiment_ids", "baseline_experiment_id", "filters"]
  },
  "resType": "BatchGetExperimentResultResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});
export const BatchGetExperimentAggrResult = /*#__PURE__*/createAPI<BatchGetExperimentAggrResultRequest, BatchGetExperimentAggrResultResponse>({
  "url": "/api/evaluation/v1/experiments/aggr_results/batch_get",
  "method": "POST",
  "name": "BatchGetExperimentAggrResult",
  "reqType": "BatchGetExperimentAggrResultRequest",
  "reqMapping": {
    "query": ["workspace_id"],
    "body": ["experiment_ids"]
  },
  "resType": "BatchGetExperimentAggrResultResponse",
  "schemaRoot": "api://schemas/evaluation_coze.loop.evaluation.expt",
  "service": "evaluationExpt"
});