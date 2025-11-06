import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:5000";

// Initialize Socket.IO connection
export const socket = io(BACKEND_URL);

// Fetch all latest readings
export const fetchLatestData = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/latest`);
    if (!response.ok) throw new Error("Failed to fetch latest data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching latest data:", error);
    return null;
  }
};

// Fetch latest readings for a specific category
export const fetchLatestByCategory = async (category) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/latest/${category}`);
    if (!response.ok) throw new Error(`Failed to fetch ${category} data`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${category} data:`, error);
    return null;
  }
};

// Fetch historical readings for a category and building
export const fetchReadings = async (category, building, limit = 50) => {
  try {
    const url = `${BACKEND_URL}/api/readings/${category}/${building}?limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch readings for ${building}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching readings for ${building}:`, error);
    return [];
  }
};

// Setup real-time data listeners
export const setupSocketListeners = (onDataUpdate) => {
  socket.on("connect", () => {
    console.log("Connected to backend via Socket.IO");
  });

  socket.on("dataUpdate", (data) => {
    console.log("Received real-time update:", data);
    if (onDataUpdate) onDataUpdate(data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from backend");
  });

  return () => {
    socket.off("connect");
    socket.off("dataUpdate");
    socket.off("disconnect");
  };
};
