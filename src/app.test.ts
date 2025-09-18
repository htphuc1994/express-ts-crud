import request from 'supertest';
import {Router} from 'express';
import app from './app';

jest.mock('./routes/resources', () => {
    const router = Router();
    router.get('/', (_req, res) => res.json([{id: 1, name: 'Test Resource'}]));
    return router;
});

describe('App', () => {
    it('should return 200 for the health check endpoint', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ok: true});
    });

    it('should use the resource router for /api/resources', async () => {
        const response = await request(app).get('/api/resources');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{id: 1, name: 'Test Resource'}]);
    });

    it('should handle unknown routes with a 404 error', async () => {
        const response = await request(app).get('/unknown');
        expect(response.status).toBe(404);
    });
});