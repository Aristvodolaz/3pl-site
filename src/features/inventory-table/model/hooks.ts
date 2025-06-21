import { useState, useEffect, useMemo } from 'react';
import { PlacedItemDto, FilterState, SortState, PaginationState } from './types';
import { inventoryApi } from '../../../shared/api/inventory';
import { filterItems, resetFilters } from '../lib/filterUtils';
import { sortItems, resetSort } from '../lib/sortUtils';
import { getPaginatedData, updatePaginationForNewData, resetPagination } from '../lib/paginationUtils';
import { PAGINATION } from '../../../shared/config/constants';

// Main hook for inventory table management
export const useInventoryTable = () => {
  const [data, setData] = useState<PlacedItemDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>(resetFilters());
  const [sort, setSort] = useState<SortState>(resetSort());
  const [pagination, setPagination] = useState<PaginationState>(
    resetPagination(PAGINATION.DEFAULT_PAGE_SIZE)
  );

  // Load data from API
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await inventoryApi.getPlacedItems();
      
      if (response.success) {
        setData(response.value.items);
      } else {
        throw new Error(`API Error: ${response.errorCode}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Error loading inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Calculate filtered and sorted data
  const filteredData = useMemo(() => {
    let result = filterItems(data, filters);
    result = sortItems(result, sort);
    return result;
  }, [data, filters, sort]);

  // Update pagination when filtered data changes
  useEffect(() => {
    setPagination(prev => updatePaginationForNewData(prev, filteredData.length));
  }, [filteredData.length]);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    return getPaginatedData(filteredData, pagination);
  }, [filteredData, pagination]);

  // Update filters
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters(resetFilters());
    setSort(resetSort());
    setPagination(resetPagination(pagination.pageSize));
  };

  // Update sort
  const updateSort = (newSort: SortState) => {
    setSort(newSort);
  };

  // Update pagination
  const updatePagination = (newPagination: Partial<PaginationState>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  };

  // Go to specific page
  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Change page size
  const changePageSize = (pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize,
      currentPage: 1, // Reset to first page when changing page size
    }));
  };

  return {
    // Data
    data,
    filteredData,
    paginatedData,
    
    // State
    loading,
    error,
    filters,
    sort,
    pagination,
    
    // Actions
    loadData,
    updateFilters,
    handleResetFilters,
    updateSort,
    updatePagination,
    goToPage,
    changePageSize,
  };
};

// Hook for managing dark mode
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored) {
        return stored === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', isDark.toString());
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return { isDark, toggleDarkMode };
}; 