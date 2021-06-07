import { PrismaClient } from "@prisma/client";
import { citiesWithProvinceId, provinces } from "./fixture/resources";
import { hashPassword } from "../src/utils/crypto";

const prisma = new PrismaClient();

async function initCities() {
  for (const province of provinces) {
    await prisma.province.create({
      data: {
        id: parseInt(province.id),
        code: province.id,
        name: province.name,
      },
    });
  }

  for (const [provinceId, cities] of Object.entries(citiesWithProvinceId)) {
    for (const city of cities) {
      await prisma.city.create({
        data: {
          id: parseInt(city.id),
          code: city.id,
          name: city.name,
          provinceId: parseInt(provinceId),
        },
      });
    }
  }
}

async function initAdminAccount() {
  await prisma.sysUser.create({
    data: {
      name: "admin",
      mobile: "1822222222",
      isAdmin: true,
      passwordHashed: await hashPassword("admin123456"),
    },
  });
}

async function main() {
  await initCities();
  await initAdminAccount();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
