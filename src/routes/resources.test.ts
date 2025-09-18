import request from 'supertest';
import express, { Router } from 'express';
import * as controller from '../controllers/resourceController';
import resourceRouter from './resources';

jest.mock('../controllers/resourceController');

const app = express();
app.use(express.json());
app.use('/resources', resourceRouter);

describe('resources routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /resources', () => {
        it('should call the create controller', async () => {
            (controller.create as jest.Mock).mockImplementation((_req, res) => res.status(201).send());

            const response = await request(app).post('/resources').send({ name: 'Test' });

            expect(response.status).toBe(201);
            expect(controller.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /resources', () => {
        it('should call the list controller', async () => {
            (controller.list as jest.Mock).mockImplementation((_req, res) => res.status(200).send());

            const response = await request(app).get('/resources');

            expect(response.status).toBe(200);
            expect(controller.list).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /resources/:id', () => {
        it('should call the getById controller', async () => {
            (controller.getById as jest.Mock).mockImplementation((_req, res) => res.status(200).send());

            const response = await request(app).get('/resources/1');

            expect(response.status).toBe(200);
            expect(controller.getById).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /resources/:id', () => {
        it('should call the update controller', async () => {
            (controller.update as jest.Mock).mockImplementation((_req, res) => res.status(200).send());

            const response = await request(app).put('/resources/1').send({ name: 'Updated' });

            expect(response.status).toBe(200);
            expect(controller.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('DELETE /resources/:id', () => {
        it('should call the remove controller', async () => {
            (controller.remove as jest.Mock).mockImplementation((_req, res) => res.status(204).send());

            const response = await request(app).delete('/resources/1');

            expect(response.status).toBe(204);
            expect(controller.remove).toHaveBeenCalledTimes(1);
        });
    });
});