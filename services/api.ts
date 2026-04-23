const BASE_URL = "http://192.168.221.66:3000";

const safeJson = async (res: Response) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  }
  return null;
};

let mockProfiles = [
  { id: '1', name: 'Munni', email: 'munni@student.csio.edu', role: 'Research Student', department: 'CSIO', project: 'ISTC Smart Lab' },
  { id: '2', name: 'Dr. Sharma', email: 'sharma@csio.res.in', role: 'Senior Scientist', department: 'ISTC', project: 'Smart Sensing' },
  { id: '3', name: 'Rahul', email: 'rahul@assistant.edu', role: 'Lab Assistant', department: 'CSIO', project: 'ISTC Smart Lab' }
];

let mockExperiments = [
  { id: "1", name: "Water Quality Analysis", description: "Measuring pH and turbidity.", status: "Ongoing" },
  { id: "2", name: "Soil Nutrient Test", description: "Analyzing NPK levels.", status: "Completed" },
  { id: "3", name: "Air Pollution Monitoring", description: "Tracking PM2.5 levels.", status: "Draft" }
];

export const api = {
  getExperiments: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/experiments`);
      const data = await safeJson(res);
      
      if (Array.isArray(data) && data.length > 0) {
        const serverIds = new Set(data.map(e => e.id));
        const localOnly = mockExperiments.filter(e => !serverIds.has(e.id));
        mockExperiments = [...data, ...localOnly];
      }
      return mockExperiments;
    } catch (error) {
      return mockExperiments;
    }
  },

  createExperiment: async (payload: any) => {
    try {
      const newId = Date.now().toString();
      const res = await fetch(`${BASE_URL}/api/experiments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: newId }),
      });
      const data = await safeJson(res);
      
      mockExperiments.push({ ...payload, id: newId, status: "Draft" });
      return data || { success: true, id: newId };
    } catch (error) {
      const newId = Date.now().toString();
      mockExperiments.push({ ...payload, id: newId, status: "Draft" });
      return { success: true, id: newId };
    }
  },

  deleteExperiment: async (id: string) => {
    try {
      await fetch(`${BASE_URL}/api/experiments/${id}`, { method: "DELETE" });
      mockExperiments = mockExperiments.filter(e => e.id !== id);
      return { success: true };
    } catch {
      mockExperiments = mockExperiments.filter(e => e.id !== id);
      return { success: true };
    }
  },

  getProfiles: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/profiles`);
      const data = await safeJson(res);
      if (data) mockProfiles = data;
      return mockProfiles;
    } catch (error) {
      return mockProfiles;
    }
  },

  getProfile: async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/profiles/${id}`);
      const data = await safeJson(res);
      return data || mockProfiles.find(p => p.id === id) || mockProfiles[0];
    } catch {
      return mockProfiles.find(p => p.id === id) || mockProfiles[0];
    }
  },

  updateProfile: async (id: string, payload: any) => {
    try {
      await fetch(`${BASE_URL}/api/profiles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const index = mockProfiles.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProfiles[index] = { ...mockProfiles[index], ...payload };
      }
      return { success: true };
    } catch (error) {
      const index = mockProfiles.findIndex(p => p.id === id);
      if (index !== -1) mockProfiles[index] = { ...mockProfiles[index], ...payload };
      return { success: true };
    }
  },

  addProfile: async (payload: any) => {
    try {
      const newId = Date.now().toString();
      await fetch(`${BASE_URL}/api/profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: newId }),
      });
      
      mockProfiles.push({ id: newId, ...payload });
      return { success: true, id: newId };
    } catch {
      const newId = Date.now().toString();
      mockProfiles.push({ id: newId, ...payload });
      return { success: true, id: newId };
    }
  },

  deleteProfile: async (id: string) => {
    try {
      await fetch(`${BASE_URL}/api/profiles/${id}`, { method: "DELETE" });
      mockProfiles = mockProfiles.filter(p => p.id !== id);
      return { success: true };
    } catch {
      mockProfiles = mockProfiles.filter(p => p.id !== id);
      return { success: true };
    }
  },

  askAI: async (payload: any) => {
    try {
      const body = typeof payload === 'string' ? { message: payload } : payload;
      const res = await fetch(`${BASE_URL}/api/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await safeJson(res);
      return data || { result: "No response from AI server" };
    } catch (error) {
      return { result: "AI connection failed. Ensure lab server is active." };
    }
  },
};