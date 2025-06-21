import React, { useState, useRef } from 'react';
import { Button } from '../../../shared/ui/Button';
import { inventoryApi } from '../../../shared/api/inventory';
import { parseExcelFile, validateFileType, getFileSizeString } from '../../../shared/utils/importFromExcel';
import { AddMinimalItemDto, UploadResult } from '../model/types';

interface UploadButtonProps {
  onUploadComplete?: (result: UploadResult) => void;
  disabled?: boolean;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  onUploadComplete,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!validateFileType(file)) {
      alert('Пожалуйста, выберите файл Excel (.xlsx или .xls)');
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(`Файл слишком большой (${getFileSizeString(file.size)}). Максимальный размер: ${getFileSizeString(maxSize)}`);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      // Trigger file selection
      fileInputRef.current?.click();
      return;
    }

    setIsUploading(true);
    setShowProgress(true);
    setUploadProgress(0);

    try {
      // Parse Excel file
      const items = await parseExcelFile(selectedFile);
      
      if (items.length === 0) {
        throw new Error('В файле не найдены данные для загрузки');
      }

      // Upload items with progress tracking
      const result: UploadResult = {
        success: true,
        processed: 0,
        failed: 0,
        errors: [],
      };

      const batchSize = 10; // Process 10 items at a time
      const totalBatches = Math.ceil(items.length / batchSize);

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startIndex = batchIndex * batchSize;
        const endIndex = Math.min(startIndex + batchSize, items.length);
        const batch = items.slice(startIndex, endIndex);

        // Process batch
        const batchPromises = batch.map(async (item: AddMinimalItemDto) => {
          try {
            await inventoryApi.addMinimalItem(item);
            result.processed++;
          } catch (error) {
            result.failed++;
            const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
            result.errors.push(`${item.shk}: ${errorMessage}`);
          }
        });

        await Promise.all(batchPromises);

        // Update progress
        const progress = Math.round(((batchIndex + 1) / totalBatches) * 100);
        setUploadProgress(progress);

        // Small delay to show progress
        if (batchIndex < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Call completion callback
      if (onUploadComplete) {
        onUploadComplete(result);
      }

      // Show success message
      const successMessage = result.failed === 0 
        ? `Успешно загружено ${result.processed} товаров`
        : `Загружено ${result.processed} товаров, ошибок: ${result.failed}`;
      
      alert(successMessage);

      // Reset state
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert(`Ошибка загрузки: ${errorMessage}`);
      
      if (onUploadComplete) {
        onUploadComplete({
          success: false,
          processed: 0,
          failed: 0,
          errors: [errorMessage],
        });
      }
    } finally {
      setIsUploading(false);
      setShowProgress(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File selection or upload button */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={handleUpload}
          disabled={disabled || isUploading}
          loading={isUploading}
          variant="primary"
          size="sm"
        >
          {selectedFile ? 'Загрузить задание' : 'Выбрать файл'}
        </Button>

        {selectedFile && !isUploading && (
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
          >
            Отменить
          </Button>
        )}
      </div>

      {/* Selected file info */}
      {selectedFile && !isUploading && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span>📄</span>
            <span>{selectedFile.name}</span>
            <span className="text-gray-500">({getFileSizeString(selectedFile.size)})</span>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {showProgress && (
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Загрузка...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Help text */}
      {!selectedFile && !isUploading && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Поддерживаемые форматы: Excel (.xlsx, .xls)
          <br />
          Обязательные колонки: "Артикул", "Название"
        </div>
      )}
    </div>
  );
}; 