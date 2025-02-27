// Based on https://github.com/PaddleHQ/paddle-node-sdk/blob/main/src/internal/types/response.ts
declare global {
  export interface PaddlePagination {
    per_page: number;
    next: string;
    has_more: boolean;
    estimated_total: number;
  }

  export interface PaddleMeta {
    request_id: string;
  }

  export interface PaddleMetaPaginated extends PaddleMeta {
    pagination: PaddlePagination;
  }

  export interface PaddleResponse<T> {
    data: T;
    meta: PaddleMeta;
  }

  export interface PaddleResponsePaginated<T> {
    data: T[];
    meta: PaddleMetaPaginated;
  }
}

export {};
