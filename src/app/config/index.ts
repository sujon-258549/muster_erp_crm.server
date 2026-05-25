import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(
    process.cwd(),
    `.env.${process.env.NODE_ENV || "development"}`,
  ),
});

export default {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  saltRound: Number(process.env.SALT_ROUND) || 5,
  accessSecret: process.env.ACCESS_SECRET!,
  accessExpire: process.env.ACCESS_EXPIRE!,
  refreshSecret: process.env.REFRESH_SECRET!,
  refreshExpire: process.env.REFRESH_EXPIRE!,
  databaseUrl: process.env.DATABASE_URL!,
  ssl: {
    storeId: process.env.STORE_ID!,
    storePassword: process.env.STORE_PASSWORD!,
    storeName: process.env.STORE_NAME!,
    successUrl: process.env.SUCCESS_URL!,
    failUrl: process.env.FAIL_URL!,
    cancelUrl: process.env.CANCEL_URL!,
    ipnUrl: process.env.IPN_URL!,
    ssl_payment_url: process.env.SSL_PAYMENT_URL!,
    validate_api: process.env.VALIDATE_API!,
  },
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER!,
  },
};
