namespace go coze.loop.llm.manage

include "../../../base.thrift"
include "./domain/manage.thrift"
include "./domain/common.thrift"

struct ListModelsRequest {
    1: optional i64 workspace_id (api.js_conv='true', vt.not_nil='true', vt.gt='0', go.tag='json:"workspace_id"')
    2: optional common.Scenario scenario
    127: optional i32 page_size
    128: optional string page_token

    255: optional base.Base Base
}

struct ListModelsResponse {
    1: optional list<manage.Model> models
    127: optional bool has_more
    128: optional string next_page_token
    129: optional i32 total

    255: base.BaseResp BaseResp
}

struct GetModelRequest {
    1: optional i64 workspace_id (api.js_conv='true', vt.not_nil='true', vt.gt='0', go.tag='json:"workspace_id"')
    2: optional i64 model_id (api.js_conv='true', api.path='model_id', go.tag='json:"model_id"')

    255: optional base.Base Base
}

struct GetModelResponse {
    1: optional manage.Model model

    255: base.BaseResp BaseResp
}

service LLMManageService {
    ListModelsResponse ListModels(1: ListModelsRequest req) (api.post="/api/llm/v1/models/list")
    GetModelResponse GetModel(1: GetModelRequest req) (api.post="/api/llm/v1/models/:model_id")
}