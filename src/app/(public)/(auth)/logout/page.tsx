"use client";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");

  console.log(refreshTokenFromUrl, "ref");
  console.log(accessTokenFromUrl, "acc");
  const a = getAccessTokenFromLocalStorage();
  console.log(a);

  const ref = useRef<any>(null);

  useEffect(() => {
    const idTimer = setTimeout(() => {
      if (
        (refreshTokenFromUrl &&
          refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl &&
          accessTokenFromUrl === getAccessTokenFromLocalStorage())
      ) {
        // Xử lý call api logout
        mutateAsync().then(() => {
          router.push("/login");
        });
      }
    }, 200);

    return () => {
      clearTimeout(idTimer);
    };
  }, [accessTokenFromUrl, mutateAsync, refreshTokenFromUrl, router]);
  return <div>Logout</div>;
}
