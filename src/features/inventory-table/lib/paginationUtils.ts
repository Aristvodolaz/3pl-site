import { PlacedItemDto, PaginationState } from '../model/types';

// Get paginated data slice
export const getPaginatedData = (
  items: PlacedItemDto[],
  pagination: PaginationState
): PlacedItemDto[] => {
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  return items.slice(startIndex, endIndex);
};

// Calculate total pages
export const getTotalPages = (totalItems: number, pageSize: number): number => {
  return Math.ceil(totalItems / pageSize);
};

// Get pagination info text
export const getPaginationInfo = (pagination: PaginationState): string => {
  const startItem = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems);
  
  if (pagination.totalItems === 0) {
    return 'Нет данных для отображения';
  }
  
  return `Показано ${startItem}-${endItem} из ${pagination.totalItems} записей`;
};

// Check if we can go to previous page
export const canGoPrevious = (currentPage: number): boolean => {
  return currentPage > 1;
};

// Check if we can go to next page
export const canGoNext = (currentPage: number, totalPages: number): boolean => {
  return currentPage < totalPages;
};

// Get page numbers for pagination controls
export const getPageNumbers = (currentPage: number, totalPages: number): number[] => {
  const delta = 2; // Number of pages to show on each side
  const range: number[] = [];
  
  for (let i = Math.max(2, currentPage - delta); 
       i <= Math.min(totalPages - 1, currentPage + delta); 
       i++) {
    range.push(i);
  }
  
  if (currentPage - delta > 2) {
    range.unshift(-1); // -1 represents ellipsis
  }
  if (currentPage + delta < totalPages - 1) {
    range.push(-1); // -1 represents ellipsis
  }
  
  range.unshift(1); // Always show first page
  if (totalPages > 1) {
    range.push(totalPages); // Always show last page
  }
  
  return range.filter((page, index, array) => array.indexOf(page) === index);
};

// Update pagination state when data changes
export const updatePaginationForNewData = (
  currentPagination: PaginationState,
  newTotalItems: number
): PaginationState => {
  const totalPages = getTotalPages(newTotalItems, currentPagination.pageSize);
  
  return {
    ...currentPagination,
    totalItems: newTotalItems,
    currentPage: Math.min(currentPagination.currentPage, Math.max(1, totalPages)),
  };
};

// Reset pagination to first page
export const resetPagination = (pageSize: number): PaginationState => ({
  currentPage: 1,
  pageSize,
  totalItems: 0,
}); 