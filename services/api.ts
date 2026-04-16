const BASE_URL = "http://192.168.221.66:3000";

export const fetchExperiments = async () => {
  const response = await fetch(`${BASE_URL}/api/experiments`);

  if (!response.ok) {
    throw new Error("Failed to fetch experiments");
  }

  return response.json();
};