import { USER_SESSION_KEY } from '@/lib/constant';
import { useIsUserLoggedIn } from '@/store /useUserLoggedIn';
import { useEffect, useState } from 'react';

interface returnTypeProps {
  userEmail: string | null;
  isLoggedIn: boolean;
}

function useUserLoggedInDetails(): returnTypeProps {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const userEmail = sessionStorage.getItem(USER_SESSION_KEY);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  useEffect(() => {
    setIsLoggedIn(!(!isUserLoggedIn && !userEmail));
  }, [userEmail, isUserLoggedIn]);

  return {
    userEmail,
    isLoggedIn,
  };
}

export default useUserLoggedInDetails;
