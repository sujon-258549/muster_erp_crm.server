export declare const UserServices: {
    createUserIntoDB: (payload: any) => Promise<any>;
    getUserById: (id: string) => Promise<({
        role: {
            role: string;
            id: string;
        } | null;
        department: {
            name: string;
            id: string;
        } | null;
        profile: ({
            profilePhoto: {
                url: string;
                id: string;
            } | null;
            nidPhotos: {
                url: string;
                id: string;
            }[];
        } & {
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
        }) | null;
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        } | null;
        workInfo: ({
            subCategories: {
                name: string;
                id: string;
            }[];
            workTypes: {
                name: string;
                id: string;
            }[];
        } & {
            mobile: string;
            isBlocked: boolean;
            isDeleted: boolean;
            workType: string | null;
            id: string;
            passwordChangeTime: Date | null;
            passwordChanged: boolean;
            experience: string | null;
            workStartTime: string | null;
            workTimeLimit: string | null;
            availableTime: string | null;
            verified: boolean;
        }) | null;
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
    }) | {
        password: undefined;
        role: {
            role: string;
            id: string;
        } | null;
        department: {
            name: string;
            id: string;
        } | null;
        profile: ({
            profilePhoto: {
                url: string;
                id: string;
            } | null;
            nidPhotos: {
                url: string;
                id: string;
            }[];
        } & {
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
        }) | null;
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        } | null;
        workInfo: ({
            subCategories: {
                name: string;
                id: string;
            }[];
            workTypes: {
                name: string;
                id: string;
            }[];
        } & {
            mobile: string;
            isBlocked: boolean;
            isDeleted: boolean;
            workType: string | null;
            id: string;
            passwordChangeTime: Date | null;
            passwordChanged: boolean;
            experience: string | null;
            workStartTime: string | null;
            workTimeLimit: string | null;
            availableTime: string | null;
            verified: boolean;
        }) | null;
        email: string;
        mobile: string;
        isBlocked: boolean;
        isDeleted: boolean;
        isVerified: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        roleId: string | null;
        passwordChangeTime: Date | null;
        passwordChanged: boolean;
        lastLogin: Date | null;
        subscriptionId: string | null;
        departmentId: string | null;
        loginCount: number;
        loginTryCount: number;
        loginTryTime: Date | null;
    } | null>;
    getAllUsers: (query: any) => Promise<{
        data: {
            role: {
                role: string;
                id: string;
            } | null;
            department: {
                name: string;
                id: string;
            } | null;
            profile: ({
                profilePhoto: {
                    url: string;
                    id: string;
                } | null;
                nidPhotos: {
                    url: string;
                    id: string;
                }[];
            } & {
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
            }) | null;
            address: {
                mobile: string;
                address: string | null;
                id: string;
                division: string | null;
                district: string | null;
                upazila: string | null;
            } | null;
            workInfo: ({
                subCategories: {
                    name: string;
                    id: string;
                }[];
                workTypes: {
                    name: string;
                    id: string;
                }[];
            } & {
                mobile: string;
                isBlocked: boolean;
                isDeleted: boolean;
                workType: string | null;
                id: string;
                passwordChangeTime: Date | null;
                passwordChanged: boolean;
                experience: string | null;
                workStartTime: string | null;
                workTimeLimit: string | null;
                availableTime: string | null;
                verified: boolean;
            }) | null;
            email: string;
            mobile: string;
            isBlocked: boolean;
            isDeleted: boolean;
            isVerified: boolean;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            roleId: string | null;
            passwordChangeTime: Date | null;
            passwordChanged: boolean;
            lastLogin: Date | null;
            subscriptionId: string | null;
            departmentId: string | null;
            loginCount: number;
            loginTryCount: number;
            loginTryTime: Date | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    updateUser: (id: string, payload: any) => Promise<{
        role: {
            role: string;
            id: string;
        } | null;
        department: {
            name: string;
            id: string;
        } | null;
        profile: ({
            profilePhoto: {
                url: string;
                id: string;
            } | null;
            nidPhotos: {
                url: string;
                id: string;
            }[];
        } & {
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
        }) | null;
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        } | null;
        workInfo: ({
            subCategories: {
                name: string;
                id: string;
            }[];
            workTypes: {
                name: string;
                id: string;
            }[];
        } & {
            mobile: string;
            isBlocked: boolean;
            isDeleted: boolean;
            workType: string | null;
            id: string;
            passwordChangeTime: Date | null;
            passwordChanged: boolean;
            experience: string | null;
            workStartTime: string | null;
            workTimeLimit: string | null;
            availableTime: string | null;
            verified: boolean;
        }) | null;
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
    }>;
    getMyData: (id: string) => Promise<({
        role: {
            role: string;
            id: string;
        } | null;
        department: {
            name: string;
            id: string;
        } | null;
        profile: ({
            profilePhoto: {
                url: string;
                id: string;
            } | null;
            nidPhotos: {
                url: string;
                id: string;
            }[];
        } & {
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
        }) | null;
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        } | null;
        workInfo: ({
            subCategories: {
                name: string;
                id: string;
            }[];
            workTypes: {
                name: string;
                id: string;
            }[];
        } & {
            mobile: string;
            isBlocked: boolean;
            isDeleted: boolean;
            workType: string | null;
            id: string;
            passwordChangeTime: Date | null;
            passwordChanged: boolean;
            experience: string | null;
            workStartTime: string | null;
            workTimeLimit: string | null;
            availableTime: string | null;
            verified: boolean;
        }) | null;
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
    }) | {
        password: undefined;
        role: {
            role: string;
            id: string;
        } | null;
        department: {
            name: string;
            id: string;
        } | null;
        profile: ({
            profilePhoto: {
                url: string;
                id: string;
            } | null;
            nidPhotos: {
                url: string;
                id: string;
            }[];
        } & {
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
        }) | null;
        address: {
            mobile: string;
            address: string | null;
            id: string;
            division: string | null;
            district: string | null;
            upazila: string | null;
        } | null;
        workInfo: ({
            subCategories: {
                name: string;
                id: string;
            }[];
            workTypes: {
                name: string;
                id: string;
            }[];
        } & {
            mobile: string;
            isBlocked: boolean;
            isDeleted: boolean;
            workType: string | null;
            id: string;
            passwordChangeTime: Date | null;
            passwordChanged: boolean;
            experience: string | null;
            workStartTime: string | null;
            workTimeLimit: string | null;
            availableTime: string | null;
            verified: boolean;
        }) | null;
        email: string;
        mobile: string;
        isBlocked: boolean;
        isDeleted: boolean;
        isVerified: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        roleId: string | null;
        passwordChangeTime: Date | null;
        passwordChanged: boolean;
        lastLogin: Date | null;
        subscriptionId: string | null;
        departmentId: string | null;
        loginCount: number;
        loginTryCount: number;
        loginTryTime: Date | null;
    }>;
    changePassword: (payload: {
        oldPassword: string;
        newPassword: string;
    }, id: string) => Promise<{
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
    varifyOtp: (email: string, otp: string) => Promise<{
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
    }>;
    deleteUser: (id: string) => Promise<never[]>;
    softDeleteUser: (id: string) => Promise<{
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
    }>;
    blockUser: (id: string) => Promise<{
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
    }>;
};
//# sourceMappingURL=user.services.d.ts.map