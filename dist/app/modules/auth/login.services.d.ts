export declare const AuthServices: {
    loginUser: (payload: any) => Promise<{
        accessToken: never;
        refreshToken: never;
        user: {
            id: string;
            email: string;
            mobile: string;
            name: string | null | undefined;
            photo: string | undefined;
            role: string | undefined;
            gender: import("@prisma/client").$Enums.Gender | null | undefined;
            bloodGroup: import("@prisma/client").$Enums.BloodGroup | null | undefined;
            age: number | null | undefined;
            designation: string | null | undefined;
            department: string | undefined;
            address: {
                mobile: string;
                address: string | null;
                id: string;
                division: string | null;
                district: string | null;
                upazila: string | null;
            } | null;
            workInfo: {
                subCategories: string[] | undefined;
                workTypes: string[] | undefined;
                mobile?: string;
                isBlocked?: boolean;
                isDeleted?: boolean;
                workType?: string | null;
                id?: string;
                passwordChangeTime?: Date | null;
                passwordChanged?: boolean;
                experience?: string | null;
                workStartTime?: string | null;
                workTimeLimit?: string | null;
                availableTime?: string | null;
                verified?: boolean;
            };
            isActive: true;
            isVerified: boolean;
            isBlocked: false;
            isDeleted: false;
        };
        isLogin: boolean;
    }>;
    refreshToken: (token: string) => Promise<{
        accessToken: never;
        user: {
            id: string;
            email: string;
            mobile: string;
            name: string | null | undefined;
            photo: string | undefined;
            role: string | undefined;
            gender: import("@prisma/client").$Enums.Gender | null | undefined;
            bloodGroup: import("@prisma/client").$Enums.BloodGroup | null | undefined;
            age: number | null | undefined;
            designation: string | null | undefined;
            department: string | undefined;
            address: {
                mobile: string;
                address: string | null;
                id: string;
                division: string | null;
                district: string | null;
                upazila: string | null;
            } | null;
            workInfo: {
                subCategories: string[] | undefined;
                workTypes: string[] | undefined;
                mobile?: string;
                isBlocked?: boolean;
                isDeleted?: boolean;
                workType?: string | null;
                id?: string;
                passwordChangeTime?: Date | null;
                passwordChanged?: boolean;
                experience?: string | null;
                workStartTime?: string | null;
                workTimeLimit?: string | null;
                availableTime?: string | null;
                verified?: boolean;
            };
            isActive: boolean;
            isVerified: boolean;
            isBlocked: boolean;
            isDeleted: boolean;
        };
    }>;
    forgotPassword: (payload: {
        email: string;
    }) => Promise<{
        message: string;
    }>;
    resetPassword: (email: string, password: string, otp: string) => Promise<{
        accessToken: never;
        refreshToken: never;
        user: {
            id: string;
            email: string;
            mobile: string;
            name: string | null | undefined;
            photo: string | undefined;
            role: string | undefined;
            gender: import("@prisma/client").$Enums.Gender | null | undefined;
            bloodGroup: import("@prisma/client").$Enums.BloodGroup | null | undefined;
            age: number | null | undefined;
            designation: string | null | undefined;
            department: string | undefined;
            address: {
                mobile: string;
                address: string | null;
                id: string;
                division: string | null;
                district: string | null;
                upazila: string | null;
            } | null;
            workInfo: {
                subCategories: string[] | undefined;
                workTypes: string[] | undefined;
                mobile?: string;
                isBlocked?: boolean;
                isDeleted?: boolean;
                workType?: string | null;
                id?: string;
                passwordChangeTime?: Date | null;
                passwordChanged?: boolean;
                experience?: string | null;
                workStartTime?: string | null;
                workTimeLimit?: string | null;
                availableTime?: string | null;
                verified?: boolean;
            };
            isActive: boolean;
            isVerified: boolean;
            isBlocked: boolean;
            isDeleted: boolean;
        };
        isLogin: boolean;
    }>;
};
//# sourceMappingURL=login.services.d.ts.map