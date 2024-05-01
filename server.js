import express from 'express';
import cors from 'cors';
import { fetchAndProcess } from './scraper.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
  res.send("<center><h1>Hello World</h1></center>");
})

app.get('/working', (req, res)=>{
  res.send("Working");
})

app.post('/bypass', async (req, res) => {
  const { url } = req.body;
  console.log("Url Come ", url)
  try { 
    let finalUrls = await fetchAndProcess(url);
    console.log(finalUrls)
    return res.json({ success: true, finalUrls });
  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).json({ error: 'Failed to process URL' });
  }
});


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
