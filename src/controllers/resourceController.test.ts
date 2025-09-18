import request from 'supertest';
import express, {Application} from 'express';
import * as controller from './resourceController';
import * as service from '../services/resourceService';

jest.mock('../services/resourceService');

const app: Application = express();
app.use(express.json());
app.post('/resources', controller.create);
app.get('/resources', controller.list);
app.get('/resources/:id', controller.getById);
app.put('/resources/:id', controller.update);
app.delete('/resources/:id', controller.remove);

describe('resourceController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new resource', async () => {
            const mockData = {name: 'Test', description: 'Test description', status: 'ACTIVE'};
            const mockResponse = {id: 1, ...mockData};
            (service.create as jest.Mock).mockResolvedValue(mockResponse);

            const response = await request(app).post('/resources').send(mockData);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockResponse);
            expect(service.create).toHaveBeenCalledWith(mockData);
        });
    });

    describe('list', () => {
        it('should return a list of resources', async () => {
            const mockParams = {q: 'Test', status: 'ACTIVE', page: 1, pageSize: 5};
            const mockResponse = {
                data: [{id: 1, name: 'Test', status: 'ACTIVE'}],
                pagination: {page: 1, pageSize: 5, total: 1, totalPages: 1},
            };
            (service.list as jest.Mock).mockResolvedValue(mockResponse);

            const response = await request(app).get('/resources').query(mockParams);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(service.list).toHaveBeenCalledWith({
                q: 'Test',
                status: 'ACTIVE',
                page: 1,
                pageSize: 5,
            });
        });
    });

    describe('getById', () => {
        it('should return a resource by ID', async () => {
            const mockResponse = {id: 1, name: 'Test'};
            (service.getById as jest.Mock).mockResolvedValue(mockResponse);

            const response = await request(app).get('/resources/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(service.getById).toHaveBeenCalledWith(1);
        });

        it('should return 404 if resource not found', async () => {
            (service.getById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/resources/1');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({error: 'Not Found'});
            expect(service.getById).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update a resource by ID', async () => {
            const mockData = {name: 'Updated'};
            const mockResponse = {id: 1, ...mockData};
            (service.update as jest.Mock).mockResolvedValue(mockResponse);

            const response = await request(app).put('/resources/1').send(mockData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResponse);
            expect(service.update).toHaveBeenCalledWith(1, mockData);
        });
    });

    describe('remove', () => {
        it('should delete a resource by ID', async () => {
            (service.remove as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app).delete('/resources/1');

            expect(response.status).toBe(204);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});