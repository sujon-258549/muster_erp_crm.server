import prisma from "../app/utils/prismaClient.ts";
import { seedSuperAdmin } from "../app/modules/supperAdmin/supper_admin.ts";

const run = async () => {
  await seedSuperAdmin();
  await prisma.$disconnect();
  process.exit(0);
};

run().catch(async (error) => {
  console.error("❌ Failed to create Super Admin:", error);
  await prisma.$disconnect();
  process.exit(1);
});
