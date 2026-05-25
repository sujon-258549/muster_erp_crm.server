// Prisma Client initialization
import { PrismaClient } from "../../generated/prisma/client.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(
    process.cwd(),
    `.env.${process.env.NODE_ENV || "development"}`,
  ),
});

if (!process.env.DATABASE_URL) {
  throw new Error(
    `DATABASE_URL is not set. Expected in .env.${process.env.NODE_ENV || "development"}`,
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
