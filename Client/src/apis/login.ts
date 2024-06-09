import http from '@/lib/http';

export const loginUser = async (email: string, password: string): Promise<void> => {
  return http.post('/login', {
    email,
    password,
  });
};
