import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = '/api';

// API 请求函数
const apiRequest = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// 获取科目列表
export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => apiRequest('/courseware/subjects'),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
};

// 获取年级列表
export const useGrades = () => {
  return useQuery({
    queryKey: ['grades'],
    queryFn: () => apiRequest('/courseware/grades'),
    staleTime: 5 * 60 * 1000,
  });
};

// 获取册数列表
export const useVolumes = () => {
  return useQuery({
    queryKey: ['volumes'],
    queryFn: () => apiRequest('/courseware/volumes'),
    staleTime: 5 * 60 * 1000,
  });
};

// 生成课件
export const useGenerateCourseware = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiRequest('/courseware/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      // 可以在这里添加成功后的处理逻辑
      queryClient.invalidateQueries({ queryKey: ['courseware'] });
    },
  });
};

// 获取任务状态
export const useTaskStatus = (taskId: string | undefined) => {
  return useQuery({
    queryKey: ['taskStatus', taskId],
    queryFn: () => apiRequest(`/courseware/status/${taskId}`),
    enabled: !!taskId,
    refetchInterval: (data) => {
      return data?.status === 'completed' || data?.status === 'failed' ? false : 2000;
    },
  });
};

// 获取课件结果
export const useCoursewareResult = (taskId: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['coursewareResult', taskId],
    queryFn: () => apiRequest(`/courseware/result/${taskId}`),
    enabled: !!taskId && enabled,
  });
};

// 获取单个课件
export const useCourseware = (id: string | undefined) => {
  return useQuery({
    queryKey: ['courseware', id],
    queryFn: () => apiRequest(`/courseware/${id}`),
    enabled: !!id,
  });
};