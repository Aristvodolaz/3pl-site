import React from 'react';
import { FilterState } from '../model/types';
import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { Button } from '../../../shared/ui/Button';
import { getPlacementStats, hasActiveFilters } from '../lib/filterUtils';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableConditions: string[];
  availableIspolnitels?: string[];
  allData: any[]; // Для подсчета статистики
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  availableConditions,
  availableIspolnitels = [],
  allData,
}) => {
  const conditionOptions = [
    { value: '', label: 'Все состояния' },
    ...availableConditions.map(condition => ({
      value: condition,
      label: condition,
    })),
  ];

  const ispolnitelOptions = [
    { value: '', label: 'Все исполнители' },
    ...availableIspolnitels.map(ispolnitel => ({
      value: ispolnitel,
      label: ispolnitel,
    })),
  ];

  const stats = getPlacementStats(allData);

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header with Title and Status Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Фильтры и поиск
          </h3>
          
          {/* Reset Filters Button */}
          {hasActiveFilters(filters) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
            >
              Сбросить все фильтры
            </Button>
          )}
        </div>
        
        {/* Placement Status Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Статус размещения:
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.placementStatus === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ placementStatus: 'all' })}
              className="min-w-fit"
            >
              Все ({stats.total})
            </Button>
            <Button
              variant={filters.placementStatus === 'placed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ placementStatus: 'placed' })}
              className="min-w-fit"
            >
              Размещенные ({stats.placed})
            </Button>
            <Button
              variant={filters.placementStatus === 'not_placed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ placementStatus: 'not_placed' })}
              className="min-w-fit"
            >
              Неразмещенные ({stats.notPlaced})
            </Button>
          </div>
        </div>
      </div>

      {/* Main Filters Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
          Основные фильтры
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Search by SHK */}
          <div>
            <Input
              label="Поиск по ШК"
              type="search"
              value={filters.search}
              onChange={(value) => onFiltersChange({ search: value })}
              placeholder="Введите ШК товара"
            />
          </div>

          {/* Filter by Name */}
          <div>
            <Input
              label="Фильтр по наименованию"
              value={filters.name}
              onChange={(value) => onFiltersChange({ name: value })}
              placeholder="Введите наименование"
            />
          </div>

          {/* Filter by WR Name */}
          <div>
            <Input
              label="Фильтр по названию ячейки"
              value={filters.wr_name}
              onChange={(value) => onFiltersChange({ wr_name: value })}
              placeholder="Введите название ячейки"
            />
          </div>

          {/* Filter by Condition */}
          <div>
            <Select
              label="Фильтр по состоянию"
              value={filters.condition}
              onChange={(value) => onFiltersChange({ condition: value })}
              options={conditionOptions}
              placeholder="Выберите состояние"
            />
          </div>

          {/* Filter by Ispolnitel */}
          <div>
            <Select
              label="Фильтр по исполнителю"
              value={filters.ispolnitel}
              onChange={(value) => onFiltersChange({ ispolnitel: value })}
              options={ispolnitelOptions}
              placeholder="Выберите исполнителя"
            />
          </div>
        </div>
      </div>

      {/* Date Filters Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
          Фильтр по дате создания
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filter by Date From */}
          <div>
            <Input
              label="Дата с"
              type="date"
              value={filters.dateFrom}
              onChange={(value) => onFiltersChange({ dateFrom: value })}
              placeholder="Выберите дату начала"
            />
          </div>

          {/* Filter by Date To */}
          <div>
            <Input
              label="Дата по"
              type="date"
              value={filters.dateTo}
              onChange={(value) => onFiltersChange({ dateTo: value })}
              placeholder="Выберите дату окончания"
            />
          </div>

          {/* Spacer for alignment */}
          <div className="hidden lg:block"></div>
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </div>
  );
}; 