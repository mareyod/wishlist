import dotenv from 'dotenv';

import express, { type Express } from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';

import errorMiddleware from './middlewares/error-middleware';

import wishesRouter from './routes/wishes';
import authRouter from './routes/auth';
import friendsRouter from './routes/friends';
import groupsRouter from './routes/groups';
import reservationsRouter from './routes/reservations';

dotenv.config();

const PORT: number = Number(process.env.PORT ?? 5000);

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      origin: process.env.CORS,
      credentials: true
    })
);

app.use( '/api/wishes', wishesRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/friends', friendsRouter);
app.use('/api/groups', groupsRouter);
app.use('/uploads', express.static('uploads'));

app.use(errorMiddleware);

async function start(): Promise<void> {
    try {
        app.listen(
            PORT,
            (): void => {
                console.log(
                    `Server started on PORT = ${PORT}`
                );
            }
        );

    } catch (error: unknown) {
        console.error(error);
    }
}

void start();