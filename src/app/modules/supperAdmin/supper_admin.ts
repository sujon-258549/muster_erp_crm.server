import argon2 from "argon2";
import prisma from "../../utils/prismaClient.ts";

export const seedSuperAdmin = async () => {
  try {
    console.log("🚀 Starting Super Admin Seeding Process...");

    const superAdminEmail = "superadmin@erp.com";
    const superAdminPassword = "superadmin";
    const superAdminMobile = "01717171717";

    // 1. Ensure SUPER_ADMIN Role exists
    let superAdminRole = await prisma.allRole.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    if (!superAdminRole) {
      console.log("📝 Creating SUPER_ADMIN role...");
      superAdminRole = await prisma.allRole.create({
        data: {
          role: "SUPER_ADMIN",
          description: "System Overlord with full access",
          isActive: true,
        },
      });
    }

    // 2. Ensure a default Department exists (e.g., Administration)
    let adminDept = await prisma.department.findFirst({
      where: { name: "ADMINISTRATION" },
    });

    if (!adminDept) {
      console.log("📝 Creating ADMINISTRATION department...");
      adminDept = await prisma.department.create({
        data: {
          name: "ADMINISTRATION",
          description: "Root administrative department",
          isActive: true,
        },
      });
    }

    // 3. Check if Super Admin already exists (by id, email, or mobile)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: superAdminMobile },
          { email: superAdminEmail },
          { mobile: superAdminMobile },
        ],
      },
    });

    if (existingUser) {
      console.log("✅ Super Admin already exists. Skipping creation.");
      return;
    }

    // 4. Hash password
    const hashedPassword = await argon2.hash(superAdminPassword);

    // 5. Create Super Admin with all relations
    await prisma.user.create({
      data: {
        id: superAdminMobile, // Using mobile as ID as per your previous logic
        email: superAdminEmail,
        password: hashedPassword,
        mobile: superAdminMobile,
        roleId: superAdminRole.id,
        departmentId: adminDept.id,
        isActive: true,
        isVerified: true,
        passwordChanged: true,
        passwordChangeTime: new Date(),
        // Also create a basic profile for the super admin
        profile: {
          create: {
            name: "System Super Admin",
            gender: "MALE",
          },
        },
      },
    });

    console.log("✨ Super Admin and dependencies seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding Super Admin:", error);
  }
};
