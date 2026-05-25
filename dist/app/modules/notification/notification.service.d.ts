export declare const NotificationServices: {
    createNotification: (payload: any) => Promise<{
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        type: string;
        userId: string;
        message: string;
        jobId: string | null;
        isRead: boolean;
        applicationId: string | null;
    }>;
    getAllNotifications: (query: any) => Promise<{
        data: {
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            type: string;
            userId: string;
            message: string;
            jobId: string | null;
            isRead: boolean;
            applicationId: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getNotificationById: (id: string) => Promise<{
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        type: string;
        userId: string;
        message: string;
        jobId: string | null;
        isRead: boolean;
        applicationId: string | null;
    }>;
    updateNotification: (id: string, payload: any) => Promise<{
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        type: string;
        userId: string;
        message: string;
        jobId: string | null;
        isRead: boolean;
        applicationId: string | null;
    }>;
    deleteNotification: (id: string) => Promise<{
        message: string;
    }>;
    markAsRead: (userId: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=notification.service.d.ts.map