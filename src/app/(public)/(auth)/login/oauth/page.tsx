"use client";
import { useAppContext } from "@/components/app-provider";
import { toast } from "@/hooks/use-toast";
import { decodeToken } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function OAuthPage() {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const { setRole } = useAppContext();
  const router = useRouter();
  const count = useRef(0);
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");

  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role);
            router.push("/manage/dashboard");
          })
          .catch((e) => {
            toast({
              description: e.message || "có lỗi xảy ra",
            });
          });
        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast({
            description: message || "có lỗi xảy ra",
          });
        });

        count.current++;
      }
    }
  }, [accessToken, refreshToken, router, setRole, message, mutateAsync]);
  return null;
}
