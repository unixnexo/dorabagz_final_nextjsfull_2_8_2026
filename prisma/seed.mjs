// Run with: npm run prisma:seed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPhone = "09120000000";
  const admin = await prisma.user.upsert({
    where: { phoneNumber: adminPhone },
    update: { role: "ADMIN" },
    create: {
      phoneNumber: adminPhone,
      role: "ADMIN",
      fullName: "مدیر سیستم",
    },
  });

  console.log("✅ Admin user ready:", admin.phoneNumber);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
