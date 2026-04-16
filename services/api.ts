const BASE_URL = "http://192.168.221.66:3000";

export const api = {
  getExperiments: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/experiments`);
      const data = await res.json();

      console.log("Experiments API:", data);

      return data;
    } catch (error) {
      console.log("GET experiments error:", error);
      throw error;
    }
  },

  createExperiment: async (data: any) => {
    try {
      const res = await fetch(`${BASE_URL}/api/experiments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      console.log("Create API:", result);

      return result;
    } catch (error) {
      console.log("Create error:", error);
      throw error;
    }
  },

  askAI: async (message: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          experiment: {},
          history: [],
        }),
      });

      const data = await res.json();

      console.log("AI API:", data);

      return data;
    } catch (error) {
      console.log("AI error:", error);
      throw error;
    }
  },
};