'use strict';
import express from 'express';
import home from './Routes/HomeRouter';

const app = express();
app.use(home);
const port = 4000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
