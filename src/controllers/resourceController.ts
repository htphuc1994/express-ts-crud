import {NextFunction, Request, Response} from 'express';
import * as service from '../services/resourceService';
import {z} from 'zod';

const CreateSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

const UpdateSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const data = CreateSchema.parse(req.body);
        const item = await service.create(data);
        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
}

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const {q, status, page = '1', pageSize = '10'} = req.query as Record<string, string>;
        const result = await service.list({
            q, status: status as any, page: parseInt(page, 10), pageSize: parseInt(pageSize, 10),
        });
        res.json(result);
    } catch (err) {
        next(err);
    }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const item = await service.getById(id);
        if (!item) return res.status(404).json({error: 'Not Found'});
        res.json(item);
    } catch (err) {
        next(err);
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        const data = UpdateSchema.parse(req.body);
        const item = await service.update(id, data);
        res.json(item);
    } catch (err) {
        next(err);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        await service.remove(id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}