import { apiClient } from './client';
import { PlacedItemsResponse, AddMinimalItemDto } from '../../features/inventory-table/model/types';

export const inventoryApi = {
  // Fetch all placed items from the API
  async getPlacedItems(): Promise<PlacedItemsResponse> {
    try {
      const response = await apiClient.get<PlacedItemsResponse>('/x3pl/all?limit=10000&offset=0');
      return response.data;
    } catch (error) {
      console.error('Error fetching placed items:', error);
      throw new Error('Не удалось загрузить данные товаров');
    }
  },

  // Add minimal item to the system
  async addMinimalItem(item: AddMinimalItemDto): Promise<void> {
    try {
      await apiClient.post('/x3pl/add-minimal', item);
    } catch (error) {
      console.error('Error adding minimal item:', error);
      throw new Error(`Не удалось добавить товар: ${item.shk} - ${item.name}`);
    }
  },
}; 