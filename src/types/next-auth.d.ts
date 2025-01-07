import type { JWT as DefaultJWT } from "next-auth/jwt";

import { users } from "@/drizzle/schema";

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: (typeof users.$inferSelect)["id"];
  }
}
