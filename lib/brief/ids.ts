// Идентификаторы брифа: общие для схемы (lib), данных (app/data/brief) и интерфейса.
// Живут в lib, чтобы схема не тянула за собой тексты страницы.

export const PROCESS_IDS = [
  'cards',
  'media',
  'reviews',
  'questions',
  'returns',
  'ads',
  'prices',
  'competitors',
  'stocks',
  'supply',
  'labels',
  'unit',
  'payouts',
  'accounting',
  'digest',
  'sourcing',
  'custom',
] as const
export type ProcessId = (typeof PROCESS_IDS)[number]

export const PROCESS_GROUPS = ['content', 'buyers', 'pricing', 'warehouse', 'money', 'management', 'custom'] as const
export type ProcessGroup = (typeof PROCESS_GROUPS)[number]

export const HOURS_BANDS = ['lt1', '1to3', '3to5', '5to10', '10plus'] as const
export type HoursBand = (typeof HOURS_BANDS)[number]

// Шаг 1
export const MARKETPLACES = ['wb', 'ozon', 'ym', 'site', 'other'] as const
export const FULFILLMENT = ['fbo', 'fbs', 'dbs', 'unknown'] as const
export const CATEGORIES = [
  'apparel',
  'home',
  'beauty',
  'kids',
  'electronics',
  'sport',
  'food',
  'auto',
  'hobby',
  'jewelry',
  'other',
] as const
export const SKU_BANDS = ['lt50', '50to300', '300to1000', 'gt1000', 'unknown'] as const
export const ORDER_BANDS = ['lt10', '10to100', '100to500', 'gt500', 'unknown'] as const
export const REVENUE_BANDS = ['lt1m', '1to5m', '5to20m', 'gt20m', 'hidden'] as const
export const TEAM_SIZES = ['solo', '2to5', '6to20', 'gt20'] as const
export const ROLES = ['manager', 'content', 'ads', 'warehouse', 'accountant', 'freelancers', 'onlyMe'] as const

// Шаг 2
export const LEDGERS = ['head', 'sheets', 'moysklad', '1c', 'other'] as const
export const COST_KNOWN = ['exact', 'approx', 'no'] as const
export const TOOLS = [
  'mpstats',
  'mayak',
  'analyticsOther',
  'bidder',
  'repricer',
  'reviewsCabinet',
  'reviewsService',
  'none',
] as const
export const API_TOKENS = ['yes', 'no', 'unknown'] as const
export const AI_NOW = ['none', 'chatSelf', 'teamRegular', 'automations', 'triedFailed'] as const
export const DOCS = ['yes', 'partial', 'head'] as const

// Шаг 4
export const FREQUENCY = ['manyPerDay', 'daily', 'weekly', 'rare', 'unknown'] as const
export const WHO = ['me', 'employee', 'freelancer', 'nobody', 'service'] as const
export const ETALON = ['many', 'few', 'no', 'unknown'] as const
export const RULE = ['sheet', 'readInput', 'experience', 'unknown'] as const
export const CHECK = ['instant', 'glance', 'expert'] as const
export const RISK = ['nothing', 'buyersSee', 'money', 'penalty', 'unknown'] as const
export const DATA_SOURCE = ['cabinet', 'file', 'sheet', 'head', 'unknown'] as const
export const HANDOVER = ['give', 'keep'] as const

// Шаг 5
export const GOALS = ['myTime', 'noHiring', 'fewerErrors', 'realProfit', 'moreSales'] as const
export const IMPLEMENTERS = ['self', 'employee', 'nobody'] as const
export const IMPLEMENTER_HOURS = ['lt2', '2to5', 'gt5', 'unknown'] as const
export const ACCESS = ['yes', 'readOnly', 'no', 'discuss'] as const
export const RU_ONLY = ['required', 'preferred', 'no', 'unknown'] as const
export const BUDGETS = ['lt50', '50to150', '150to400', 'gt400', 'unknown'] as const

// «Уже есть готовое»: какой ответ селлера означает, что похожим он уже пользуется.
export const READY_TOOL_KEYS = ['reviewsCabinet', 'bidder', 'repricer', 'analytics', 'ledgerSystem'] as const
export type ReadyToolKey = (typeof READY_TOOL_KEYS)[number]

export const LABEL_RE = /^[a-z0-9-]{1,32}$/
