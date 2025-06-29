import { useUserContext } from "@/components/providers";

export const useUser = () => {
  const { user } = useUserContext();

  return user;
};
