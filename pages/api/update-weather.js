// pages/api/update-weather.js
import fs from 'fs';
import path from 'path';
import { fetchWeatherData } from '../../lib/weatherService';

export default async function handler(req, res) {
  const authToken = req.headers['x-cron-secret'];
  
  if (authToken !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const data = await fetchWeatherData();
    
    const filePath = path.join(process.cwd(), 'public/data/extremes.json');
    const dirPath = path.join(process.cwd(), 'public/data');
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    res.status(200).json({ success: true, timestamp: data.timestamp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}