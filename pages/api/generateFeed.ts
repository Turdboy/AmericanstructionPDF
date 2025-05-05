export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userInput } = req.body;

  const fakeVideos = Array.from({ length: 10 }, (_, i) => ({
    url: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_${i + 1}.mp4`,
    description: `AI-generated video ${i + 1} for input: ${userInput}`,
  }));

  res.status(200).json({ videos: fakeVideos });
}
