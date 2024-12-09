import { Logout } from "@/app/(public)/(auth)/logout/logout";
import { Suspense } from "react";

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  );
}
