import { RefreshToken } from "@/app/(public)/(auth)/refresh-token/refreshToken";
import { Suspense } from "react";

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  );
}
