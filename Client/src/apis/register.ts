import http from '@/lib/http';
import { AxiosResponse } from 'axios';

export const registerUser = async (email: string, password: string): Promise<AxiosResponse> => {
  return await http.post('/register', {
    email: email,
    password: password,
  });
};
