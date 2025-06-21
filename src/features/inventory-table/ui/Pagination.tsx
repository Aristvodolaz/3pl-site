import React from 'react';
import { PaginationState } from '../model/types';
import { getTotalPages, canGoPrevious, canGoNext, getPageNumbers, getPaginationInfo } from '../lib/paginationUtils';
import { PAGINATION } from '../../../shared/config/constants';
import { Button } from '../../../shared/ui/Button';
import { Select } from '../../../shared/ui/Select';

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = getTotalPages(pagination.totalItems, pagination.pageSize);
  const pageNumbers = getPageNumbers(pagination.currentPage, totalPages);
  const paginationInfo = getPaginationInfo(pagination);

  const pageSizeOptions = PAGINATION.PAGE_SIZE_OPTIONS.map(size => ({
    value: size.toString(),
    label: `${size} записей`,
  }));

  if (pagination.totalItems === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center justify-between">
        {/* Pagination Info */}
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {paginationInfo}
          </p>
          
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Показать:
            </span>
            <Select
              value={pagination.pageSize.toString()}
              onChange={(value) => onPageSizeChange(parseInt(value))}
              options={pageSizeOptions}
              className="w-32"
            />
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* First Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious(pagination.currentPage)}
          >
            ««
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!canGoPrevious(pagination.currentPage)}
          >
            «
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === -1) {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.currentPage ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="min-w-[2.5rem]"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          {/* Next Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!canGoNext(pagination.currentPage, totalPages)}
          >
            »
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext(pagination.currentPage, totalPages)}
          >
            »»
          </Button>
        </div>
      </div>
    </div>
  );
}; 