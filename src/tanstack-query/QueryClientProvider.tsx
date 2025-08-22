import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

export function TanStackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
