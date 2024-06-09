import http from '@/lib/http';

export const registerUser = async (email: string, password: string): Promise<void> => {
  return await http.post('/register', {
    email: email,
    password: password,
  });
};
