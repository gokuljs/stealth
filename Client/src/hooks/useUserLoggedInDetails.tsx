import { USER_SESSION_KEY } from '@/lib/constant';

interface returnTypeProps {
  userEmail: string | null;
  isLoggedIn: boolean;
}

function useUserLoggedInDetails(): returnTypeProps {
  const userEmail = sessionStorage.getItem(USER_SESSION_KEY);

  return {
    userEmail,
    isLoggedIn: !!userEmail,
  };
}

export default useUserLoggedInDetails;
