import {PrismaClient} from '../../prisma/generated/prisma';

const prisma = new PrismaClient();

export type Status = 'ACTIVE' | 'INACTIVE';

export type CreateDTO = { name: string; description?: string; status?: Status; };
export type UpdateDTO = Partial<CreateDTO>;

export async function create(data: CreateDTO) {
    return prisma.item.create({data});
}

export async function list(params: { q?: string; status?: Status; page: number; pageSize: number; }) {
    const {q, status, page, pageSize} = params;
    const filters: any = {};
    if (q) {
        filters.OR = [
            {name: {contains: q}},
            {description: {contains: q}},
        ];
    }
    if (status) {
        filters.status = status; // 'ACTIVE' | 'INACTIVE' (string if you used Option A earlier)
    }

    const [items, total] = await Promise.all([
        prisma.item.findMany({
            where: filters,
            orderBy: {id: 'desc'},
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.item.count({where: filters}),
    ]);

    return {data: items, pagination: {page, pageSize, total, totalPages: Math.ceil(total / pageSize)}};
}

export async function getById(id: number) {
    return prisma.item.findUnique({where: {id}});
}

export async function update(id: number, data: UpdateDTO) {
    return prisma.item.update({where: {id}, data});
}

export async function remove(id: number) {
    await prisma.item.delete({where: {id}});
}