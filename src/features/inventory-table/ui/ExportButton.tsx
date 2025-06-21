import React, { useState } from 'react';
import { PlacedItemDto } from '../model/types';
import { exportToExcel, getExportSummary } from '../../../shared/utils/exportToExcel';
import { Button } from '../../../shared/ui/Button';

interface ExportButtonProps {
  data: PlacedItemDto[];
  disabled?: boolean;
  totalItems?: number;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  disabled = false,
  totalItems,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (data.length === 0) {
      return;
    }

    setIsExporting(true);
    
    try {
      await exportToExcel(data);
      
      // Show success message (could be replaced with toast notification)
      const summary = getExportSummary(totalItems || data.length, data.length);
      console.log('Export successful:', summary);
      
      // You could add a toast notification here
      // toast.success(summary);
      
    } catch (error) {
      console.error('Export failed:', error);
      
      // You could add a toast notification here
      // toast.error('Не удалось экспортировать данные');
      
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handleExport}
      disabled={disabled || isExporting}
      loading={isExporting}
    >
      {isExporting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Экспорт...
        </>
      ) : (
        <>
          <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Экспорт в Excel
        </>
      )}
    </Button>
  );
}; 