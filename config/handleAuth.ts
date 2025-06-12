import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export const useAuth = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const { signIn } = useAuthActions();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { redirectTo: "/" });
    } catch (error) {
      void error;
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setGithubLoading(true);
    try {
      await signIn("github", { redirectTo: "/" });
    } catch (error) {
      void error;
    } finally {
      setGithubLoading(false);
    }
  };
};
