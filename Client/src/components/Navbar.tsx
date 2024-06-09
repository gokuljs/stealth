import { useCurrentActiveDocument } from '@/store /useCurrentActiveDocument';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useUserLoggedInDetails from '@/hooks/useUserLoggedInDetails';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Plus } from 'lucide-react';
import { logout } from '@/apis/logout';
import { useIsUserLoggedIn } from '@/store /useUserLoggedIn';
import { USER_SESSION_KEY } from '@/lib/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { useInviteUserModal } from '@/store /useInviteUserModal';
import { Permission } from '@/apis/document';
import { Badge } from '@/components/ui/badge';

const Navbar = (): JSX.Element => {
  const { data } = useCurrentActiveDocument();
  const { docId } = useParams();
  const { userEmail } = useUserLoggedInDetails();
  const { update } = useIsUserLoggedIn();
  const navigate = useNavigate();
  const { onOpen } = useInviteUserModal();
  const role = data?.collaborators?.find((item) => item.email === userEmail)?.permission;
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      sessionStorage.setItem(USER_SESSION_KEY, '');
      update(false);
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="w-full h-[60px] flex justify-between items-center px-5 shadow">
      <div className="capitalize subpixel-antialiased text-xl text-stone-900  flex items-center gap-2 max-w-[300px]">
        {data?.title}
        {role && <Badge variant="secondary">{role}</Badge>}
      </div>
      <div className="flex items-center gap-2">
        {data && docId && role && role === Permission.OWNER && (
          <Button variant={'ghost'} onClick={onOpen}>
            <Plus className="h-5 w-5" />
            invite
          </Button>
        )}
        {userEmail && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{userEmail[0] + userEmail[1]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" alignOffset={10}>
              <DropdownMenuLabel className="flex text-red-700 items-center gap-1 cursor-pointer" onClick={handleLogout}>
                Logout <LogOut className="h-4" />
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
