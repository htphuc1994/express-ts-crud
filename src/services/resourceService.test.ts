import {PrismaClient} from '../../prisma/generated/prisma';
import * as service from './resourceService';
import {CreateDTO, Status} from './resourceService';

jest.mock('../../prisma/generated/prisma', () => {
    const mockPrisma = {
        item: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return {PrismaClient: jest.fn(() => mockPrisma)};
});

const prisma = new PrismaClient();

describe('resourceService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new item', async () => {
            const data: CreateDTO = {name: 'Test', description: 'Test description', status: 'ACTIVE'};
            const mockResponse = {id: 1, ...data};
            (prisma.item.create as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.create(data);

            expect(prisma.item.create).toHaveBeenCalledWith({data});
            expect(result).toEqual(mockResponse);
        });
    });

    describe('list', () => {
        it('should return paginated items and total count', async () => {
            const params = {q: 'Test', status: 'ACTIVE' as Status, page: 1, pageSize: 5};
            const mockItems = [{id: 1, name: 'Test', status: 'ACTIVE' as Status}];
            const mockCount = 1;

            (prisma.item.findMany as jest.Mock).mockResolvedValue(mockItems);
            (prisma.item.count as jest.Mock).mockResolvedValue(mockCount);

            const result = await service.list(params);

            expect(prisma.item.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [{name: {contains: 'Test'}}, {description: {contains: 'Test'}}],
                    status: 'ACTIVE',
                },
                orderBy: {id: 'desc'},
                skip: 0,
                take: 5,
            });
            expect(prisma.item.count).toHaveBeenCalledWith({
                where: {
                    OR: [{name: {contains: 'Test'}}, {description: {contains: 'Test'}}],
                    status: 'ACTIVE',
                },
            });
            expect(result).toEqual({
                data: mockItems,
                pagination: {page: 1, pageSize: 5, total: mockCount, totalPages: 1},
            });
        });
    });

    describe('getById', () => {
        it('should return an item by ID', async () => {
            const mockItem = {id: 1, name: 'Test'};
            (prisma.item.findUnique as jest.Mock).mockResolvedValue(mockItem);

            const result = await service.getById(1);

            expect(prisma.item.findUnique).toHaveBeenCalledWith({where: {id: 1}});
            expect(result).toEqual(mockItem);
        });
    });

    describe('update', () => {
        it('should update an item by ID', async () => {
            const id = 1;
            const data = {name: 'Updated'};
            const mockResponse = {id, ...data};
            (prisma.item.update as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.update(id, data);

            expect(prisma.item.update).toHaveBeenCalledWith({where: {id}, data});
            expect(result).toEqual(mockResponse);
        });
    });

    describe('remove', () => {
        it('should delete an item by ID', async () => {
            const id = 1;
            (prisma.item.delete as jest.Mock).mockResolvedValue({id});

            await service.remove(id);

            expect(prisma.item.delete).toHaveBeenCalledWith({where: {id}});
        });
    });
});