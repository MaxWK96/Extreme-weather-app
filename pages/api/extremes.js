// pages/api/extremes.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // No authentication needed - this is public data
  try {
    const filePath = path.join(process.cwd(), 'public/data/extremes.json');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Data not yet available' });
    }
    
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load weather data' });
  }
}