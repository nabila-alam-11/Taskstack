import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
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
    };
    fetchData().catch((err) => setError(err.message));
  }, [url]);
  return { data, error };
};
export default useFetch;
