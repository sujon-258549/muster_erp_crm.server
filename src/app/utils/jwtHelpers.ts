import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";
const generateToken = (
  payload: any,
  secret: Secret,
  expiresIn: string
) => {
  //@ts-expect-error signing with secret key
  const token = jwt.sign(
    {
      data: payload,
    },
    secret,
    { expiresIn }
  );
  return token;
};

const verifyToken = (token: string, secret: Secret): any => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const JwtHelpers = {
  generateToken,
  verifyToken,
};