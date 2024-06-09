import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Button } from './ui/button';
import { useInviteUserModal } from '@/store /useInviteUserModal';
import { Permission } from '@/apis/document';
import { isValidEmail } from '@/lib/emailValidity';
import { useToast } from './ui/use-toast';
import { useParams } from 'react-router-dom';
import { inviteUser } from '@/apis/inviteUser';
import { AxiosError } from 'axios';

const InviteUserModal = () => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<Permission>(Permission.EDITOR);
  const { open, onClose } = useInviteUserModal();
  const { toast } = useToast();
  const { docId } = useParams();

  const handleSubmit = async () => {
    try {
      if (email.length === 0 || !isValidEmail(email)) {
        toast({
          title: 'Something wrong with your email',
          description: 'Please enter correct email address',
        });
        return;
      }
      if (!docId) return;
      await inviteUser(docId, email, permission);
      toast({
        title: 'Successfully invited user',
        description: 'User has been successfully invited',
      });
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: (error as AxiosError)?.message,
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle>Invite User</DialogTitle>
          <div className="flex items-center gap-2">
            <Input placeholder="Enter user email to invite" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Select
              defaultValue={permission}
              onValueChange={(value) => {
                setPermission(value as Permission);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Permissions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Permission.EDITOR}>Editor</SelectItem>
                <SelectItem value={Permission.READONLY}>Read Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-end">
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
