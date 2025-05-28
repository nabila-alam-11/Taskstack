import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch(url, {
        headers: headers,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    };
    fetchData().catch((err) => setError(err.message));
  }, [url]);
  return { data, error, loading };
};
export default useFetch;
