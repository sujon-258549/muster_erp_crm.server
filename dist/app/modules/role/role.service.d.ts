export declare const RoleServices: {
    createRole: (payload: any) => Promise<{
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
    }>;
    getAllRole: (query: any) => Promise<{
        data: {
            role: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getRoleById: (id: string) => Promise<{
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
    }>;
    updateRole: (id: string, payload: any) => Promise<{
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
    }>;
    deleteRole: (id: string) => Promise<{
        message: string;
    }>;
    updateRoleStatus: (id: string) => Promise<{
        role: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
    }>;
};
//# sourceMappingURL=role.service.d.ts.map