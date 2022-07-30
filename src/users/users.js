import express from 'express';

const userRouter = express.Router();

userRouter.get('/hello', (res, req) => {
  req.send('Hello');
});

export { userRouter };
