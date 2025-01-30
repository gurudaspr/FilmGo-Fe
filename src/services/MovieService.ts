
import { SearchResponse } from '../types/movie';
import apiClient from '@/config/axio';


export const searchMovies = async (query: string): Promise<SearchResponse> => {
  try {
    const response = await apiClient.get<SearchResponse>(`/search`, {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};