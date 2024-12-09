import accountApiRequest from "@/apiRequest/account";
import { cookies } from "next/headers";
import React from "react";

export default async function DashBoard() {
  const cookiesStore = cookies();
  const accessToken = (await cookiesStore).get("accessToken")?.value!;
  let name = "";
  try {
    const result = await accountApiRequest.sMe(accessToken);
    name = result.payload.data.name;
  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }
  return <div>DashBoard {name}</div>;
}
