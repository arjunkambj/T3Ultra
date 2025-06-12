"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Divider } from "@heroui/divider";

export default function LoginModel({
  isOpen,
  onOpenChange,
  onOpen,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen: () => void;
}) {
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

  return (
    <>
      <Button
        className="justify-start text-default-800"
        variant="light"
        startContent={<Icon icon="solar:login-line-duotone" width={24} />}
        onPress={onOpen}
      >
        Login
      </Button>
      <Modal
        isOpen={isOpen}
        backdrop="blur"
        className="max-w-sm shadow-none"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-8">
                <div className="relative flex flex-col items-center space-y-3 text-center">
                  <div>
                    <h2 className="text-3xl font-semibold text-white">
                      Welcome back!
                    </h2>
                  </div>

                  <div className="text-center">
                    <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
                      Sign in to access your AI-powered workspace and continue
                      where you left off.
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Button
                    className="text-md bg-neutral-100 text-neutral-950 shadow-lg transition-all duration-200 hover:bg-neutral-200"
                    isLoading={googleLoading}
                    radius="full"
                    size="md"
                    startContent={
                      <Icon icon="flat-color-icons:google" width={22} />
                    }
                    variant="solid"
                    onPress={handleGoogleSignIn}
                  >
                    Continue with Google
                  </Button>

                  <Button
                    className="border border-default-300 bg-neutral-800 text-white shadow-lg transition-all duration-200 hover:bg-neutral-700"
                    isLoading={githubLoading}
                    radius="full"
                    size="md"
                    startContent={
                      <Icon
                        className="text-white"
                        icon="fe:github"
                        width={22}
                      />
                    }
                    variant="solid"
                    onPress={handleGithubSignIn}
                  >
                    Continue with Github
                  </Button>
                </div>
                <Divider className="mt-5" />
              </ModalBody>
              <ModalFooter>
                <div className="px-6 pb-8">
                  <div className="flex flex-col gap-3">
                    <p className="text-center text-xs leading-relaxed text-neutral-500">
                      By continuing, you agree to our{" "}
                      <Link
                        className="text-xs text-blue-400 underline hover:text-blue-300"
                        href="#"
                        size="sm"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        className="text-xs text-blue-400 underline hover:text-blue-300"
                        href="#"
                        size="sm"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
