const BASE_URL = "http://192.168.221.66:3000";

export const api = {
  getExperiments: async () => {
    try {
      console.log("Fetching experiments...");

      const res = await fetch(`${BASE_URL}/api/experiments`);

      const data = await res.json();

      console.log("Experiments API Response:", data);

      // return only array
      return data?.data || [];
    } catch (error) {
      console.log("API ERROR:", error);
      return [];
    }
  },

  createExperiment: async (payload: any) => {
    try {
      const res = await fetch(`${BASE_URL}/api/experiments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return await res.json();
    } catch (error) {
      console.log("Create API ERROR:", error);
      return { error: true };
    }
  },

  askAI: async (message: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      return await res.json();
    } catch (error) {
      console.log("AI API ERROR:", error);
      return { result: "Error connecting to AI backend" };
    }
  },
};