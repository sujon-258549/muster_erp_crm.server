export declare const SubCategoryServices: {
    createSubCategory: (payload: any) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
    }>;
    getAllSubCategory: (query: any) => Promise<{
        data: ({
            category: {
                name: string;
                slug: string;
            };
        } & {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            slug: string;
            status: boolean;
            categoryId: string;
            icon: string | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getSubCategoryById: (id: string) => Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
    }>;
    getSubCategoryBySlug: (slug: string) => Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
    }>;
    updateSubCategory: (id: string, payload: any) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
    }>;
    deleteSubCategory: (id: string) => Promise<{
        message: string;
    }>;
    updateSubCategoryStatus: (id: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        categoryId: string;
        icon: string | null;
    }>;
};
//# sourceMappingURL=subCategory.service.d.ts.map