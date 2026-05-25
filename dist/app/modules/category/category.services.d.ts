export declare const CategoryServices: {
    createCategoryIntoDB: (payload: any) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
    }>;
    getAllCategory: (query: any) => Promise<{
        data: ({
            subCategories: {
                name: string;
                id: string;
                slug: string;
                icon: string | null;
            }[];
        } & {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            slug: string;
            status: boolean;
            icon: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getCategoryById: (id: string) => Promise<({
        subCategories: {
            name: string;
            id: string;
            slug: string;
            icon: string | null;
        }[];
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
    }) | null>;
    updateCategory: (id: string, payload: any) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
    }>;
    deleteCategory: (id: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
    }>;
    updateCategoryStatus: (id: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        icon: string | null;
    }>;
};
//# sourceMappingURL=category.services.d.ts.map