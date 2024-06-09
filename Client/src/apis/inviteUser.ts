import http from '@/lib/http';
import { AxiosResponse } from 'axios';
import { Permission } from './document';

export const inviteUser = async (docId: string, email: string, permissions: Permission): Promise<AxiosResponse> => {
  return await http.post('/inviteUser', { docId, email, permissions });
};
