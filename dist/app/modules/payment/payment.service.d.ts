export declare const PaymentServices: {
    createPayment: (userId: string, id: string) => Promise<{
        paymentUrl: any;
        createPayment: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            subscriptionId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            userId: string;
            transactionId: string;
            amount: number;
            paymentMethod: string | null;
            paymentGatewayData: import("@prisma/client/runtime/client").JsonValue | null;
        };
    }>;
    getAllPayment: () => Promise<{
        data: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            subscriptionId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            userId: string;
            transactionId: string;
            amount: number;
            paymentMethod: string | null;
            paymentGatewayData: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
    }>;
    getPaymentById: (id: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        subscriptionId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        userId: string;
        transactionId: string;
        amount: number;
        paymentMethod: string | null;
        paymentGatewayData: import("@prisma/client/runtime/client").JsonValue | null;
    } | null>;
    updatePayment: (id: string, payload: any) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        subscriptionId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        userId: string;
        transactionId: string;
        amount: number;
        paymentMethod: string | null;
        paymentGatewayData: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    deletePayment: (id: string) => Promise<{
        message: string;
    }>;
    validatePayment: (payload: any) => Promise<{
        message: string;
        data: any;
    }>;
};
//# sourceMappingURL=payment.service.d.ts.map