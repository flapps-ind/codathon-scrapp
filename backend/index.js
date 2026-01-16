const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


// --------------------
// FAKE DATABASE (IN MEMORY)
// --------------------
let items = [
  {
    id: "1",
    name: "Wooden Chair",
    caption: "Reusable wooden chair in good condition",
    image: "https://via.placeholder.com/300",
    co2_saved: 8.2,
    distance_km: 1.1,
    expires_in_hours: 12,
    urgency: "High",
    claimed: false
  }
];

// --------------------
// AUTH ROUTES
// --------------------
app.post("/api/auth/signup", (req, res) => {
  res.json({
    token: "demo-token",
    user: { id: "1", name: "Demo User" }
  });
});

app.post("/api/auth/login", (req, res) => {
  res.json({
    token: "demo-token",
    user: { id: "1", name: "Demo User" }
  });
});

// --------------------
// GET ITEMS
// --------------------
app.get("/api/items", (req, res) => {
  res.json(items);
});

// --------------------
// UPLOAD ITEM
// --------------------
app.post("/api/items/upload", (req, res) => {
  const newItem = {
    id: Date.now().toString(),
    name: "Paint Can",
    caption: "Half-used paint can, usable",
    image: "https://via.placeholder.com/300",
    co2_saved: 4.1,
    distance_km: 0.5,
    expires_in_hours: 6,
    urgency: "High",
    claimed: false
  };

  items.unshift(newItem);
  res.json(newItem);
});

// --------------------
// CLAIM ITEM
// --------------------
app.post("/api/items/claim", (req, res) => {
  const { id } = req.body;
  items = items.map(item =>
    item.id === id ? { ...item, claimed: true } : item
  );
  res.json({ success: true });
});

// --------------------
// START SERVER
// --------------------
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
fetch("http://localhost:5000/api/items")
