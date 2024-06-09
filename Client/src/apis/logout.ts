import http from '@/lib/http';
import { AxiosResponse } from 'axios';

export const logout = async (): Promise<AxiosResponse> => {
  return await http.post('/logout');
};
