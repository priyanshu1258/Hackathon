// server.js - Combined Server + Data Generator
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const admin = require("firebase-admin");
const path = require("path");

const app = express();
const server = http.createServer(app);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Load service account from env with error handling
let serviceAccount;
try {
  const serviceAccountPath = path.resolve(process.env.FIREBASE_KEY_PATH);
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error(
    "❌ Failed to load service account key. Check FIREBASE_KEY_PATH.",
    error
  );
  process.exit(1);
}

// ✅ Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = admin.database();

// ==================== DATA GENERATION LOGIC ====================

// Buildings and categories
const buildings = ["Hostel-A", "Library", "Cafeteria", "Labs"];
const categories = ["electricity", "water", "food"];

// 🕒 Format HH:MM
function formatTime(ts) {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

// 📊 Generate fake data per category/building
function generateReading(category, building, ts) {
  let base,
    unit,
    value,
    meta = {};

  switch (category) {
    case "electricity":
      base = building.includes("Hostel")
        ? 120
        : building.includes("Cafeteria")
        ? 200
        : 80;
      value = +(base + (Math.random() - 0.5) * base * 0.3).toFixed(2);
      unit = "kWh";
      break;

    case "water":
      base = building.includes("Hostel")
        ? 2500
        : building.includes("Cafeteria")
        ? 4000
        : 600;
      value = Math.round(base + (Math.random() - 0.5) * base * 0.25);
      unit = "L";
      break;

    case "food":
      base = building.includes("Cafeteria")
        ? 10
        : building.includes("Hostel")
        ? 2
        : 0.5;
      value = +(base + (Math.random() - 0.5) * base * 0.8).toFixed(2);
      unit = "kg";
      meta = building.includes("Cafeteria")
        ? { mealsServed: Math.round(100 + Math.random() * 200) }
        : {};
      break;
  }

  return { building, ts, time: formatTime(ts), value, unit, meta };
}

// 🧩 Push reading to Firebase
async function pushReading(category, building, record) {
  const ref = db.ref(`readings/${category}/${building}`);
  await ref.push(record);

  // Update latest snapshot
  await db.ref(`latest/${category}/${building}`).set({
    ts: record.ts,
    time: record.time,
    value: record.value,
    unit: record.unit,
  });

  console.log(`✅ Added ${category}/${building}`, record);
}

// 🌀 Simulate fake data
async function simulate() {
  const ts = Date.now();
  for (const category of categories) {
    for (const building of buildings) {
      const record = generateReading(category, building, ts);
      await pushReading(category, building, record);
    }
  }
}

// ==================== SERVER & API LOGIC ====================

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // For development - restrict in production
    methods: ["GET", "POST"],
  },
});

// 🔌 Socket.IO connection
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Listen for new readings and broadcast to all clients
  const categoriesRef = db.ref("readings");
  categoriesRef.on("child_changed", (snapshot) => {
    socket.emit("dataUpdate", {
      category: snapshot.key,
      data: snapshot.val(),
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// 📊 API Routes

// Get all latest readings
app.get("/api/latest", async (req, res) => {
  try {
    const snapshot = await db.ref("latest").once("value");
    res.json(snapshot.val() || {});
  } catch (error) {
    console.error("Error fetching latest data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get latest readings by category
app.get("/api/latest/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const snapshot = await db.ref(`latest/${category}`).once("value");
    res.json(snapshot.val() || {});
  } catch (error) {
    console.error("Error fetching category data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Get historical readings
app.get("/api/readings/:category/:building", async (req, res) => {
  try {
    const { category, building } = req.params;
    const { limit = 50 } = req.query;

    const snapshot = await db
      .ref(`readings/${category}/${building}`)
      .limitToLast(parseInt(limit))
      .once("value");

    const data = [];
    snapshot.forEach((child) => {
      data.push({ id: child.key, ...child.val() });
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching readings:", error);
    res.status(500).json({ error: "Failed to fetch readings" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Hackathon Backend API",
    endpoints: {
      latest: "/api/latest",
      latestByCategory: "/api/latest/:category",
      readings: "/api/readings/:category/:building?limit=50",
      health: "/api/health",
    },
  });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO enabled`);
  console.log(`🔥 Firebase connected to: ${process.env.FIREBASE_DB_URL}`);
});

// 🔥 Test Firebase connection and start data generation
db.ref("/test")
  .set({ message: "Server connected ✅", ts: Date.now() })
  .then(() => {
    console.log("✅ Firebase connection test successful");

    // Start data generation
    const interval = 10 * 1000; // 10s for testing
    // const interval = 30 * 60 * 1000; // uncomment for production (30 minutes)

    console.log("🚀 Data generator started...");
    simulate(); // run immediately
    setInterval(simulate, interval);
  })
  .catch((err) => console.error("❌ Firebase connection test failed:", err));
