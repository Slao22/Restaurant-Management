"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "@/components/refresh-token";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken></RefreshToken>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
