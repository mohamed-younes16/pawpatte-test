import { $Enums, PrismaClient } from "@prisma/client/edge";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prismadb;
}
export const animalsTypes = Object.values($Enums.Animal);
export default prismadb;
