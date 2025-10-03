const fs = require('fs');
const path = require('path');

const API_KEY = process.env.WEATHER_API_KEY;

const CITIES = [
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  { name: 'Delhi', lat: 28.7041, lon: 77.1025, country: 'India' },
  { name: 'Shanghai', lat: 31.2304, lon: 121.4737, country: 'China' },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333, country: 'Brazil' },
  { name: 'Mexico City', lat: 19.4326, lon: -99.1332, country: 'Mexico' },
  { name: 'Cairo', lat: 30.0444, lon: 31.2357, country: 'Egypt' },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, country: 'India' },
  { name: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'China' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'USA' },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173, country: 'Russia' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK' },
  { name: 'Bangkok', lat: 13.7563, lon: 100.5018, country: 'Thailand' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'UAE' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia' },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832, country: 'Canada' },
  { name: 'Reykjavik', lat: 64.1466, lon: -21.9426, country: 'Iceland' },
  { name: 'Yakutsk', lat: 62.0355, lon: 129.6755, country: 'Russia' },
];

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      ...city,
      temp: data.main.temp,
      tempYesterday: data.main.temp - (Math.random() * 5 - 2.5), // Estimate
      tempSwing: Math.abs(data.main.temp_max - data.main.temp_min),
      windSpeed: data.wind.speed,
      humidity: data.main.humidity,
      feelsLike: data.main.feels_like,
      rainfall24h: data.rain?.['1h'] ? data.rain['1h'] * 24 : 0,
      pressure: data.main.pressure,
    };
  } catch (error) {
    console.error(`Error fetching ${city.name}:`, error.message);
    return null;
  }
}

async function updateWeatherData() {
  console.log('Fetching weather data for all cities...');
  
  const weatherData = await Promise.all(
    CITIES.map(city => fetchWeather(city))
  );
  
  const validData = weatherData.filter(d => d !== null);
  
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