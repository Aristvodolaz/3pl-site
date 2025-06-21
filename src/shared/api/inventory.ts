import { apiClient } from './client';
import { PlacedItemsResponse } from '../../features/inventory-table/model/types';

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
}; 