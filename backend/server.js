
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

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

// API Endpoint: Generate Report
app.post("/generate-report", async (req, res) => {
    try {
        const { projectId } = req.body;
        if (!projectId) return res.status(400).json({ message: "Project ID is required." });

        console.log(`Generating report for project: ${projectId}`);

        const images = await getProjectImages(projectId);
        if (!images.length) return res.status(404).json({ message: "No images found for this project." });

        const analysisResults = await analyzeRoofDamage(images);

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

