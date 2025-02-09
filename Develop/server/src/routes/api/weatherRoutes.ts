import { Router, type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const router = Router();
const historyFilePath = path.join(__dirname, '../../searchHistory.json');
const apiKey = 'YOUR_API_KEY'; // Replace with your actual OpenWeatherMap API key

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const city = req.body.city;
  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // GET weather data from city name
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== '200') {
      return res.status(404).json({ error: 'City not found' });
    }

    // Save city to search history
    let history = [];
    if (fs.existsSync(historyFilePath)) {
      const historyData = fs.readFileSync(historyFilePath, 'utf8');
      history = JSON.parse(historyData);
    }
    history.push({ id: Date.now(), city });
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    if (fs.existsSync(historyFilePath)) {
      const historyData = fs.readFileSync(historyFilePath, 'utf8');
      const history = JSON.parse(historyData);
      res.json(history);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to read search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    if (fs.existsSync(historyFilePath)) {
      const historyData = fs.readFileSync(historyFilePath, 'utf8');
      let history = JSON.parse(historyData);
      history = history.filter(item => item.id !== id);
      fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
      res.json({ message: 'City deleted from search history' });
    } else {
      res.status(404).json({ error: 'Search history not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
