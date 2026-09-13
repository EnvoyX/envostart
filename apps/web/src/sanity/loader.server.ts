import { env } from "@/env";
import { sanityClient } from "@/lib/sanity";
import { loadQuery, setServerClient } from "@sanity/react-loader";
const serverClient = sanityClient.withConfig({ token: env.SANITY_API_READ_TOKEN });
setServerClient(serverClient);
export { loadQuery };
