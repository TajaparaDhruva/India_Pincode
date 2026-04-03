import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

// ---- Filter Endpoints ----
export const getStates = () => API.get("/states").then((r) => r.data);

export const getDistricts = (state) =>
  API.get(`/states/${encodeURIComponent(state)}/districts`).then((r) => r.data);

export const getTaluks = (state, district) =>
  API.get(
    `/states/${encodeURIComponent(state)}/districts/${encodeURIComponent(
      district
    )}/taluks`
  ).then((r) => r.data);

// ---- Data Endpoints ----
export const getPincodes = (params = {}) =>
  API.get("/pincodes", { params }).then((r) => r.data);

export const searchPincodes = (query) =>
  API.get("/search", { params: { q: query } }).then((r) => r.data);

export const getPincodeDetail = (pincode) =>
  API.get(`/pincode/${pincode}`).then((r) => r.data);

// ---- Stats Endpoints ----
export const getStats = () => API.get("/stats").then((r) => r.data);

export const getStateDistribution = () =>
  API.get("/stats/state-distribution").then((r) => r.data);

export const getDeliveryDistribution = () =>
  API.get("/stats/delivery-distribution").then((r) => r.data);

// ---- Export ----
export const exportData = (params = {}) =>
  API.get("/export", { params, responseType: "blob" }).then((r) => {
    const url = window.URL.createObjectURL(new Blob([r.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pincode_data.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  });

export default API;
