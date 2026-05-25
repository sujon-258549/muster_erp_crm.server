export declare const SubscriptionServices: {
    createSubscription: (payload: any) => Promise<{
        name: string;
        isDeleted: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        price: string;
        duration: string;
        discount: string;
        isRecomended: boolean;
        featured: string[];
        activeDays: number;
    }>;
    getAllSubscription: (query: any) => Promise<{
        data: {
            name: string;
            isDeleted: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            description: string | null;
            slug: string;
            status: boolean;
            price: string;
            duration: string;
            discount: string;
            isRecomended: boolean;
            featured: string[];
            activeDays: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getSubscriptionById: (id: string) => Promise<{
        name: string;
        isDeleted: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        price: string;
        duration: string;
        discount: string;
        isRecomended: boolean;
        featured: string[];
        activeDays: number;
    }>;
    updateSubscription: (id: string, payload: any) => Promise<{
        name: string;
        isDeleted: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        price: string;
        duration: string;
        discount: string;
        isRecomended: boolean;
        featured: string[];
        activeDays: number;
    }>;
    deleteSubscription: (id: string) => Promise<{
        message: string;
    }>;
    updateSubscriptionStatus: (id: string) => Promise<{
        name: string;
        isDeleted: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        description: string | null;
        slug: string;
        status: boolean;
        price: string;
        duration: string;
        discount: string;
        isRecomended: boolean;
        featured: string[];
        activeDays: number;
    }>;
};
//# sourceMappingURL=subscription.service.d.ts.map