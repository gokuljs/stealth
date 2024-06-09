import { Button } from '@/components/ui/button';

function Login(): JSX.Element {
  return (
    <div className="h-screen w-screen no repeat-0 flex items-center justify-center bg-custom-bg bg-cover bg-center">
      <Button className="flex items-center gap-1">
        <img src="/google.svg" alt="google logo" className="h-4 w-4" />
        Sign in with Google
      </Button>
    </div>
  );
}

export default Login;
