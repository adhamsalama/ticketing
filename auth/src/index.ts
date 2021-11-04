import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signing';
import { signoutRouter } from './routes/singout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(errorHandler);


app.listen(3000, () => {
    console.log('Running at port 3000!!!');
})