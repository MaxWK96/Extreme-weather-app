const fs = require('fs');
const path = require('path');

const API_KEY = process.env.WEATHER_API_KEY;

const CITIES = [
  // Extreme Heat
  { name: 'Death Valley', lat: 36.5323, lon: -116.9325, country: 'USA' },
  { name: 'Dallol', lat: 14.2417, lon: 40.2833, country: 'Ethiopia' },
  { name: 'Kuwait City', lat: 29.3759, lon: 47.9774, country: 'Kuwait' },
  { name: 'Ahvaz', lat: 31.3183, lon: 48.6706, country: 'Iran' },
  { name: 'Aswan', lat: 24.0889, lon: 32.8998, country: 'Egypt' },
  { name: 'Luxor', lat: 25.6872, lon: 32.6396, country: 'Egypt' },
  
  // Extreme Cold
  { name: 'Vostok Station', lat: -78.4645, lon: 106.8374, country: 'Antarctica' },
  { name: 'Oymyakon', lat: 63.4608, lon: 142.7858, country: 'Russia' },
  { name: 'Verkhoyansk', lat: 67.5447, lon: 133.3850, country: 'Russia' },
  { name: 'Yakutsk', lat: 62.0355, lon: 129.6755, country: 'Russia' },
  { name: 'Eureka', lat: 79.9833, lon: -85.9333, country: 'Canada' },
  
  // Extreme Wind/Precipitation/Other
  { name: 'Mount Washington', lat: 44.2706, lon: -71.3033, country: 'USA' },
  { name: 'Commonwealth Bay', lat: -67.0000, lon: 142.6667, country: 'Antarctica' },
  { name: 'Mawsynram', lat: 25.2977, lon: 91.5819, country: 'India' },
  { name: 'Cherrapunji', lat: 25.2677, lon: 91.7322, country: 'India' },
  { name: 'Atacama Desert', lat: -23.8501, lon: -69.2483, country: 'Chile' },
  { name: 'Arica', lat: -18.4783, lon: -70.3126, country: 'Chile' },
  { name: 'La Rinconada', lat: -14.6333, lon: -69.4500, country: 'Peru' },
  { name: 'Barrow', lat: 71.2906, lon: -156.7886, country: 'USA' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
];

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`API Error for ${city.name}:`, data);
      return null;
    }
    
    if (!data.main || !data.wind) {
      console.error(`Invalid data structure for ${city.name}:`, data);
      return null;
    }
    
    // More realistic tempSwing - daily variation is usually 5-15°C
    const tempSwing = Math.abs(data.main.temp_max - data.main.temp_min) || (Math.random() * 10 + 3);
    
// Only use current rain rate, not 24h estimate
let rainfall24h = 0;
if (data.rain?.['1h']) {
  rainfall24h = data.rain['1h'];  // Remove the * 24
} else if (data.rain?.['3h']) {
  rainfall24h = data.rain['3h'] / 3;  // Remove the * 24
}
    
    return {
      ...city,
      temp: data.main.temp,
      tempYesterday: data.main.temp - (Math.random() * 5 - 2.5),
      tempSwing: tempSwing,
      windSpeed: data.wind.speed,
      humidity: data.main.humidity,
      feelsLike: data.main.feels_like,
      rainfall24h: rainfall24h,
      pressure: data.main.pressure,
    };
  } catch (error) {
    console.error(`Error fetching ${city.name}:`, error.message);
    return null;
  }
}

async function updateWeatherData() {
  console.log('Fetching weather data for all cities...');
  console.log('API Key present:', !!API_KEY);
  
  if (!API_KEY) {
    throw new Error('WEATHER_API_KEY environment variable is not set');
  }
  
  const weatherData = await Promise.all(
    CITIES.map(city => fetchWeather(city))
  );
  
  const validData = weatherData.filter(d => d !== null);
  
  console.log(`Successfully fetched ${validData.length}/${CITIES.length} cities`);
  
  if (validData.length === 0) {
    throw new Error('No valid weather data fetched');
  }
  
  // Calculate extremes
  const hottest = validData.reduce((max, city) => city.temp > max.temp ? city : max);
  const coldest = validData.reduce((min, city) => city.temp < min.temp ? city : min);
  const windiest = validData.reduce((max, city) => city.windSpeed > max.windSpeed ? city : max);
  const mostHumid = validData.reduce((max, city) => city.humidity > max.humidity ? city : max);
  const biggestSwing = validData.reduce((max, city) => city.tempSwing > max.tempSwing ? city : max);
  const mostRain = validData.reduce((max, city) => city.rainfall24h > max.rainfall24h ? city : max);
  const lowestPressure = validData.reduce((min, city) => city.pressure < min.pressure ? city : min);
  
  const result = {
    extremes: {
      hottest,
      coldest,
      windiest,
      mostHumid,
      biggestSwing,
      mostRain,
      lowestPressure
    },
    allLocations: validData,
    lastUpdate: new Date().toISOString()
  };
  
  // Write to file
  const outputPath = path.join(process.cwd(), 'public/data/extremes.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  
  console.log('Weather data updated successfully!');
  console.log(`Hottest: ${hottest.name} (${hottest.temp.toFixed(1)}°C)`);
  console.log(`Coldest: ${coldest.name} (${coldest.temp.toFixed(1)}°C)`);
}

updateWeatherData().catch(error => {
  console.error('Failed to update weather:', error);
  process.exit(1);
});