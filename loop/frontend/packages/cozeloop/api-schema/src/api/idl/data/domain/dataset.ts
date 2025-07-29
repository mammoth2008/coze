export enum StorageProvider {
  TOS = 1,
  VETOS = 2,
  HDFS = 3,
  ImageX = 4,
  S3 = 5,
  /** 后端内部使用 */
  Abase = 100,
  RDS = 101,
  LocalFS = 102,
}
export enum DatasetVisibility {
  /** 所有空间可见 */
  Public = 1,
  /** 当前空间可见 */
  Space = 2,
  /** 用户不可见 */
  System = 3,
}
export enum SecurityLevel {
  L1 = 1,
  L2 = 2,
  L3 = 3,
  L4 = 4,
}
export enum DatasetCategory {
  General = 1,
  Training = 2,
  Validation = 3,
  Evaluation = 4,
}
export enum DatasetStatus {
  Available = 1,
  Deleted = 2,
  Expired = 3,
  Importing = 4,
  Exporting = 5,
  Indexing = 6,
}
export enum ContentType {
  /** 基础类型 */
  Text = 1,
  Image = 2,
  Audio = 3,
  Video = 4,
  /** 图文混排 */
  MultiPart = 100,
}
export enum FieldDisplayFormat {
  PlainText = 1,
  Markdown = 2,
  JSON = 3,
  YAML = 4,
  Code = 5,
}
export enum SnapshotStatus {
  Unstarted = 1,
  InProgress = 2,
  Completed = 3,
  Failed = 4,
}
export enum SchemaKey {
  String = 1,
  Integer = 2,
  Float = 3,
  Bool = 4,
  Message = 5,
}
export interface DatasetFeatures {
  /** 变更 schema */
  editSchema?: boolean,
  /** 多轮数据 */
  repeatedData?: boolean,
  /** 多模态 */
  multiModal?: boolean,
}
/** Dataset 数据集实体 */
export interface Dataset {
  id: string,
  app_id?: number,
  space_id: string,
  schema_id: string,
  name?: string,
  description?: string,
  status?: DatasetStatus,
  /** 业务场景分类 */
  category?: DatasetCategory,
  /** 提供给上层业务定义数据集类别 */
  biz_category?: string,
  /** 当前数据集结构 */
  schema?: DatasetSchema,
  /** 密级 */
  security_level?: SecurityLevel,
  /** 可见性 */
  visibility?: DatasetVisibility,
  /** 规格限制 */
  spec?: DatasetSpec,
  /** 数据集功能开关 */
  features?: DatasetFeatures,
  /** 最新的版本号 */
  latest_version?: string,
  /** 下一个的版本号 */
  next_version_num?: string,
  /** 数据条数 */
  item_count?: string,
  /** 通用信息 */
  created_by?: string,
  created_at?: string,
  updated_by?: string,
  updated_at?: string,
  expired_at?: string,
  /**
   * DTO 专用字段
   * 是否有未提交的修改
  */
  change_uncommitted?: boolean,
}
export interface DatasetSpec {
  /** 条数上限 */
  max_item_count?: string,
  /** 字段数量上限 */
  max_field_count?: number,
  /** 单条数据字数上限 */
  max_item_size?: string,
}
/** DatasetVersion 数据集版本元信息，不包含数据本身 */
export interface DatasetVersion {
  id: string,
  app_id?: number,
  space_id: string,
  dataset_id: string,
  schema_id: string,
  /** 展示的版本号，SemVer2 三段式 */
  version?: string,
  /** 后端记录的数字版本号，从 1 开始递增 */
  version_num?: string,
  /** 版本描述 */
  description?: string,
  /** marshal 后的版本保存时的数据集元信息，不包含 schema */
  dataset_brief?: string,
  /** 数据条数 */
  item_count?: string,
  /** 当前版本的快照状态 */
  snapshot_status?: SnapshotStatus,
  /** 通用信息 */
  created_by?: string,
  created_at?: string,
  /** 版本禁用的时间 */
  disabled_at?: string,
}
/** DatasetSchema 数据集 Schema，包含数据集列的类型限制等信息 */
export interface DatasetSchema {
  /** 主键 ID，创建时可以不传 */
  id?: string,
  /** schema 所在的空间 ID，创建时可以不传 */
  app_id?: number,
  /** schema 所在的空间 ID，创建时可以不传 */
  space_id?: string,
  /** 数据集 ID，创建时可以不传 */
  dataset_id?: string,
  /** 数据集列约束 */
  fields?: FieldSchema[],
  /** 是否不允许编辑 */
  immutable?: boolean,
  /** 通用信息 */
  created_by?: string,
  created_at?: string,
  updated_by?: string,
  updated_at?: string,
  update_version?: string,
}
export enum FieldStatus {
  Available = 1,
  Deleted = 2,
}
export interface FieldSchema {
  /** 数据集 schema 版本变化中 key 唯一，新建时自动生成，不需传入 */
  key?: string,
  /** 展示名称 */
  name?: string,
  /** 描述 */
  description?: string,
  /** 类型，如 文本，图片，etc. */
  content_type?: ContentType,
  /** 默认渲染格式，如 code, json, etc. */
  default_format?: FieldDisplayFormat,
  /** 对应的内置 schema */
  schemaKey?: SchemaKey,
  /**
   * [20,50) 内容格式限制相关
   * 文本内容格式限制，格式为 JSON schema，协议参考 https://json-schema.org/specification
  */
  text_schema?: string,
  /** 多模态规格限制 */
  multi_model_spec?: MultiModalSpec,
  /** 用户是否不可见 */
  hidden?: boolean,
  /** 当前列的状态，创建/更新时可以不传 */
  status?: FieldStatus,
}
export interface MultiModalSpec {
  /** 文件数量上限 */
  max_file_count?: string,
  /** 文件大小上限 */
  max_file_size?: string,
  /** 文件格式 */
  supported_formats?: string[],
}
/** DatasetItem 数据内容 */
export interface DatasetItem {
  /** 主键 ID，创建时可以不传 */
  id?: string,
  /** 冗余 app ID，创建时可以不传 */
  app_id?: number,
  /** 冗余 space ID，创建时可以不传 */
  space_id?: string,
  /** 所属的 data ID，创建时可以不传 */
  dataset_id?: string,
  /** 插入时对应的 schema ID，后端根据 req 参数中的 datasetID 自动填充 */
  schema_id?: string,
  /** 数据在当前数据集内的唯一 ID，不随版本发生改变 */
  item_id?: string,
  /** 数据插入的幂等 key */
  item_key?: string,
  /** 数据内容 */
  data?: FieldData[],
  /** 多轮数据内容，与 data 互斥 */
  repeated_data?: ItemData[],
  /** 通用信息 */
  created_by?: string,
  created_at?: string,
  updated_by?: string,
  updated_at?: string,
  /**
   * DTO 专用字段
   * 数据（data 或 repeatedData）是否省略。列表查询 item 时，特长的数据内容不予返回，可通过单独 Item 接口获取内容
  */
  data_omitted?: boolean,
}
export interface ItemData {
  id?: string,
  data?: FieldData[],
}
export interface FieldData {
  key?: string,
  /** 字段名，写入 Item 时 key 与 name 提供其一即可，同时提供时以 key 为准 */
  name?: string,
  content_type?: ContentType,
  content?: string,
  /** 外部存储信息 */
  attachments?: ObjectStorage[],
  /** 数据的渲染格式 */
  format?: FieldDisplayFormat,
  /** 图文混排时，图文内容 */
  parts?: FieldData[],
}
export interface ObjectStorage {
  provider?: StorageProvider,
  name?: string,
  uri?: string,
  url?: string,
  thumb_url?: string,
}
export interface OrderBy {
  /** 排序字段 */
  field?: string,
  /** 升序，默认倒序 */
  is_asc?: boolean,
}
export interface FileUploadToken {
  access_key_id?: string,
  secret_access_key?: string,
  session_token?: string,
  expired_time?: string,
  current_time?: string,
}
export enum ItemErrorType {
  /** schema 不匹配 */
  MismatchSchema = 1,
  /** 空数据 */
  EmptyData = 2,
  /** 单条数据大小超限 */
  ExceedMaxItemSize = 3,
  /** 数据集容量超限 */
  ExceedDatasetCapacity = 4,
  /** 文件格式错误 */
  MalformedFile = 5,
  /** 包含非法内容 */
  IllegalContent = 6,
  /** system erro */
  InternalError = 100,
}
export interface ItemErrorDetail {
  message?: string,
  /** 单条错误数据在输入数据中的索引。从 0 开始，下同 */
  index?: number,
  /** [startIndex, endIndex] 表示区间错误范围, 如 ExceedDatasetCapacity 错误时 */
  start_index?: number,
  end_index?: number,
}
export interface ItemErrorGroup {
  type?: ItemErrorType,
  summary?: string,
  /** 错误条数 */
  error_count?: number,
  /** 批量写入时，每类错误至多提供 5 个错误详情；导入任务，至多提供 10 个错误详情 */
  details?: ItemErrorDetail[],
}