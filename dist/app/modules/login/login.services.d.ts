export declare const AuthServices: {
    loginUser: (payload: any) => Promise<{
        id: string;
        email: string;
        password: string;
        mobile: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
};
//# sourceMappingURL=login.services.d.ts.map