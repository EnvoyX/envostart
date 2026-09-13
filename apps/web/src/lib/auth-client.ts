import { createAuthClient } from "better-auth/react";
import { adminClient, customSessionClient } from "better-auth/client/plugins";
import { auth } from "./auth";
import { env } from "../env";
import { ac, user, USER, admin, ADMIN, SUPERADMIN } from "./permission";
export const authClient = createAuthClient({
  baseURL: env.VITE_BASE_URL,
  plugins: [
    adminClient({
      adminRoles: ["admin", "ADMIN", "SUPERADMIN"],
      defaultRole: "USER",
      ac,
      roles: {
        user,
        USER,
        admin,
        ADMIN,
        SUPERADMIN,
      },
    }),
    customSessionClient<typeof auth>(),
  ],
});
