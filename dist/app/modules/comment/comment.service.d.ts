export declare const CommentServices: {
    createComment: (userId: string, payload: any) => Promise<{
        user: {
            profile: {
                name: string | null;
                mobile: string;
                id: string;
                gender: import("@prisma/client").$Enums.Gender | null;
                age: number | null;
                dob: Date | null;
                bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
                photoId: string | null;
                photo: string | null;
                nid: string | null;
                nidPhoto: string[];
                emailVerified: boolean;
                phoneVerified: boolean;
                nidVerified: boolean;
                serialId: string | null;
            } | null;
        } & {
            email: string;
            mobile: string;
            isBlocked: boolean;
            isDeleted: boolean;
            isVerified: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            password: string;
            roleId: string | null;
            passwordChangeTime: Date | null;
            passwordChanged: boolean;
            lastLogin: Date | null;
            subscriptionId: string | null;
            departmentId: string | null;
            loginCount: number;
            loginTryCount: number;
            loginTryTime: Date | null;
        };
    } & {
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        comment: string;
        id: string;
        userId: string;
        applicationId: string;
    }>;
    getAllComments: (query: any) => Promise<{
        data: ({
            user: {
                profile: {
                    name: string | null;
                    mobile: string;
                    id: string;
                    gender: import("@prisma/client").$Enums.Gender | null;
                    age: number | null;
                    dob: Date | null;
                    bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
                    photoId: string | null;
                    photo: string | null;
                    nid: string | null;
                    nidPhoto: string[];
                    emailVerified: boolean;
                    phoneVerified: boolean;
                    nidVerified: boolean;
                    serialId: string | null;
                } | null;
            } & {
                email: string;
                mobile: string;
                isBlocked: boolean;
                isDeleted: boolean;
                isVerified: boolean;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                id: string;
                password: string;
                roleId: string | null;
                passwordChangeTime: Date | null;
                passwordChanged: boolean;
                lastLogin: Date | null;
                subscriptionId: string | null;
                departmentId: string | null;
                loginCount: number;
                loginTryCount: number;
                loginTryTime: Date | null;
            };
        } & {
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            comment: string;
            id: string;
            userId: string;
            applicationId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getCommentById: (id: string) => Promise<{
        user: {
            profile: {
                name: string | null;
                mobile: string;
                id: string;
                gender: import("@prisma/client").$Enums.Gender | null;
                age: number | null;
                dob: Date | null;
                bloodGroup: import("@prisma/client").$Enums.BloodGroup | null;
                photoId: string | null;
                photo: string | null;
                nid: string | null;
                nidPhoto: string[];
                emailVerified: boolean;
                phoneVerified: boolean;
                nidVerified: boolean;
                serialId: string | null;
            } | null;
        } & {
            email: string;
            mobile: string;
            isBlocked: boolean;
            isDeleted: boolean;
            isVerified: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            password: string;
            roleId: string | null;
            passwordChangeTime: Date | null;
            passwordChanged: boolean;
            lastLogin: Date | null;
            subscriptionId: string | null;
            departmentId: string | null;
            loginCount: number;
            loginTryCount: number;
            loginTryTime: Date | null;
        };
    } & {
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        comment: string;
        id: string;
        userId: string;
        applicationId: string;
    }>;
    updateComment: (id: string, payload: any) => Promise<{
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        comment: string;
        id: string;
        userId: string;
        applicationId: string;
    }>;
    deleteComment: (id: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=comment.service.d.ts.map