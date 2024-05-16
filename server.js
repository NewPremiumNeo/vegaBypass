import express from 'express';
import cors from 'cors';
import { fetchAndProcess } from './scraper.js';
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

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
    return res.json({ success: true, finalUrls });
  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).json({ error: 'Failed to process URL' });
  }
});


const port = process.env.PORT || 8000;

async function callURL() {
  try {
      const url = "https://vegabypass.onrender.com/";
      const response = await fetch(url);
      if (response.ok) {
          console.log("Request sent successfully");
      } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
  } catch (error) {
      console.error("Error:", error.message);
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  callURL();
  setInterval(callURL, 2 * 60 * 1000);
});