"use client";
import { toast } from "react-toastify";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({defaultOptions: {
  queries: {
    refetchOnWindowFocus: false, // disables refetching on tab switch
  },
},});

// Subscribe to the query cache to listen for errors
queryClient.getQueryCache().subscribe((event) => {
  // Check if the event has an error (for example, when a query fails)
  if (event?.query?.state?.error) {
    const error = event.query.state.error;
    // Check for a 401 status in the error response
    if (error) {
      // If it's a 401 error, show a toast and redirect
      if (error?.response?.status === 401) {
        // window.location.href = "/login";
        localStorage.removeItem("isAuthenicated")
        localStorage.removeItem("firstName")
        localStorage.removeItem("lastName")
        toast.error("Session expired. You will redirect to login page in 5 seconds", { toastId: "session-expired" });
        const timer = setTimeout(() => {
          window.location.href = "/login";
        }, 5000);

        // Optionally, in a useEffect cleanup:
        return () => clearTimeout(timer);
      }
    }
  }
});

type StoreProps = {
  children: React.ReactNode;
};

export default function Store({ children }: StoreProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
