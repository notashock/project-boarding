// src/hooks/useFetcher.js
import { useCallback } from "react";

export default function useFetcher() {
  const fetcher = useCallback(async (endpoint, options = {}) => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${baseUrl}${endpoint}`, options);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Request failed");
    }
    return await res.json();
  }, []);

  return fetcher;
}
