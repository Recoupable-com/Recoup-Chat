"use client";

import { usePrivy } from "@privy-io/react-auth";

export const useAuthenticatedFetch = () => {
  const { getAccessToken } = usePrivy();

  const authenticatedFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const token = await getAccessToken();
    return fetch(input, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return { authenticatedFetch };
};


