import { useCurrentActiveDocument } from '@/store /useCurrentActiveDocument';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useUserLoggedInDetails from '@/hooks/useUserLoggedInDetails';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { logout } from '@/apis/logout';
import { useIsUserLoggedIn } from '@/store /useUserLoggedIn';
import { USER_SESSION_KEY } from '@/lib/constant';
import { useNavigate } from 'react-router-dom';

const Navbar = (): JSX.Element => {
  const { data } = useCurrentActiveDocument();
  const { userEmail } = useUserLoggedInDetails();
  const { update } = useIsUserLoggedIn();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      sessionStorage.setItem(USER_SESSION_KEY, '');
      update(false);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="w-full h-[60px] flex justify-between items-center px-5 shadow">
      <div className="capitalize subpixel-antialiased text-xl text-stone-900">{data?.title}</div>
      <div>
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
