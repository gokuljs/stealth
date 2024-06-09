import passport from 'passport';
export const login = (req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).json({ message: 'Authentication failed', info });
        req.logIn(user, (err) => {
            if (err)
                return next(err);
            return res.json({ message: 'Login successful' });
        });
    })(req, res, next);
};
