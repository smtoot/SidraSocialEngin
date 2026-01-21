import axios from 'axios';
import type { ApiResponse, IdeationResponse, CopywritingRequest, CopywritingResponse, IdeaOption } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ideationApi = {
  generateIdeas: async (topic: string): Promise<IdeationResponse> => {
    const response = await api.post<ApiResponse<IdeationResponse>>('/api/ideation/generate', { topic });
    return response.data.data!;
  },
  
  createManualIdea: async (cardId: string, idea: IdeaOption): Promise<IdeationResponse> => {
    const response = await api.post<ApiResponse<IdeationResponse>>('/api/ideation/manual', { cardId, idea });
    return response.data.data!;
  },
  
  selectIdea: async (cardId: string, ideaId: string): Promise<void> => {
    await api.post('/api/ideation/select', { cardId, ideaId });
  },
};

export const copywritingApi = {
  composeCopy: async (request: CopywritingRequest): Promise<CopywritingResponse> => {
    const response = await api.post<ApiResponse<CopywritingResponse>>('/api/copywriting/compose', request);
    return response.data.data!;
  },
  
  createManualCopy: async (cardId: string, copyText: string, authorId: string, authorName: string): Promise<void> => {
    await api.post('/api/copywriting/manual', { cardId, copyText, authorId, authorName });
  },
  
  approveCopy: async (cardId: string, edits?: string): Promise<void> => {
    await api.post('/api/copywriting/approve', { cardId, edits });
  },
};

export const visualDesignApi = {
  generateImage: async (prompt: string, style: string): Promise<{ url: string; prompt: string }> => {
    const response = await api.post<ApiResponse<{ url: string; prompt: string }>>('/api/visual-design/generate', { prompt, style });
    return response.data.data!;
  },
  
  selectImage: async (cardId: string, imageData: { id: string; url: string; prompt: string; source: string }): Promise<void> => {
    await api.post('/api/visual-design/select', { cardId, imageData });
  },
  
  uploadImage: async (cardId: string, file: File): Promise<{ id: string; url: string; source: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cardId', cardId);
    const response = await api.post<ApiResponse<{ id: string; url: string; source: string }>>('/api/visual-design/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },
};

export const schedulingApi = {
  schedulePost: async (
    cardId: string,
    scheduledDate: string,
    scheduledTime: string,
    platform: string,
    notes?: string
  ): Promise<void> => {
    await api.post('/api/scheduling/schedule', { cardId, scheduledDate, scheduledTime, platform, notes });
  },
  
  submitForReview: async (cardId: string): Promise<void> => {
    await api.post('/api/scheduling/submit-review', { cardId });
  },
  
  addToLibrary: async (cardId: string): Promise<void> => {
    await api.post('/api/scheduling/add-library', { cardId });
  },
};

export const libraryApi = {
  fetchLibrary: async (): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>('/api/content/library');
    return response.data?.data || [];
  },
};

export const categoriesApi = {
  getAll: async (): Promise<ContentCategory[]> => {
    const response = await api.get<ApiResponse<ContentCategory[]>>('/api/content/categories');
    return response.data?.data || [];
  },

  getSummary: async (): Promise<CategorySummary[]> => {
    const response = await api.get<ApiResponse<CategorySummary[]>>('/api/content/categories/summary');
    return response.data?.data || [];
  },

  create: async (category: Partial<ContentCategory>): Promise<ContentCategory> => {
    const response = await api.post<ApiResponse<ContentCategory>>('/api/content/categories', category);
    return response.data!;
  },
};

export const ideasApi = {
  create: async (data: { categoryId: string; angle: string; contentType: string; ideaText: string }): Promise<ContentIdea> => {
    const response = await api.post<ApiResponse<ContentIdea>>('/api/content/ideas', data);
    return response.data!;
  },

  generate: async (data: { categoryId: string; angle: string; contentType: string }): Promise<ContentIdea[]> => {
    const response = await api.post<ApiResponse<ContentIdea[]>>('/api/content/ideas/generate', data);
    return response.data?.data || [];
  },

  approve: async (ideaId: string): Promise<void> => {
    await api.put(`/api/content/ideas/${ideaId}/approve`);
  },
};

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  },
  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
  getUser: () => {
    const user = localStorage.getItem('user_info');
    return user ? JSON.parse(user) : null;
  },
};

export default api;
