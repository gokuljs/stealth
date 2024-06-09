import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { loginUser } from '@/apis/login';
import { useIsUserLoggedIn } from '@/store /useUserLoggedIn';
import { useNavigate } from 'react-router-dom';
import { USER_SESSION_KEY } from '@/lib/constant';
import { isValidEmail } from '@/lib/emailValidity';

function Login(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { update } = useIsUserLoggedIn();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function checkPasswordStrength(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 8 characters long.',
      });
      return false;
    }

    if (!hasUpperCase) {
      toast({
        title: 'Weak Password',
        description: 'Password must contain at least one uppercase letter (A-Z).',
      });
      return false;
    }

    if (!hasLowerCase) {
      toast({
        title: 'Weak Password',
        description: 'Password must contain at least one lowercase letter (a-z).',
      });
      return false;
    }

    if (!hasNumbers) {
      toast({
        title: 'Weak Password',
        description: 'Password must contain at least one number (0-9).',
      });
      return false;
    }

    if (!hasSpecialChars) {
      toast({
        title: 'Weak Password',
        description: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).',
      });
      return false;
    }

    return true;
  }

  const handleSignIn = async (): Promise<void> => {
    try {
      if (email.length === 0) {
        toast({
          title: 'Email is empty',
          description: 'Please Enter your email',
        });
        return;
      }
      if (!isValidEmail(email)) {
        toast({
          title: 'Email is not valid',
          description: 'Please Enter your valid email address',
        });
        return;
      }
      if (!checkPasswordStrength(password)) {
        return;
      }
      await loginUser(email, password);
      update(true);
      sessionStorage.setItem(USER_SESSION_KEY, email);
      navigate('/');
      window.location.reload();
    } catch (error) {
      update(false);
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-screen no repeat-0 flex items-center justify-center flex-col bg-custom-bg bg-cover bg-center">
      <h1 className="text-white text-4xl font-bold mb-4">Login</h1>
      <div
        className="border-white min-h-[200px] min-w-[600px] px-2 py-2 
       flex flex-col gap-4
      "
      >
        <Input placeholder="Enter Your email" type="email" className="text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <Input
            placeholder="Enter Your Password"
            type={showPassword ? 'text' : 'password'}
            className="text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="text-gray-600 absolute right-[-45px] top-[5px] cursor-pointer"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {!showPassword ? 'show' : 'hide'}
          </div>
        </div>
        <Button className="flex items-center gap-1" onClick={handleSignIn}>
          Sign In
        </Button>
        <div className="flex justify-center items-center">
          <p className="text-muted-foreground text-neutral-500">
            New user?{' '}
            <a href="/signUp" className="text-blue-600">
              Register
            </a>
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-zinc-950 rounded-lg text-white min-w-[600px]">
        <h3 className="text-lg font-semibold mb-2">Password must contain:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>At least 8 characters</li>
          <li>At least one uppercase letter (A-Z)</li>
          <li>At least one lowercase letter (a-z)</li>
          <li>At least one number (0-9)</li>
          <li>At least one special character (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
