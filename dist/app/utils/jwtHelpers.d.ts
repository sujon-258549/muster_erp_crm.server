import { type Secret } from "jsonwebtoken";
export declare const JwtHelpers: {
    generateToken: (payload: any, secret: Secret, expiresIn: string) => never;
    verifyToken: (token: string, secret: Secret) => any;
};
//# sourceMappingURL=jwtHelpers.d.ts.map