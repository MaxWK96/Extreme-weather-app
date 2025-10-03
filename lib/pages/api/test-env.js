export default function handler(req, res) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  res.json({
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    firstChars: apiKey?.substring(0, 8) || 'none',
    allEnvVars: Object.keys(process.env).filter(k => k.includes('OPEN') || k.includes('CRON'))
  });
}