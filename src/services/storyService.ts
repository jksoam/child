import api from './api';
import { Story } from '../types';

export interface CreateStoryRequest {
  caption: string;
  image: File;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const storyService = {
  async getStories(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Story>> {
    const response = await api.get(`/stories?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  async getStory(id: string): Promise<Story> {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  async createStory(storyData: CreateStoryRequest): Promise<Story> {
    const formData = new FormData();
    formData.append('caption', storyData.caption);
    formData.append('image', storyData.image);

    const response = await api.post('/stories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async toggleLike(storyId: string): Promise<void> {
    await api.post(`/stories/${storyId}/like`);
  },

  async addComment(storyId: string, text: string): Promise<void> {
    await api.post(`/stories/${storyId}/comments`, { text });
  },

  async getComments(storyId: string): Promise<any[]> {
    const response = await api.get(`/stories/${storyId}/comments`);
    return response.data;
  }
};