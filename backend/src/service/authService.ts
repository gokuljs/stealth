import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

interface AuthInfo {
  message?: string;
}

export const login = (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.authenticate('local', (err: Error, user: any, info: AuthInfo) => {
    console.log({ err });
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Authentication failed', info });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful' });
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error) => {
    if (err) {
      return next(err);
    }
    res.json({ message: 'Logout successful' });
  });
};
