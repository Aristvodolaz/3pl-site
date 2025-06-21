import React from 'react';
import { PlacedItemDto, SortState, SortableField } from '../model/types';
import { toggleSort } from '../lib/sortUtils';

interface InventoryTableProps {
  data: PlacedItemDto[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  loading?: boolean;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  sort,
  onSortChange,
  loading = false,
}) => {
  const handleSort = (field: SortableField) => {
    const newSort = toggleSort(sort, field);
    onSortChange(newSort);
  };

  const getSortIconSymbol = (field: SortableField) => {
    if (sort.field !== field) {
      return '↕️'; // No sorting
    }
    return sort.direction === 'asc' ? '↑' : '↓';
  };

  const conditionDisplayMap: { [key: string]: { label: string; className: string } } = {
    Good: {
      label: 'Кондиция',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    Defective: {
      label: 'Некондиция',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
  };

  const getConditionDisplay = (condition: string) => {
    return conditionDisplayMap[condition] || {
      label: condition,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns = [
    { key: 'id' as SortableField, label: 'ID', width: 'w-16' },
    { key: 'shk' as SortableField, label: 'ШК', width: 'w-32' },
    { key: 'name' as SortableField, label: 'Наименование', width: 'w-48' },
    { key: 'wr_shk' as SortableField, label: 'ШК ячейки', width: 'w-32' },
    { key: 'wr_name' as SortableField, label: 'Название ячейки', width: 'w-32' },
    { key: 'kolvo' as SortableField, label: 'Количество', width: 'w-24' },
    { key: 'condition' as SortableField, label: 'Состояние', width: 'w-32' },
    { key: 'reason' as SortableField, label: 'Причина', width: 'w-40' },
    { key: 'ispolnitel' as SortableField, label: 'Исполнитель', width: 'w-48' },
    { key: 'date' as SortableField, label: 'Дата создания', width: 'w-36' },
    { key: 'date_upd' as SortableField, label: 'Дата обновления', width: 'w-36' },
  ];

  if (data.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H1" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          Нет данных
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Данные не найдены или не соответствуют фильтрам.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="table-header">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`table-header-cell ${column.width}`}
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  <span className="sort-icon text-gray-400">
                    {getSortIconSymbol(column.key)}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item, index) => (
            <tr
              key={`${item.id}-${index}`}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="table-cell text-gray-900 dark:text-white font-semibold">
                {item.id}
              </td>
              <td className="table-cell text-gray-900 dark:text-white font-mono">
                {item.shk}
              </td>
              <td className="table-cell text-gray-900 dark:text-white">
                <div className="max-w-xs truncate" title={item.name}>
                  {item.name}
                </div>
              </td>
              <td className="table-cell text-gray-500 dark:text-gray-400 font-mono">
                {item.wr_shk || '-'}
              </td>
              <td className="table-cell text-gray-500 dark:text-gray-400">
                <div className="max-w-xs truncate" title={item.wr_name || ''}>
                  {item.wr_name || '-'}
                </div>
              </td>
              <td className="table-cell text-gray-900 dark:text-white text-right font-semibold">
                {item.kolvo.toLocaleString()}
              </td>
              <td className="table-cell">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionDisplay(item.condition).className}`}>
                  {getConditionDisplay(item.condition).label}
                </span>
              </td>
              <td className="table-cell text-gray-500 dark:text-gray-400">
                <div className="max-w-xs truncate" title={item.reason || ''}>
                  {item.reason || '-'}
                </div>
              </td>
              <td className="table-cell text-gray-900 dark:text-white">
                <div className="max-w-xs truncate" title={item.ispolnitel}>
                  {item.ispolnitel}
                </div>
              </td>
              <td className="table-cell text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(item.date)}
              </td>
              <td className="table-cell text-gray-500 dark:text-gray-400 text-sm">
                {item.date_upd ? formatDate(item.date_upd) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 