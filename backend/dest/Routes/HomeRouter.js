import { Router } from 'express';
const home = Router();
home.get('/', (req, res) => {
  res.send('Home');
});
export default home;
