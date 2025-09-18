import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import resourceRouter from './routes/resources';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ok: true}));
app.use('/api/resources', resourceRouter);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({error: err.message || 'Internal Server Error'});
});

export default app;