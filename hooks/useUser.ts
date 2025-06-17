import { useQuery } from "convex-helpers/react/cache/hooks";

import { api } from "@/convex/_generated/api";

export const useUser = () => {
  const user = useQuery(api.function.users.currentUser);

  return user;
};
