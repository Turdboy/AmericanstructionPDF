import express from 'express';
const router = express.Router();

router.post('/generateFeed', async (req, res) => {
  const { userInput } = req.body;

  // MOCK DATA — replace later with real AI call
  const fakeVideos = Array.from({ length: 10 }, (_, i) => ({
    url: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_${i + 1}.mp4`,
    description: `AI-generated video ${i + 1} for input: ${userInput}`,
  }));

  res.json({ videos: fakeVideos });
});

export default router;
