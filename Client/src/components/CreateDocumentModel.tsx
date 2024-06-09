import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateDocumentModalStore } from '@/store /CreateDocumentModalStore';
import { createDocument } from '@/apis/document';
import { useQueryClient } from '@tanstack/react-query';
import { ApiGetAllDocumentsKey } from '@/lib/queryKey';
import { useCurrentActiveDocument } from '@/store /useCurrentActiveDocument';
import useUserLoggedInDetails from '@/hooks/useUserLoggedInDetails';

const CreateDocumentModel = (): JSX.Element => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { open, onClose } = useCreateDocumentModalStore();
  const queryClient = useQueryClient();
  const { update } = useCurrentActiveDocument();
  const { userEmail } = useUserLoggedInDetails();

  const handleSubmit = async (): Promise<void> => {
    try {
      if (value.length === 0) {
        inputRef?.current && inputRef.current?.focus();
        return;
      }
      if (!userEmail) {
        throw new Error('Email not found');
      }
      const data = await createDocument(value, userEmail);
      queryClient.invalidateQueries({
        queryKey: [ApiGetAllDocumentsKey],
      });
      navigate(`/${data.id}`);
      update(data);
      onClose();
      setValue('');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle>Create Document</DialogTitle>
          <Input placeholder="Enter your document title" value={value} ref={inputRef} onChange={(e) => setValue(e.target.value)} />
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocumentModel;
