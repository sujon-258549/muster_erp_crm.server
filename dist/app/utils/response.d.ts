import type { Response } from "express";
declare const sendResponse: <T>(res: Response, jsonData: {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T | null | undefined;
    meta?: {
        page: number;
        limit: number;
        total: number;
    } | undefined;
}) => void;
export default sendResponse;
//# sourceMappingURL=response.d.ts.map