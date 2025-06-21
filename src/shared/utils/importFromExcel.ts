import * as XLSX from 'xlsx';
import { AddMinimalItemDto } from '../../features/inventory-table/model/types';

// Possible column name variations
const COLUMN_VARIATIONS = {
  ARTIKUL: ['Артикул', 'артикул', 'АРТИКУЛ', 'shk', 'SHK', 'ШК', 'шк'],
  NAME: ['Название', 'название', 'НАЗВАНИЕ', 'name', 'NAME', 'Наименование', 'наименование', 'НАИМЕНОВАНИЕ'],
};

// Validate Excel file structure
const validateExcelStructure = (headers: string[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check if we have the required columns
  const hasArtikul = COLUMN_VARIATIONS.ARTIKUL.some(variant => 
    headers.some(header => header.trim().toLowerCase() === variant.toLowerCase())
  );
  
  const hasName = COLUMN_VARIATIONS.NAME.some(variant => 
    headers.some(header => header.trim().toLowerCase() === variant.toLowerCase())
  );
  
  if (!hasArtikul) {
    errors.push(`Не найдена колонка "Артикул". Ожидаемые варианты: ${COLUMN_VARIATIONS.ARTIKUL.join(', ')}`);
  }
  
  if (!hasName) {
    errors.push(`Не найдена колонка "Название". Ожидаемые варианты: ${COLUMN_VARIATIONS.NAME.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Find column index by name variations
const findColumnIndex = (headers: string[], variations: string[]): number => {
  for (const variation of variations) {
    const index = headers.findIndex(header => 
      header.trim().toLowerCase() === variation.toLowerCase()
    );
    if (index !== -1) {
      return index;
    }
  }
  return -1;
};

// Parse Excel file and extract minimal items
export const parseExcelFile = async (file: File): Promise<AddMinimalItemDto[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          reject(new Error('Excel файл не содержит листов'));
          return;
        }
        
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        if (jsonData.length === 0) {
          reject(new Error('Excel файл пустой'));
          return;
        }
        
        // Get headers from first row
        const headers = jsonData[0] || [];
        
        // Validate structure
        const validation = validateExcelStructure(headers);
        if (!validation.isValid) {
          reject(new Error(`Неверная структура файла:\n${validation.errors.join('\n')}`));
          return;
        }
        
        // Find column indices
        const artikulIndex = findColumnIndex(headers, COLUMN_VARIATIONS.ARTIKUL);
        const nameIndex = findColumnIndex(headers, COLUMN_VARIATIONS.NAME);
        
        if (artikulIndex === -1 || nameIndex === -1) {
          reject(new Error('Не удалось найти необходимые колонки'));
          return;
        }
        
        // Parse data rows (skip header)
        const items: AddMinimalItemDto[] = [];
        const errors: string[] = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          if (!row || row.length === 0) {
            continue; // Skip empty rows
          }
          
          const shk = row[artikulIndex]?.toString().trim();
          const name = row[nameIndex]?.toString().trim();
          
          // Validate row data
          if (!shk || !name) {
            errors.push(`Строка ${i + 1}: пропущены обязательные поля (Артикул: "${shk || ''}", Название: "${name || ''}")`);
            continue;
          }
          
          items.push({
            shk,
            name,
          });
        }
        
        if (items.length === 0) {
          reject(new Error('В файле не найдены валидные данные для загрузки'));
          return;
        }
        
        if (errors.length > 0) {
          console.warn('Warnings during Excel parsing:', errors);
        }
        
        resolve(items);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(new Error('Ошибка при чтении Excel файла'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Ошибка при чтении файла'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Validate file type
export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ];
  
  return allowedTypes.includes(file.type) || 
         file.name.toLowerCase().endsWith('.xlsx') || 
         file.name.toLowerCase().endsWith('.xls');
};

// Get file size in human readable format
export const getFileSizeString = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 