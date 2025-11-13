const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  try {
    const userRef = db.collection("users").doc(email);
    const doc = await userRef.get();
    if (doc.exists) return res.status(400).json({ message: "User already exists" });

    await userRef.set({ email, password });
    res.json({ message: "User registered successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRef = db.collection("users").doc(email);
    const doc = await userRef.get();
    if (!doc.exists || doc.data().password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful", email });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
