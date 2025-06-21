import React from 'react';
import { useInventoryTable, useDarkMode } from '../features/inventory-table/model/hooks';
import { FilterPanel } from '../features/inventory-table/ui/FilterPanel';
import { InventoryTable } from '../features/inventory-table/ui/InventoryTable';
import { Pagination } from '../features/inventory-table/ui/Pagination';
import { ExportButton } from '../features/inventory-table/ui/ExportButton';
import { Button } from '../shared/ui/Button';
import { Loader } from '../shared/ui/Loader';
import { getUniqueIspolnitels } from '../features/inventory-table/lib/filterUtils';

const Dashboard: React.FC = () => {
  const {
    data,
    filteredData,
    paginatedData,
    loading,
    error,
    filters,
    sort,
    pagination,
    loadData,
    updateFilters,
    handleResetFilters,
    updateSort,
    goToPage,
    changePageSize,
  } = useInventoryTable();

  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                3PL Inventory Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="p-2"
              >
                {isDark ? '☀️' : '🌙'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                loading={loading}
              >
                Обновить
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                  Ошибка загрузки данных
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex justify-center py-12">
            <Loader size="lg" text="Загрузка данных..." />
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Filters Panel */}
            <div className="mb-6">
              <FilterPanel
                filters={filters}
                onFiltersChange={updateFilters}
                onResetFilters={handleResetFilters}
                availableConditions={Array.from(new Set(data.map(item => item.condition)))}
                availableIspolnitels={getUniqueIspolnitels(data)}
                allData={data}
              />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <InventoryTable
                data={paginatedData}
                sort={sort}
                onSortChange={updateSort}
                loading={loading}
              />
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="mt-6">
                <Pagination
                  pagination={pagination}
                  onPageChange={goToPage}
                  onPageSizeChange={changePageSize}
                />
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredData.length === data.length ? (
                  `Всего записей: ${data.length}`
                ) : (
                  `Показано ${filteredData.length} из ${data.length} записей`
                )}
              </div>
              <div className="flex justify-end">
                <ExportButton
                  data={filteredData}
                  disabled={filteredData.length === 0}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard; 