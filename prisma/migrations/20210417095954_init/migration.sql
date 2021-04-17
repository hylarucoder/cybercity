-- CreateEnum
CREATE TYPE "UserSex" AS ENUM ('MAN', 'WOMAN', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EnumSysMenuType" AS ENUM ('MENU', 'GROUP', 'BUTTON', 'LINK', 'CUSTOM');

-- CreateTable
CREATE TABLE "Province" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "provinceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "County" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" INTEGER,
    "invitedByUserId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "sex" "UserSex" NOT NULL DEFAULT E'UNKNOWN',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysOption" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT E'',
    "serial" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysMenu" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EnumSysMenuType" NOT NULL DEFAULT E'MENU',
    "serial" INTEGER NOT NULL DEFAULT 100,
    "parentId" BIGINT NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysDept" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" BIGINT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysUser" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT,
    "passwordHashed" TEXT,
    "salt" TEXT,
    "realname" TEXT,
    "sex" "UserSex" DEFAULT E'UNKNOWN',
    "avatar" TEXT,
    "birthday" TIMESTAMP(3),
    "email" TEXT,
    "isDenied" BOOLEAN NOT NULL DEFAULT false,
    "deptId" BIGINT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysRole" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysUserRole" (
    "name" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "roleId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "SysPermission" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysRolePermission" (
    "id" BIGSERIAL NOT NULL,
    "roleId" BIGINT NOT NULL,
    "permissionId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SysRoleMenu" (
    "id" BIGSERIAL NOT NULL,
    "roleId" BIGINT NOT NULL,
    "menuId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.name_unique" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_unique" ON "User"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SysMenu.name_unique" ON "SysMenu"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SysDept.name_unique" ON "SysDept"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SysUser.name_unique" ON "SysUser"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SysUser.mobile_unique" ON "SysUser"("mobile");

-- AddForeignKey
ALTER TABLE "City" ADD FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "County" ADD FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "County" ADD FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SysMenu" ADD FOREIGN KEY ("parentId") REFERENCES "SysMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SysDept" ADD FOREIGN KEY ("parentId") REFERENCES "SysDept"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SysUser" ADD FOREIGN KEY ("deptId") REFERENCES "SysDept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SysUserRole" ADD FOREIGN KEY ("userId") REFERENCES "SysUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SysUserRole" ADD FOREIGN KEY ("roleId") REFERENCES "SysRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SysRolePermission" ADD FOREIGN KEY ("roleId") REFERENCES "SysRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SysRolePermission" ADD FOREIGN KEY ("permissionId") REFERENCES "SysPermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SysRoleMenu" ADD FOREIGN KEY ("roleId") REFERENCES "SysRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SysRoleMenu" ADD FOREIGN KEY ("menuId") REFERENCES "SysMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
