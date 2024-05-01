import express from 'express';
import cors from 'cors';
import { fetchAndProcess } from './scraper.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
  res.send("Hello World");
})

app.post('/bypass', async (req, res) => {
  const { url } = req.body;
  try { 
    let finalUrls = await fetchAndProcess(url);
    console.log(finalUrls)
    res.json({ success: true, finalUrls });
  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).json({ error: 'Failed to process URL' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
