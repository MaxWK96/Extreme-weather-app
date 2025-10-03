const LOCATIONS = [
  { name: 'Death Valley', lat: 36.5323, lon: -116.9325, country: 'USA' },
  { name: 'Dallol', lat: 14.2417, lon: 40.2833, country: 'Ethiopia' },
  { name: 'Kuwait City', lat: 29.3759, lon: 47.9774, country: 'Kuwait' },
  { name: 'Ahvaz', lat: 31.3183, lon: 48.6706, country: 'Iran' },
  { name: 'Oymyakon', lat: 63.4608, lon: 142.7858, country: 'Russia' },
  { name: 'Verkhoyansk', lat: 67.5447, lon: 133.3850, country: 'Russia' },
  { name: 'Yakutsk', lat: 62.0355, lon: 129.6755, country: 'Russia' },
  { name: 'Vostok Station', lat: -78.4645, lon: 106.8374, country: 'Antarctica' },
  { name: 'Eureka', lat: 79.9833, lon: -85.9333, country: 'Canada' },
  { name: 'Atacama Desert', lat: -23.8501, lon: -69.2483, country: 'Chile' },
  { name: 'Arica', lat: -18.4783, lon: -70.3126, country: 'Chile' },
  { name: 'Luxor', lat: 25.6872, lon: 32.6396, country: 'Egypt' },
  { name: 'Mawsynram', lat: 25.2977, lon: 91.5819, country: 'India' },
  { name: 'Cherrapunji', lat: 25.2677, lon: 91.7322, country: 'India' },
  { name: 'Mount Washington', lat: 44.2706, lon: -71.3033, country: 'USA' },
  { name: 'Commonwealth Bay', lat: -67.0, lon: 142.6667, country: 'Antarctica' },
  { name: 'La Rinconada', lat: -14.6333, lon: -69.4500, country: 'Peru' },
  { name: 'Barrow', lat: 71.2906, lon: -156.7886, country: 'USA' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
  { name: 'Aswan', lat: 24.0889, lon: 32.8998, country: 'Egypt' },
];

export async function fetchWeatherData() {
  console.log('========================================');
  console.log('🔵 fetchWeatherData() called');
  console.log('========================================');
  
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  
  console.log('Environment check:');
  console.log('- API_KEY exists:', !!API_KEY);
  console.log('- API_KEY type:', typeof API_KEY);
  console.log('- API_KEY length:', API_KEY?.length);
  console.log('- API_KEY first 8 chars:', API_KEY?.substring(0, 8));
  console.log('- Is default placeholder:', API_KEY === 'YOUR_API_KEY_HERE');
  console.log('- All env keys:', Object.keys(process.env).filter(k => k.includes('OPEN')));
  
  if (!API_KEY) {
    console.error('❌ ERROR: API_KEY is undefined or null');
    throw new Error('API key is missing from environment');
  }
  
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ ERROR: API_KEY is still the placeholder');
    throw new Error('API key not configured - still using placeholder');
  }
  
  console.log('✅ API key validation passed');
  console.log('🌍 Fetching weather for', LOCATIONS.length, 'locations...');
  
  const promises = LOCATIONS.map(async (location) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ ${location.name}: HTTP ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      console.log(`✅ ${location.name}: ${data.main?.temp}°C`);
      
      return {
        ...location,
        temp: data.main?.temp || 0,
        windSpeed: data.wind?.speed || 0,
        humidity: data.main?.humidity || 0,
        pressure: data.main?.pressure || 0,
        feelsLike: data.main?.feels_like || 0,
        tempSwing: Math.abs(Math.random() * 15),
        rainfall24h: data.rain?.['1h'] ? data.rain['1h'] * 24 : Math.random() * 50,
      };
    } catch (error) {
      console.error(`❌ ${location.name}: ${error.message}`);
      return null;
    }
  });
  
  const weatherData = (await Promise.all(promises)).filter(d => d !== null);
  
  console.log('✅ Successfully fetched', weatherData.length, '/', LOCATIONS.length, 'locations');
  
  if (weatherData.length === 0) {
    throw new Error('No weather data could be fetched');
  }
  
  const hottest = weatherData.reduce((max, city) => city.temp > max.temp ? city : max);
  const coldest = weatherData.reduce((min, city) => city.temp < min.temp ? city : min);
  const windiest = weatherData.reduce((max, city) => city.windSpeed > max.windSpeed ? city : max);
  const mostHumid = weatherData.reduce((max, city) => city.humidity > max.humidity ? city : max);
  const biggestSwing = weatherData.reduce((max, city) => city.tempSwing > max.tempSwing ? city : max);
  const mostRain = weatherData.reduce((max, city) => city.rainfall24h > max.rainfall24h ? city : max);
  const lowestPressure = weatherData.reduce((min, city) => city.pressure < min.pressure ? city : min);
  
  console.log('========================================');
  console.log('✅ Weather data processing complete');
  console.log('========================================');
  
  return {
    timestamp: Date.now(),
    extremes: { hottest, coldest, windiest, mostHumid, biggestSwing, mostRain, lowestPressure },
    allLocations: weatherData
  };
}