// API Response Types
export interface PlacedItemDto {
  id: number;
  shk: string;
  name: string;
  wr_shk: string | null;
  wr_name: string | null;
  kolvo: number;
  condition: string;
  reason: string | null;
  ispolnitel: string;
  date: string;
  date_upd: string | null;
}

// Add minimal item DTO for upload
export interface AddMinimalItemDto {
  shk: string;
  name: string;
}

// Upload result types
export interface UploadResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: string[];
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PlacedItemsValue {
  items: PlacedItemDto[];
  pagination: PaginationInfo;
}

export interface PlacedItemsResponse {
  success: boolean;
  errorCode: number;
  value: PlacedItemsValue;
}

// Filter Types
export interface FilterState {
  search: string; // Search by shk
  name: string; // Filter by name
  wr_name: string; // Filter by wr_name
  condition: string; // Filter by condition
  ispolnitel: string; // Filter by ispolnitel
  placementStatus: 'all' | 'placed' | 'not_placed'; // Filter by placement status
  dateFrom: string; // Filter by date from (YYYY-MM-DD format)
  dateTo: string; // Filter by date to (YYYY-MM-DD format)
}

// Sort Types
export type SortDirection = 'asc' | 'desc';
export type SortableField = keyof PlacedItemDto;

export interface SortState {
  field: SortableField | null;
  direction: SortDirection;
}

// Pagination Types
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

// Table State
export interface TableState {
  data: PlacedItemDto[];
  filteredData: PlacedItemDto[];
  paginatedData: PlacedItemDto[];
  filters: FilterState;
  sort: SortState;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
} 