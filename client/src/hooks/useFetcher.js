import { useState } from "react";

const API_BASE_URL = "http://localhost:5000/api"; // change if backend hosted elsewhere

export function useFetcher(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (method = "GET", body = null) => {
    setLoading(true);
    setError(null);

    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (body) options.body = JSON.stringify(body);

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to fetch");

      setData(result);
      return result;
    } catch (err) {
      console.error(err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}
