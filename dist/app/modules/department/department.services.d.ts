export declare const DepartmentServices: {
    createDepartmentIntoDB: (payload: any) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
    }>;
    getAllDepartment: (query: any) => Promise<{
        data: ({
            users: {
                email: string;
                mobile: string;
                id: string;
                roleId: string | null;
            }[];
        } & {
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getDepartmentById: (id: string) => Promise<({
        users: {
            email: string;
            mobile: string;
            id: string;
            roleId: string | null;
        }[];
    } & {
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
    }) | null>;
    updateDepartment: (id: string, payload: any) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
    }>;
    deleteDepartment: (id: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
    }>;
    updateDepartmentStatus: (id: string) => Promise<{
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
    }>;
};
//# sourceMappingURL=department.services.d.ts.map