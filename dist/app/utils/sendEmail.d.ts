export declare const otpEmailTemplate: (data: {
    name?: string;
    otp: number;
}) => string;
export declare const sendEmail: (to: string, html: string, subject?: string) => Promise<import("nodemailer/lib/smtp-transport/index.js").SentMessageInfo>;
//# sourceMappingURL=sendEmail.d.ts.map