import { PlacedItemDto, SortState, SortableField } from '../model/types';

// Sort items based on sort state
export const sortItems = (items: PlacedItemDto[], sort: SortState): PlacedItemDto[] => {
  if (!sort.field) {
    return items;
  }

  return [...items].sort((a, b) => {
    const aValue = a[sort.field!];
    const bValue = b[sort.field!];

    // Handle null values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return sort.direction === 'asc' ? 1 : -1;
    if (bValue === null) return sort.direction === 'asc' ? -1 : 1;

    // Handle different data types
    let comparison = 0;
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      // Convert to string for comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      comparison = aStr.localeCompare(bStr);
    }

    return sort.direction === 'asc' ? comparison : -comparison;
  });
};

// Toggle sort direction for a field
export const toggleSort = (currentSort: SortState, field: SortableField): SortState => {
  if (currentSort.field === field) {
    // If clicking the same field, toggle direction
    return {
      field,
      direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
    };
  } else {
    // If clicking a different field, set to ascending
    return {
      field,
      direction: 'asc',
    };
  }
};

// Get sort icon class based on current sort state
export const getSortIcon = (field: SortableField, currentSort: SortState): string => {
  if (currentSort.field !== field) {
    return 'sort-none'; // No sorting applied
  }
  
  return currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc';
};

// Reset sort to no sorting
export const resetSort = (): SortState => ({
  field: null,
  direction: 'asc',
}); 