import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import mongoose from "mongoose";

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/americanstruction', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Error:", err));





  // User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reports: { type: [String], default: [] },
  });
  
  const User = mongoose.model("User", userSchema);
  

  // Register Route
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
  
      // Create new user
      const newUser = new User({ username, password, reports: [] });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Server error during registration." });
    }
  });
  // Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    try {
      // Find user by username
      const user = await User.findOne({ username, password });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
  
      // Successfully authenticated
      res.json({ success: true, message: "Login successful", reports: user.reports });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error during login." });
    }
  });
  
const app = express();
app.use(express.json());
app.use(cors());

const API_URL = "https://americanstruction-ai-estimate-backend-6698076432.us-central1.run.app/api";

// Fetch real projects from CompanyCam
app.get("/companycam/projects", async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/companycam/projects`);
        if (!response.ok) throw new Error("Failed to fetch projects from CompanyCam API");

        const projects = await response.json();
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to load projects from CompanyCam" });
    }
});

// Fetch project images
async function getProjectImages(projectId) {
    try {
        const response = await fetch(`${API_URL}/companycam/projects/${projectId}/photos`);
        if (!response.ok) throw new Error("Failed to fetch project photos");

        const photos = await response.json();
        return photos
            .map(photo => photo.uris?.find(u => u.type === "original")?.uri)
            .filter(uri => uri !== undefined);
    } catch (error) {
        console.error("Error fetching project images:", error);
        return [];
    }
}

// AI Analysis Function (Simulated)
async function analyzeRoofDamage(images) {
    if (images.length === 0) {
        throw new Error("No images provided for analysis.");
    }

    return images.map(image => ({
        image,
        damageDetected: Math.random() > 0.5 ? "Severe" : "Minor",
    }));
}

// Modify Generate Report Route
app.post("/generate-report", async (req, res) => {
    const { username, projectId } = req.body;
    
    if (!username || !projectId) {
      return res.status(400).json({ message: "Username and Project ID are required." });
    }
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: "User not found." });
  
      const images = await getProjectImages(projectId);
      if (!images.length) return res.status(404).json({ message: "No images found for this project." });
  
      const analysisResults = await analyzeRoofDamage(images);
  
      // Save report to user's data
      user.reports.push({ projectId, analysisResults });
      await user.save();
  
      res.json({ success: true, results: analysisResults });
    } catch (error) {
      console.error("Error processing roof analysis:", error);
      res.status(500).json({ message: "Server error, please try again." });
    }
  });
  

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
