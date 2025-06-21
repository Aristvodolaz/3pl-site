import * as XLSX from 'xlsx';
import { PlacedItemDto } from '../../features/inventory-table/model/types';

// Column headers mapping for Excel export
const COLUMN_HEADERS = {
  id: 'ID',
  shk: 'ШК',
  name: 'Наименование',
  wr_shk: 'ШК ячейки',
  wr_name: 'Название ячейки',
  kolvo: 'Количество',
  condition: 'Состояние',
  reason: 'Причина',
  ispolnitel: 'Исполнитель',
  date: 'Дата создания',
  date_upd: 'Дата обновления',
};

// Format date for Excel
const formatDateForExcel = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Map condition values for Excel
const mapConditionForExcel = (condition: string): string => {
  const conditionMap: { [key: string]: string } = {
    Good: 'Кондиция',
    Defective: 'Некондиция',
  };
  return conditionMap[condition] || condition;
};

// Export data to Excel file
export const exportToExcel = (data: PlacedItemDto[], filename?: string): void => {
  try {
    // Prepare data for Excel with proper headers
    const excelData = data.map(item => ({
      [COLUMN_HEADERS.id]: item.id,
      [COLUMN_HEADERS.shk]: item.shk,
      [COLUMN_HEADERS.name]: item.name,
      [COLUMN_HEADERS.wr_shk]: item.wr_shk || '',
      [COLUMN_HEADERS.wr_name]: item.wr_name || '',
      [COLUMN_HEADERS.kolvo]: item.kolvo,
      [COLUMN_HEADERS.condition]: mapConditionForExcel(item.condition),
      [COLUMN_HEADERS.reason]: item.reason || '',
      [COLUMN_HEADERS.ispolnitel]: item.ispolnitel,
      [COLUMN_HEADERS.date]: formatDateForExcel(item.date),
      [COLUMN_HEADERS.date_upd]: formatDateForExcel(item.date_upd),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 8 },  // ID
      { wch: 15 }, // ШК
      { wch: 30 }, // Наименование
      { wch: 15 }, // ШК ячейки
      { wch: 20 }, // Название ячейки
      { wch: 12 }, // Количество
      { wch: 15 }, // Состояние
      { wch: 25 }, // Причина
      { wch: 30 }, // Исполнитель
      { wch: 18 }, // Дата создания
      { wch: 18 }, // Дата обновления
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Размещенный товар');

    // Generate filename with current date if not provided
    const defaultFilename = `inventory_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.xlsx`;
    const finalFilename = filename || defaultFilename;

    // Write and download the file
    XLSX.writeFile(workbook, finalFilename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Не удалось экспортировать данные в Excel');
  }
};

// Get export summary info
export const getExportSummary = (totalItems: number, filteredItems: number): string => {
  if (totalItems === filteredItems) {
    return `Экспортировано ${totalItems} записей`;
  }
  return `Экспортировано ${filteredItems} из ${totalItems} записей (с учетом фильтров)`;
}; 