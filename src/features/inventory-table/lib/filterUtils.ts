import { PlacedItemDto, FilterState } from '../model/types';

// Filter items based on filter state
export const filterItems = (items: PlacedItemDto[], filters: FilterState): PlacedItemDto[] => {
  return items.filter((item) => {
    // Search by shk (exact match or partial)
    if (filters.search && (!item.shk || !item.shk.toLowerCase().includes(filters.search.toLowerCase()))) {
      return false;
    }

    // Filter by name (partial match)
    if (filters.name && (!item.name || !item.name.toLowerCase().includes(filters.name.toLowerCase()))) {
      return false;
    }

    // Filter by wr_name (partial match, handle null values)
    if (filters.wr_name) {
      if (!item.wr_name || !item.wr_name.toLowerCase().includes(filters.wr_name.toLowerCase())) {
        return false;
      }
    }

    // Filter by condition (exact match)
    if (filters.condition && item.condition !== filters.condition) {
      return false;
    }

    // Filter by ispolnitel (partial match)
    if (filters.ispolnitel && (!item.ispolnitel || !item.ispolnitel.toLowerCase().includes(filters.ispolnitel.toLowerCase()))) {
      return false;
    }

    // Filter by placement status
    if (filters.placementStatus === 'placed') {
      // Размещенные: есть значения в wr_shk И wr_name
      if (!item.wr_shk || !item.wr_name) {
        return false;
      }
    } else if (filters.placementStatus === 'not_placed') {
      // Неразмещенные: нет значения в wr_shk ИЛИ wr_name
      if (item.wr_shk && item.wr_name) {
        return false;
      }
    }
    // Если 'all', то не фильтруем по размещению

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      const itemDate = new Date(item.date);
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (itemDate < fromDate) {
          return false;
        }
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        // Add one day to include the entire end date
        toDate.setDate(toDate.getDate() + 1);
        if (itemDate >= toDate) {
          return false;
        }
      }
    }

    return true;
  });
};

// Get unique values for filter options
export const getUniqueConditions = (items: PlacedItemDto[]): string[] => {
  const conditions = items.map(item => item.condition);
  return Array.from(new Set(conditions)).sort();
};

// Get unique ispolnitels for filter options
export const getUniqueIspolnitels = (items: PlacedItemDto[]): string[] => {
  const ispolnitels = items.map(item => item.ispolnitel);
  return Array.from(new Set(ispolnitels)).sort();
};

// Get placement statistics
export const getPlacementStats = (items: PlacedItemDto[]) => {
  const placed = items.filter(item => item.wr_shk && item.wr_name).length;
  const notPlaced = items.length - placed;
  
  return {
    total: items.length,
    placed,
    notPlaced,
  };
};

// Check if any filters are active
export const hasActiveFilters = (filters: FilterState): boolean => {
  return !!(
    filters.search || 
    filters.name || 
    filters.wr_name || 
    filters.condition || 
    filters.ispolnitel ||
    filters.placementStatus !== 'all' ||
    filters.dateFrom ||
    filters.dateTo
  );
};

// Reset all filters to empty state
export const resetFilters = (): FilterState => ({
  search: '',
  name: '',
  wr_name: '',
  condition: '',
  ispolnitel: '',
  placementStatus: 'all',
  dateFrom: '',
  dateTo: '',
}); 