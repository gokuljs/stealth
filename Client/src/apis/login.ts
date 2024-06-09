import http from '@/lib/http';
import { AxiosResponse } from 'axios';

export const loginUser = async (email: string, password: string): Promise<AxiosResponse> => {
  return http.post('/login', {
    email,
    password,
  });
};
