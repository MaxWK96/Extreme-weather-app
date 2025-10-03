import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Snowflake, Wind, Droplets, Share2, RefreshCw, Sparkles, TrendingUp, MapPin, Eye, Bell, BellOff, AlertTriangle, Trophy, Calendar, Zap, CloudRain, Gauge, Search, X, Maximize2, Download, Sun, Moon, Shuffle, Clock } from 'lucide-react';

// Configuration for tracking (optimized for free tier)
const TRACKING_CONFIG = {
  major_cities: 20,
  grid_points: 0,
  use_api: true,
  api_key: 'YOUR_API_KEY_HERE'
};

const SEED_CITIES = [
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
  { name: 'Kuwait City', lat: 29.3759, lon: 47.9774, country: 'Kuwait' },
  { name: 'Death Valley', lat: 36.5323, lon: -116.9325, country: 'USA' },
  { name: 'Dallol', lat: 14.2417, lon: 40.2833, country: 'Ethiopia' },
  { name: 'Verkhoyansk', lat: 67.5447, lon: 133.3850, country: 'Russia' },
  { name: 'Oymyakon', lat: 63.4608, lon: 142.7858, country: 'Russia' },
  { name: 'Mount Washington', lat: 44.2706, lon: -71.3033, country: 'USA' },
  { name: 'Cherrapunji', lat: 25.2677, lon: 91.7322, country: 'India' },
  { name: 'Arica', lat: -18.4783, lon: -70.3126, country: 'Chile' },
  { name: 'Atacama Desert', lat: -23.8501, lon: -69.2483, country: 'Chile' },
  { name: 'McMurdo Station', lat: -77.8419, lon: 166.6863, country: 'Antarctica' },
];

const generateGlobalGrid = (numPoints) => {
  const points = [];
  const latStep = 180 / Math.sqrt(numPoints);
  const lonStep = 360 / Math.sqrt(numPoints);
  
  for (let lat = -90 + latStep/2; lat < 90; lat += latStep) {
    for (let lon = -180 + lonStep/2; lon < 180; lon += lonStep) {
      points.push({
        name: `Grid ${lat.toFixed(1)}°, ${lon.toFixed(1)}°`,
        lat: lat,
        lon: lon,
        country: 'Global',
        isGridPoint: true
      });
    }
  }
  
  return points.slice(0, numPoints);
};

const WeatherExtremesTracker = () => {
  const [extremes, setExtremes] = useState(null);
  const [allCities, setAllCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExtreme, setSelectedExtreme] = useState(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [historicalRecords, setHistoricalRecords] = useState(null);
  const [activeTab, setActiveTab] = useState('live');
  const [usingRealData, setUsingRealData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareCity, setCompareCity] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [communitySubmissions, setCommunitySubmissions] = useState([]);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // (removed duplicate fetchWeatherData declaration)

  const generateMockCityData = (city) => {
    const temp = Math.random() * 70 - 30;
    const tempYesterday = temp + (Math.random() * 20 - 10);
    
    return {
      ...city,
      temp,
      tempYesterday,
      tempSwing: Math.abs(temp - tempYesterday),
      windSpeed: Math.random() * 35,
      humidity: 30 + Math.random() * 70,
      feelsLike: temp + (Math.random() * 10 - 5),
      rainfall24h: Math.random() * 100,
      pressure: 980 + Math.random() * 50,
    };
  };

  const processWeatherData = (weatherData, isReal) => {
    const hottest = weatherData.reduce((max, city) => city.temp > max.temp ? city : max);
    const coldest = weatherData.reduce((min, city) => city.temp < min.temp ? city : min);
    const windiest = weatherData.reduce((max, city) => city.windSpeed > max.windSpeed ? city : max);
    const mostHumid = weatherData.reduce((max, city) => city.humidity > max.humidity ? city : max);
    const biggestSwing = weatherData.reduce((max, city) => city.tempSwing > max.tempSwing ? city : max);
    const mostRain = weatherData.reduce((max, city) => city.rainfall24h > max.rainfall24h ? city : max);
    const lowestPressure = weatherData.reduce((min, city) => city.pressure < min.pressure ? city : min);

    setExtremes({ hottest, coldest, windiest, mostHumid, biggestSwing, mostRain, lowestPressure });
    setAllCities(weatherData);
    setUsingRealData(isReal);
    generateAlerts({ hottest, coldest, windiest, mostRain });
    updateHistoricalRecords({ hottest, coldest, windiest });
  };

  const generateAlerts = (extremes) => {
    const newAlerts = [];
    
    if (extremes.hottest.temp > 45) {
      newAlerts.push({
        id: Date.now() + 1,
        type: 'extreme',
        title: 'EXTREME HEAT ALERT',
        message: `${extremes.hottest.name} just hit ${Math.round(extremes.hottest.temp)}°C - dangerous conditions`,
        time: new Date(),
        icon: Flame,
        color: 'red'
      });
    }
    if (extremes.coldest.temp < -30) {
      newAlerts.push({
        id: Date.now() + 2,
        type: 'extreme',
        title: 'EXTREME COLD ALERT',
        message: `${extremes.coldest.name} at ${Math.round(extremes.coldest.temp)}°C - life-threatening cold`,
        time: new Date(),
        icon: Snowflake,
        color: 'blue'
      });
    }
    if (extremes.windiest.windSpeed > 25) {
      newAlerts.push({
        id: Date.now() + 3,
        type: 'warning',
        title: 'HIGH WIND WARNING',
        message: `${extremes.windiest.name} experiencing ${Math.round(extremes.windiest.windSpeed)} m/s winds`,
        time: new Date(),
        icon: Wind,
        color: 'yellow'
      });
    }
    if (extremes.mostRain && extremes.mostRain.rainfall24h > 80) {
      newAlerts.push({
        id: Date.now() + 4,
        type: 'warning',
        title: 'HEAVY RAINFALL',
        message: `${extremes.mostRain.name} received ${Math.round(extremes.mostRain.rainfall24h)}mm in 24h`,
        time: new Date(),
        icon: CloudRain,
        color: 'cyan'
      });
    }
    
    setAlerts(newAlerts);
    
    if (notificationsEnabled && newAlerts.length > 0 && 'Notification' in window) {
      newAlerts.forEach(alert => {
        new Notification(alert.title, {
          body: alert.message,
          icon: '⚠️'
        });
      });
    }
  };

  const updateHistoricalRecords = (extremes) => {
    setHistoricalRecords({
      hottestEver: { temp: Math.max(extremes.hottest.temp, 56.7), city: 'Death Valley', date: '1913-07-10' },
      coldestEver: { temp: Math.min(extremes.coldest.temp, -89.2), city: 'Vostok Station', date: '1983-07-21' },
      windiestEver: { speed: Math.max(extremes.windiest.windSpeed, 113), city: 'Mount Washington', date: '1934-04-12' },
      hottestThisMonth: extremes.hottest,
      coldestThisMonth: extremes.coldest,
      windiestThisMonth: extremes.windiest,
    });
  };

  // import { useEffect, useCallback } from 'react'; // <-- removed, already imported at top

// Make sure fetchWeatherData is wrapped in useCallback if it's defined inside your component:
const fetchWeatherData = useCallback(() => {
  // your fetch logic here
}, []);

useEffect(() => {
  // Initial fetch
  fetchWeatherData();

  // Fetch every 30 minutes
  const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);

  // Cleanup interval on unmount
  return () => clearInterval(interval);
}, [fetchWeatherData]); // ✅ include fetchWeatherData in deps

useEffect(() => {
  if (searchQuery.length > 0) {
    const results = allCities
      .filter(city =>
        !city.isGridPoint &&
        (city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         city.country.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .slice(0, 8);
    setSearchResults(results);
  } else {
    setSearchResults([]);
  }
}, [searchQuery, allCities]); // ✅ this one is already correct


  const toggleNotifications = () => {
    if (!notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          new Notification('🌍 Weather Alerts Enabled', {
            body: "You'll get notified when extreme weather happens!",
            icon: '🔥'
          });
        }
      });
    } else {
      setNotificationsEnabled(false);
    }
  };

  const randomExtreme = () => {
    const randomLocation = allCities[Math.floor(Math.random() * allCities.length)];
    
    if (randomLocation) {
      setSelectedExtreme({
        ...randomLocation,
        type: 'random',
        stat: randomLocation.temp || 0,
        unit: '°C'
      });
    }
  };



  const getVibeText = (type, value) => {
    if (type === 'hot') {
      if (value >= 45) return "literally melting";
      if (value >= 40) return "straight up dangerous";
      if (value >= 35) return "sunscreen won't save you";
      if (value >= 30) return "spicy weather";
      return "getting toasty";
    } else if (type === 'cold') {
      if (value <= -40) return "Mars vibes";
      if (value <= -30) return "instant frostbite territory";
      if (value <= -20) return "painfully cold";
      if (value <= -10) return "freezing your face off";
      if (value <= 0) return "ice ice baby";
      return "chilly";
    } else if (type === 'wind') {
      if (value >= 25) return "hurricane mode";
      if (value >= 20) return "hold onto everything";
      if (value >= 15) return "windy af";
      return "breezy";
    } else if (type === 'humidity') {
      if (value >= 90) return "underwater but not";
      if (value >= 80) return "sticky situation";
      if (value >= 70) return "muggy";
      return "moist";
    } else if (type === 'swing') {
      if (value >= 20) return "bipolar weather";
      if (value >= 15) return "can't decide what to wear";
      if (value >= 10) return "rollercoaster temps";
      return "slightly moody";
    } else if (type === 'rain') {
      if (value >= 80) return "noah's ark time";
      if (value >= 60) return "drowning in rain";
      if (value >= 40) return "serious downpour";
      return "pretty wet";
    }
  };

  const shareExtreme = (extreme, type, stat, unit) => {
    const emoji = type === 'hottest' ? '🔥' : type === 'coldest' ? '❄️' : type === 'windiest' ? '💨' : type === 'mostHumid' ? '💧' : type === 'biggestSwing' ? '⚡' : '🌧️';
    const text = `${emoji} ${extreme.name} is the ${type} place on Earth right now: ${Math.round(stat)}${unit}\n\nCheck out global weather extremes →`;
    
    if (navigator.share) {
      navigator.share({ text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      alert('📋 Copied to clipboard!');
    }
  };

  const coordsToMapPosition = (lat, lon) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <p className={`${darkMode ? 'text-white' : 'text-gray-900'} mt-4 text-lg font-medium`}>scanning the planet...</p>
          <p className={`${darkMode ? 'text-gray-500' : 'text-gray-600'} text-sm mt-2`}>
            checking {SEED_CITIES.length + (TRACKING_CONFIG.grid_points || 0)}+ locations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} overflow-x-hidden transition-colors duration-300`}>
      {/* Header */}
      <div className={`border-b ${darkMode ? 'border-gray-800 bg-black/80' : 'border-gray-200 bg-white/80'} backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 ${animateIn ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-3xl font-black tracking-tight relative">
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 opacity-50 blur-xl"></span>
                  <span className="relative bg-gradient-to-r from-orange-400 via-red-500 to-blue-400 bg-clip-text text-transparent animate-pulse">
                    EXTREME WEATHER
                  </span>
                  <span className="absolute -top-1 -right-1 text-yellow-400 text-xs">☀️</span>
                  <span className="absolute -bottom-1 -left-1 text-blue-400 text-xs">❄️</span>
                </span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>tracking the 20 most extreme places on Earth</p>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  usingRealData 
                    ? 'bg-green-900/30 text-green-400 border border-green-700/50' 
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50'
                }`}>
                  {usingRealData ? '✓ LIVE' : '⚡ DEMO'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 sm:p-3 rounded-lg transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                title="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={toggleNotifications}
                className={`p-2 sm:p-3 rounded-lg transition-all ${
                  notificationsEnabled 
                    ? 'bg-purple-600 text-white' 
                    : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title={notificationsEnabled ? 'Notifications on' : 'Enable notifications'}
              >
                {notificationsEnabled ? <Bell className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" /> : <BellOff className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={fetchWeatherData}
                className="p-2 sm:p-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-all"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400 border border-gray-200'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl overflow-hidden z-50 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                {searchResults.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCompareCity(city);
                      setCompareMode(true);
                      setSearchQuery('');
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors flex justify-between items-center ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{city.name}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{city.country}</div>
                    </div>
                    <div className="text-2xl font-black">{Math.round(city.temp)}°</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {['live', 'leaderboard', 'history', 'alerts'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? 'bg-purple-600 text-white' 
                    : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {tab === 'live' && '🔴 live'}
                {tab === 'leaderboard' && '🏆 leaderboard'}
                {tab === 'history' && '📅 records'}
                {tab === 'alerts' && `⚠️ alerts ${alerts.length > 0 ? `(${alerts.length})` : ''}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* LIVE TAB */}
        {activeTab === 'live' && extremes && (
          <>
 <div className="flex flex-wrap gap-2 mb-6">
  {/* Map button hidden */}
  <button
    onClick={() => setViewMode(viewMode === 'cards' ? 'map' : 'cards')}
    className="hidden"
  >
    {viewMode === 'cards' ? <MapPin className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    {viewMode === 'cards' ? 'map view' : 'card view'}
  </button>

  {/* Surprise me button hidden */}
  <button
    onClick={randomExtreme}
    className="hidden"
  >
    <Shuffle className="w-4 h-4" />
    surprise me
  </button>
</div>


            {viewMode === 'cards' ? (
              <>
                {/* Hero Winner */}
                <div className={`mb-8 relative overflow-hidden rounded-3xl transition-all duration-500 ${
                  animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500"></div>
                  
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute inset-0 bg-yellow-300/30 rounded-full animate-ping"></div>
                      <div className="absolute inset-4 bg-orange-300/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-8 text-6xl opacity-20 animate-pulse">☀️</div>
                  <div className="absolute bottom-8 left-12 text-4xl opacity-15 animate-pulse" style={{animationDelay: '0.5s'}}>🔥</div>
                  <div className="absolute top-1/3 right-1/4 text-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}>☀️</div>
                  
                  <div className="relative bg-gradient-to-b from-black/20 via-black/40 to-black/60 backdrop-blur-[2px] rounded-3xl p-6 sm:p-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50"></div>
                          <div className="relative p-4 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-2xl shadow-2xl">
                            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 animate-pulse drop-shadow-lg" />
                          </div>
                          <Sparkles className="w-5 h-5 text-yellow-200 absolute -top-1 -right-1 animate-pulse drop-shadow-lg" />
                        </div>
                        <div>
                          <div className="text-yellow-200 text-xs font-bold uppercase tracking-widest mb-1 drop-shadow-md">🏆 today&apos;s winner</div>
                          <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-2xl">HOTTEST ON EARTH</h2>
                        </div>
                      </div>
                      <button
                        onClick={() => shareExtreme(extremes.hottest, 'hottest', extremes.hottest.temp, '°C')}
                        className="p-2 sm:p-3 hover:bg-white/20 rounded-xl transition-all hover:scale-110 backdrop-blur-sm"
                      >
                        <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" />
                      </button>
                    </div>
                    
                    <div className="text-6xl sm:text-8xl font-black tracking-tighter mb-2 text-white drop-shadow-2xl">
                      {Math.round(extremes.hottest.temp)}°
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-yellow-50 mb-1 drop-shadow-lg">
                      {extremes.hottest.name}, {extremes.hottest.country}
                    </div>
                    <div className="text-base sm:text-xl text-white/90 italic drop-shadow-md bg-black/30 rounded-xl px-4 py-2 backdrop-blur-sm inline-block">
  &quot;{getVibeText('hot', extremes.hottest.temp)}&quot;
</div>

                  </div>
                </div>

                {/* Compare Mode */}
                {compareMode && compareCity && (
                  <div className={`mb-8 p-6 rounded-2xl transition-all ${
                    darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-black">Comparing Cities</h3>
                      <button onClick={() => setCompareMode(false)} className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="font-bold mb-2">{extremes.hottest.name}</div>
                        <div className="text-3xl font-black mb-1">{Math.round(extremes.hottest.temp)}°C</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Hottest</div>
                      </div>
                      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="font-bold mb-2">{compareCity.name}</div>
                        <div className="text-3xl font-black mb-1">{Math.round(compareCity.temp)}°C</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {Math.abs(extremes.hottest.temp - compareCity.temp).toFixed(1)}° difference
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Extremes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ExtremeCard
                    extreme={extremes.coldest}
                    type="coldest"
                    icon={Snowflake}
                    emoji="❄️"
                    stat={extremes.coldest.temp}
                    unit="°C"
                    color="from-blue-600 to-cyan-600"
                    vibeType="cold"
                    onShare={shareExtreme}
                    onClick={() => setSelectedExtreme({ ...extremes.coldest, type: 'coldest', stat: extremes.coldest.temp, unit: '°C' })}
                    darkMode={darkMode}
                  />
                  <ExtremeCard
                    extreme={extremes.windiest}
                    type="windiest"
                    icon={Wind}
                    emoji="💨"
                    stat={extremes.windiest.windSpeed}
                    unit=" m/s"
                    color="from-teal-600 to-green-600"
                    vibeType="wind"
                    onShare={shareExtreme}
                    onClick={() => setSelectedExtreme({ ...extremes.windiest, type: 'windiest', stat: extremes.windiest.windSpeed, unit: ' m/s' })}
                    darkMode={darkMode}
                  />
                  <ExtremeCard
                    extreme={extremes.mostHumid}
                    type="most humid"
                    icon={Droplets}
                    emoji="💧"
                    stat={extremes.mostHumid.humidity}
                    unit="%"
                    color="from-indigo-600 to-purple-600"
                    vibeType="humidity"
                    onShare={shareExtreme}
                    onClick={() => setSelectedExtreme({ ...extremes.mostHumid, type: 'mostHumid', stat: extremes.mostHumid.humidity, unit: '%' })}
                    darkMode={darkMode}
                  />
                  <ExtremeCard
                    extreme={extremes.biggestSwing}
                    type="biggest swing"
                    icon={Zap}
                    emoji="⚡"
                    stat={extremes.biggestSwing.tempSwing}
                    unit="°C/24h"
                    color="from-yellow-600 to-orange-600"
                    vibeType="swing"
                    onShare={shareExtreme}
                    onClick={() => setSelectedExtreme({ ...extremes.biggestSwing, type: 'biggestSwing', stat: extremes.biggestSwing.tempSwing, unit: '°C' })}
                    darkMode={darkMode}
                  />
                  <ExtremeCard
                    extreme={extremes.mostRain}
                    type="most rain"
                    icon={CloudRain}
                    emoji="🌧️"
                    stat={extremes.mostRain.rainfall24h}
                    unit="mm"
                    color="from-blue-500 to-indigo-600"
                    vibeType="rain"
                    onShare={shareExtreme}
                    onClick={() => setSelectedExtreme({ ...extremes.mostRain, type: 'mostRain', stat: extremes.mostRain.rainfall24h, unit: 'mm' })}
                    darkMode={darkMode}
                  />
                  <ExtremeCard
                    extreme={extremes.lowestPressure}
                    type="lowest pressure"
                    icon={Gauge}
                    emoji="📉"
                    stat={extremes.lowestPressure.pressure}
                    unit=" hPa"
                    color="from-gray-600 to-gray-500"
                    vibeType={null}
                    onShare={shareExtreme}
                    onClick={() => setSelectedExtreme({ ...extremes.lowestPressure, type: 'lowestPressure', stat: extremes.lowestPressure.pressure, unit: ' hPa' })}
                    darkMode={darkMode}
                  />
                </div>

                {/* Community Challenge Section */}
                <div className={`mt-8 rounded-3xl p-8 border transition-all ${
                  darkMode ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700/50' : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300'
                }`}>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-black mb-2">
                      🌡️ Think Your City is More Extreme?
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                      We track the <span className="font-bold text-purple-500">20 most extreme places</span> on Earth.
                      <br />But we know there&apos;s more extreme weather out there.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-4xl font-black text-purple-500">{submissionCount}+</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>cities submitted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-black text-pink-500">20</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>extreme spots tracked</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-black text-orange-500">∞</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>more to discover</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto transition-all hover:scale-105 shadow-lg"
                    >
                      <TrendingUp className="w-6 h-6" />
                      Submit Your Location
                    </button>
                  </div>

                  {communitySubmissions.length > 0 && (
                    <div className={`mt-8 rounded-2xl p-6 ${darkMode ? 'bg-black/30' : 'bg-white/50'} backdrop-blur-sm`}>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Recent Community Reports
                      </h3>
                      <div className="space-y-3">
                        {communitySubmissions.map((sub, idx) => (
                          <div 
                            key={idx}
                            className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                              darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              {sub.verified && (
                                <div className="text-2xl">✓</div>
                              )}
                              <div>
                                <div className="font-bold flex items-center gap-2">
                                  {sub.city}, {sub.country}
                                  {sub.verified && (
                                    <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-full">
                                      verified
                                    </span>
                                  )}
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  by {sub.submitter} • {sub.time}
                                </div>
                              </div>
                            </div>
                            <div className="text-3xl font-black">{sub.temp}°C</div>
                          </div>
                        ))}
                      </div>
                      <p className={`text-center text-sm mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        Submit yours to get featured here!
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <MapView 
                allCities={allCities} 
                extremes={extremes} 
                hoveredCity={hoveredCity}
                setHoveredCity={setHoveredCity}
                coordsToMapPosition={coordsToMapPosition}
                darkMode={darkMode}
              />
            )}
          </>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <LeaderboardView allCities={allCities} darkMode={darkMode} />
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && historicalRecords && (
          <HistoryView records={historicalRecords} darkMode={darkMode} />
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <AlertsView alerts={alerts} darkMode={darkMode} />
        )}

        {/* Footer */}
        <div className={`mt-12 rounded-2xl p-6 border transition-colors ${
          darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700' : 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                updates every 30 minutes
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                tracking 20 scientifically verified extreme locations • updated every 30 min • powered by community
              </p>
            </div>
            <button
              onClick={() => shareExtreme(extremes?.hottest || {name: 'Earth', country: ''}, 'global', 0, '')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Share2 className="w-5 h-5" />
              share
            </button>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setShowSubmitModal(false)}
        >
          <div 
            className={`rounded-3xl p-8 max-w-lg w-full border-2 relative my-8 max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSubmitModal(false)}
              className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🌡️</div>
              <h2 className="text-2xl font-black mb-2">Submit Your Location</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Help us track extreme weather worldwide!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  City Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phoenix"
                  className={`w-full px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Country *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. USA"
                  className={`w-full px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Temperature (°C) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 45"
                  className={`w-full px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Why is it extreme?
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Hottest day of the year, unusual cold snap..."
                  className={`w-full px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Name/Handle (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. weatherfan123"
                  className={`w-full px-4 py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              <button
                onClick={() => {
                  alert('Submission recorded! We\'ll verify and add it soon.');
                  setSubmissionCount(prev => prev + 1);
                  setShowSubmitModal(false);
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold text-lg transition-all hover:scale-105"
              >
                Submit Report
              </button>

              <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                We&apos;ll verify your submission and add it if accurate!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extreme Modal */}
      {selectedExtreme && (
        <ExtremeModal 
          extreme={selectedExtreme}
          onClose={() => setSelectedExtreme(null)}
          onShare={shareExtreme}
          getVibeText={getVibeText}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

const ExtremeCard = ({ extreme, type, icon: Icon, emoji, stat, unit, color, vibeType, onShare, onClick, darkMode }) => {
  const getVibeText = (type, value) => {
    if (type === 'cold') {
      if (value <= -40) return "Mars vibes";
      if (value <= -30) return "instant frostbite territory";
      if (value <= -20) return "painfully cold";
      if (value <= -10) return "freezing your face off";
      if (value <= 0) return "ice ice baby";
      return "chilly";
    } else if (type === 'wind') {
      if (value >= 25) return "hurricane mode";
      if (value >= 20) return "hold onto everything";
      if (value >= 15) return "windy af";
      return "breezy";
    } else if (type === 'humidity') {
      if (value >= 90) return "underwater but not";
      if (value >= 80) return "sticky situation";
      if (value >= 70) return "muggy";
      return "moist";
    } else if (type === 'swing') {
      if (value >= 20) return "bipolar weather";
      if (value >= 15) return "can't decide what to wear";
      if (value >= 10) return "rollercoaster temps";
      return "slightly moody";
    } else if (type === 'rain') {
      if (value >= 80) return "noah's ark time";
      if (value >= 60) return "drowning in rain";
      if (value >= 40) return "serious downpour";
      return "pretty wet";
    }
    return "";
  };

  const getThemedStyle = () => {
    if (type === 'coldest') {
      return {
        bg: 'bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200',
        overlay: 'bg-gradient-to-b from-transparent via-blue-900/30 to-blue-950/70',
        glow: 'shadow-2xl shadow-blue-400/50',
        accent: 'text-cyan-100',
        particles: (
          <>
            <div className="absolute top-2 left-4 text-white/30 text-2xl animate-pulse">❄️</div>
            <div className="absolute top-8 right-6 text-white/20 text-xl animate-pulse" style={{animationDelay: '0.3s'}}>❄️</div>
            <div className="absolute bottom-12 left-8 text-white/25 text-lg animate-pulse" style={{animationDelay: '0.6s'}}>❄️</div>
            <div className="absolute top-1/2 right-4 text-white/15 text-sm animate-pulse" style={{animationDelay: '0.9s'}}>❄️</div>
          </>
        )
      };
    } else if (type === 'windiest') {
      return {
        bg: 'bg-gradient-to-br from-teal-400 via-cyan-500 to-gray-400',
        overlay: 'bg-gradient-to-b from-transparent via-teal-900/30 to-gray-900/70',
        glow: 'shadow-2xl shadow-teal-400/50',
        accent: 'text-teal-100',
        particles: (
          <>
            <div className="absolute top-4 left-2 text-white/20 text-xl animate-bounce">💨</div>
            <div className="absolute top-1/3 right-8 text-white/15 text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>🌪️</div>
            <div className="absolute bottom-1/4 left-12 text-white/20 text-lg animate-bounce" style={{animationDelay: '0.4s'}}>💨</div>
          </>
        )
      };
    } else if (type === 'most humid') {
      return {
        bg: 'bg-gradient-to-br from-indigo-400 via-blue-500 to-purple-400',
        overlay: 'bg-gradient-to-b from-transparent via-indigo-900/40 to-purple-950/70',
        glow: 'shadow-2xl shadow-indigo-400/50',
        accent: 'text-indigo-100',
        particles: (
          <>
            <div className="absolute top-6 right-4 text-white/25 text-3xl">💧</div>
            <div className="absolute top-16 left-6 text-white/20 text-2xl" style={{animationDelay: '0.3s'}}>💧</div>
            <div className="absolute bottom-16 right-8 text-white/25 text-xl" style={{animationDelay: '0.6s'}}>💧</div>
            <div className="absolute top-1/2 left-1/4 text-white/15 text-lg" style={{animationDelay: '0.9s'}}>💧</div>
          </>
        )
      };
    } else if (type === 'biggest swing') {
      return {
        bg: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
        overlay: 'bg-gradient-to-b from-transparent via-yellow-900/30 to-red-950/70',
        glow: 'shadow-2xl shadow-yellow-400/50',
        accent: 'text-yellow-100',
        particles: (
          <>
            <div className="absolute top-4 right-4 text-white/30 text-2xl animate-ping">⚡</div>
            <div className="absolute bottom-8 left-6 text-white/25 text-xl animate-ping" style={{animationDelay: '0.5s'}}>⚡</div>
            <div className="absolute top-1/2 right-8 text-white/20 text-lg animate-ping" style={{animationDelay: '1s'}}>⚡</div>
          </>
        )
      };
    } else if (type === 'most rain') {
      return {
        bg: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900',
        overlay: 'bg-gradient-to-b from-transparent via-blue-950/40 to-indigo-950/80',
        glow: 'shadow-2xl shadow-blue-600/50',
        accent: 'text-blue-100',
        particles: (
          <>
            <div className="absolute top-2 left-1/4 text-white/30 text-xl">🌧️</div>
            <div className="absolute top-8 right-1/4 text-white/25 text-lg" style={{animationDelay: '0.2s'}}>💧</div>
            <div className="absolute top-16 left-1/3 text-white/20 text-sm" style={{animationDelay: '0.4s'}}>💧</div>
            <div className="absolute bottom-20 right-1/3 text-white/25 text-lg" style={{animationDelay: '0.6s'}}>💧</div>
          </>
        )
      };
    } else {
      return {
        bg: 'bg-gradient-to-br from-gray-500 via-slate-600 to-gray-700',
        overlay: 'bg-gradient-to-b from-transparent via-gray-900/30 to-slate-950/70',
        glow: 'shadow-2xl shadow-gray-500/50',
        accent: 'text-gray-100',
        particles: (
          <>
            <div className="absolute top-4 right-4 text-white/20 text-2xl">📉</div>
            <div className="absolute bottom-8 left-6 text-white/15 text-xl">🌀</div>
          </>
        )
      };
    }
  };

  const theme = getThemedStyle();

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl ${theme.bg} ${theme.glow} cursor-pointer hover:scale-105 transition-all duration-300`}
      onClick={onClick}
    >
      {theme.particles}
      <div className={`absolute inset-0 ${theme.overlay}`}></div>
      
      <div className="relative p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Icon className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <Share2 
            className="w-5 h-5 text-white/70 hover:text-white cursor-pointer transition-all hover:scale-110 drop-shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onShare(extreme, type.replace(' ', ''), stat, unit);
            }}
          />
        </div>
        <div className={`${theme.accent} text-xs font-bold uppercase tracking-wider mb-2 drop-shadow-md`}>{emoji} {type}</div>
        <div className="text-5xl font-black mb-2 text-white drop-shadow-2xl">{Math.round(stat)}{unit}</div>
        <div className="text-lg font-bold text-white drop-shadow-md mb-1">{extreme.name}</div>
        <div className="text-sm text-white/80 drop-shadow-sm mb-3">{extreme.country}</div>
        {vibeType && (
          <div className="text-sm text-white/90 italic drop-shadow-md bg-black/20 rounded-lg px-3 py-2 backdrop-blur-sm">
            &quot;{getVibeText(vibeType, stat)}&quot;
          </div>
        )}
      </div>
    </div>
  );
};

const MapView = ({ allCities, extremes, hoveredCity, setHoveredCity, coordsToMapPosition, darkMode }) => {
  const getTempColor = (temp) => {
    if (temp >= 40) return 'bg-red-600';
    if (temp >= 30) return 'bg-orange-500';
    if (temp >= 20) return 'bg-yellow-500';
    if (temp >= 10) return 'bg-green-500';
    if (temp >= 0) return 'bg-cyan-500';
    if (temp >= -10) return 'bg-blue-500';
    if (temp >= -20) return 'bg-indigo-600';
    return 'bg-purple-700';
  };

  return (
    <div className="mb-8">
      <div className={`rounded-3xl p-8 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="relative w-full" style={{ paddingBottom: '50%' }}>
          <div className={`absolute inset-0 rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
              {/* Ocean background */}
              <rect width="1000" height="500" fill={darkMode ? '#1e293b' : '#bfdbfe'} />
              
              {/* World map using SAME coordinate system as dots */}
              <g fill={darkMode ? '#475569' : '#94a3b8'} stroke={darkMode ? '#64748b' : '#6b7280'} strokeWidth="0.5">
                {/* North America - using actual lat/lon converted to pixels */}
                <path d="M 50,90 L 80,70 L 120,60 L 170,55 L 220,60 L 250,75 L 270,100 L 280,130 L 275,160 L 260,185 L 230,200 L 200,205 L 170,200 L 140,185 L 110,160 L 80,130 L 60,105 Z" />
                
                {/* Central America */}
                <path d="M 200,210 L 220,205 L 235,215 L 240,230 L 235,242 L 220,247 L 205,242 L 200,227 Z" />
                
                {/* South America */}
                <path d="M 240,250 L 260,245 L 280,255 L 295,280 L 305,315 L 305,350 L 295,380 L 275,400 L 255,405 L 240,395 L 235,365 L 235,330 L 238,295 L 240,265 Z" />
                
                {/* Greenland */}
                <path d="M 320,45 L 350,35 L 375,40 L 390,60 L 390,85 L 375,105 L 350,110 L 330,100 L 320,75 Z" />
                
                {/* Europe */}
                <path d="M 480,85 L 510,80 L 535,85 L 550,100 L 550,120 L 540,135 L 520,140 L 495,138 L 478,125 L 475,105 Z" />
                
                {/* Africa */}
                <path d="M 470,155 L 495,150 L 525,160 L 545,185 L 560,225 L 565,270 L 560,310 L 540,345 L 510,360 L 480,362 L 455,350 L 440,320 L 438,280 L 442,240 L 455,200 L 465,170 Z" />
                
                {/* Middle East */}
                <path d="M 555,145 L 575,142 L 590,150 L 595,168 L 588,180 L 570,183 L 555,175 L 552,160 Z" />
                
                {/* Russia/Northern Asia */}
                <path d="M 570,75 L 620,65 L 680,60 L 740,65 L 800,78 L 850,95 L 890,115 L 910,135 L 915,160 L 905,185 L 880,200 L 840,210 L 790,212 L 740,205 L 690,192 L 645,175 L 610,155 L 585,130 L 572,105 L 568,88 Z" />
                
                {/* China/East Asia */}
                <path d="M 720,140 L 760,135 L 800,142 L 830,155 L 845,175 L 845,195 L 830,210 L 800,218 L 765,218 L 735,208 L 715,188 L 710,165 L 715,148 Z" />
                
                {/* India */}
                <path d="M 650,210 L 675,205 L 695,212 L 710,230 L 715,255 L 708,278 L 690,292 L 668,295 L 650,285 L 645,260 L 648,235 L 650,218 Z" />
                
                {/* Southeast Asia */}
                <path d="M 720,240 L 745,238 L 765,248 L 775,268 L 768,285 L 750,290 L 730,283 L 720,265 Z" />
                
                {/* Indonesia/Malaysia */}
                <path d="M 750,295 L 770,293 L 790,300 L 800,315 L 795,328 L 778,333 L 758,328 L 748,315 Z" />
                
                {/* Japan */}
                <path d="M 865,165 L 877,160 L 885,170 L 883,190 L 873,200 L 863,195 L 862,178 Z" />
                
                {/* Australia */}
                <path d="M 750,330 L 790,325 L 830,335 L 860,355 L 870,380 L 865,405 L 845,420 L 810,425 L 770,420 L 745,400 L 738,370 L 745,345 Z" />
                
                {/* New Zealand */}
                <path d="M 920,385 L 930,380 L 935,395 L 930,410 L 922,412 L 918,397 Z" />
                <path d="M 925,418 L 933,415 L 937,428 L 932,440 L 924,440 L 922,427 Z" />
                
                {/* Antarctica */}
                <rect x="0" y="455" width="1000" height="45" />
              </g>
              
              {/* Grid overlay */}
              <g opacity="0.15" stroke={darkMode ? '#64748b' : '#94a3b8'} strokeWidth="0.5" fill="none" strokeDasharray="2,2">
                {[...Array(10)].map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
                ))}
                {[...Array(20)].map((_, i) => (
                  <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
                ))}
              </g>
            </svg>

            {allCities.map((city, idx) => {
              const pos = coordsToMapPosition(city.lat, city.lon);
              const isExtreme = extremes && Object.values(extremes).includes(city);
              const tempColor = getTempColor(city.temp);
              
              return (
                <div
                  key={idx}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <div className={`rounded-full transition-all ${
                    isExtreme 
                      ? 'w-4 h-4 bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50 ring-2 ring-white' 
                      : `w-3 h-3 ${tempColor} group-hover:w-4 group-hover:h-4 opacity-90 group-hover:opacity-100 shadow-md`
                  }`}></div>
                  
                  {(hoveredCity === city || isExtreme) && (
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 backdrop-blur-sm px-3 py-2 rounded-lg whitespace-nowrap text-xs font-semibold border z-10 shadow-xl ${
                      darkMode ? 'bg-black/90 border-gray-700 text-white' : 'bg-white/90 border-gray-300 text-gray-900'
                    }`}>
                      <div className="font-bold">{city.name}</div>
                      <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(city.temp)}°C</div>
                      {city.country && <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{city.country}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400 ring-2 ring-white"></div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>extreme location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>40°C+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>30-40°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>20-30°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>10-20°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>0-10°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>-10-0°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>-20--10°C</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-700"></div>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>below -20°C</span>
          </div>
        </div>
      </div>

      {extremes && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <QuickStat label="HOTTEST" value={`${Math.round(extremes.hottest.temp)}°C`} city={extremes.hottest.name} color="red" darkMode={darkMode} />
          <QuickStat label="COLDEST" value={`${Math.round(extremes.coldest.temp)}°C`} city={extremes.coldest.name} color="blue" darkMode={darkMode} />
          <QuickStat label="WINDIEST" value={`${Math.round(extremes.windiest.windSpeed)} m/s`} city={extremes.windiest.name} color="teal" darkMode={darkMode} />
          <QuickStat label="HUMID" value={`${Math.round(extremes.mostHumid.humidity)}%`} city={extremes.mostHumid.name} color="purple" darkMode={darkMode} />
        </div>
      )}
    </div>
  );
};

const QuickStat = ({ label, value, city, color, darkMode }) => (
  <div className={`bg-gradient-to-br from-${color}-600/20 to-${color}-600/20 border border-${color}-500/30 rounded-xl p-4`}>
    <div className={`text-${color}-400 text-xs font-bold mb-1`}>{label}</div>
    <div className="text-2xl font-black">{value}</div>
    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{city}</div>
  </div>
);

const LeaderboardView = ({ allCities, darkMode }) => {
  const categories = [
    { title: 'Hottest Cities', key: 'temp', unit: '°C', emoji: '🔥', sort: 'desc' },
    { title: 'Coldest Cities', key: 'temp', unit: '°C', emoji: '❄️', sort: 'asc' },
    { title: 'Windiest Cities', key: 'windSpeed', unit: ' m/s', emoji: '💨', sort: 'desc' },
    { title: 'Most Humid', key: 'humidity', unit: '%', emoji: '💧', sort: 'desc' },
    { title: 'Biggest Temp Swings', key: 'tempSwing', unit: '°C', emoji: '⚡', sort: 'desc' },
    { title: 'Most Rainfall', key: 'rainfall24h', unit: 'mm', emoji: '🌧️', sort: 'desc' },
  ];

  return (
    <div className="space-y-8">
      {categories.map(category => {
        const sorted = [...allCities].sort((a, b) => 
          category.sort === 'desc' ? b[category.key] - a[category.key] : a[category.key] - b[category.key]
        ).slice(0, 10);

        return (
          <div key={category.title} className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <span>{category.emoji}</span>
              {category.title}
            </h3>
            <div className="space-y-3">
              {sorted.map((city, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    idx === 0 ? 'bg-yellow-900/20 border border-yellow-700/50' : 
                    idx === 1 ? darkMode ? 'bg-gray-700/30' : 'bg-gray-200' :
                    idx === 2 ? darkMode ? 'bg-gray-800/30' : 'bg-gray-100' :
                    darkMode ? 'bg-gray-800/20 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-black ${
                      idx === 0 ? 'text-yellow-400' : 
                      idx === 1 ? 'text-gray-300' : 
                      idx === 2 ? 'text-orange-600' : 
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{city.name}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{city.country}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-black">
                    {Math.round(city[category.key])}{category.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const HistoryView = ({ records, darkMode }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8">
        <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          All-Time Records
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecordCard 
            title="Hottest Ever Recorded"
            value={`${records.hottestEver.temp}°C`}
            location={records.hottestEver.city}
            date={records.hottestEver.date}
            emoji="🔥"
          />
          <RecordCard 
            title="Coldest Ever Recorded"
            value={`${records.coldestEver.temp}°C`}
            location={records.coldestEver.city}
            date={records.coldestEver.date}
            emoji="❄️"
          />
          <RecordCard 
            title="Windiest Ever Recorded"
            value={`${records.windiestEver.speed} m/s`}
            location={records.windiestEver.city}
            date={records.windiestEver.date}
            emoji="💨"
          />
        </div>
      </div>

      <div className={`rounded-2xl p-8 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          This Month&apos;s Records
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MonthRecordCard 
            title="Hottest This Month"
            value={`${Math.round(records.hottestThisMonth.temp)}°C`}
            location={records.hottestThisMonth.name}
            emoji="🔥"
            color="red"
          />
          <MonthRecordCard 
            title="Coldest This Month"
            value={`${Math.round(records.coldestThisMonth.temp)}°C`}
            location={records.coldestThisMonth.name}
            emoji="❄️"
            color="blue"
          />
          <MonthRecordCard 
            title="Windiest This Month"
            value={`${Math.round(records.windiestThisMonth.windSpeed)} m/s`}
            location={records.windiestThisMonth.name}
            emoji="💨"
            color="teal"
          />
        </div>
      </div>
    </div>
  );
};

const RecordCard = ({ title, value, location, date, emoji }) => (
  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6">
    <div className="text-4xl mb-2">{emoji}</div>
    <div className="text-sm text-white/70 mb-2 uppercase tracking-wider font-bold">{title}</div>
    <div className="text-4xl font-black mb-2">{value}</div>
    <div className="text-lg font-bold text-white/90">{location}</div>
    <div className="text-sm text-white/60">{date}</div>
  </div>
);

const MonthRecordCard = ({ title, value, location, emoji, color }) => (
  <div className={`bg-${color}-900/20 border border-${color}-700/30 rounded-xl p-6`}>
    <div className="text-4xl mb-2">{emoji}</div>
    <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">{title}</div>
    <div className="text-4xl font-black mb-2">{value}</div>
    <div className="text-lg font-bold">{location}</div>
  </div>
);

const AlertsView = ({ alerts, darkMode }) => {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😎</div>
        <h3 className="text-2xl font-bold mb-2">All Clear!</h3>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>No extreme weather alerts right now</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map(alert => {
        const Icon = alert.icon;
        return (
          <div 
            key={alert.id}
            className={`bg-${alert.color}-900/20 border-2 border-${alert.color}-600/50 rounded-2xl p-6 flex items-start gap-4`}
          >
            <div className={`p-4 bg-${alert.color}-600/30 rounded-xl`}>
              <Icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-black">{alert.title}</h3>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {alert.time.toLocaleTimeString()}
                </span>
              </div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{alert.message}</p>
              <div className={`mt-4 inline-block px-3 py-1 bg-${alert.color}-600/30 rounded-lg text-sm font-bold uppercase`}>
                {alert.type}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ExtremeModal = ({ extreme, onClose, onShare, getVibeText, darkMode }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`rounded-3xl p-10 max-w-lg w-full border-2 relative ${
          darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl transition-colors text-2xl ${
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          ×
        </button>

        <div className="text-center space-y-6">
          <div>
            <div className={`text-sm font-bold uppercase tracking-widest mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {extreme.type === 'coldest' ? '❄️ COLDEST PLACE' : 
               extreme.type === 'windiest' ? '💨 WINDIEST PLACE' : 
               extreme.type === 'mostHumid' ? '💧 MOST HUMID PLACE' :
               extreme.type === 'biggestSwing' ? '⚡ BIGGEST TEMP SWING' :
               extreme.type === 'mostRain' ? '🌧️ MOST RAINFALL' :
               '📉 LOWEST PRESSURE'}
            </div>
            <div className="text-8xl font-black mb-4">
              {Math.round(extreme.stat)}{extreme.unit}
            </div>
            <div className="text-3xl font-bold mb-2">{extreme.name}</div>
            <div className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{extreme.country}</div>
          </div>

          <div className={`rounded-2xl p-6 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            <div className={`text-lg italic mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              &quot;{getVibeText(
                extreme.type === 'coldest' ? 'cold' : 
                extreme.type === 'windiest' ? 'wind' : 
                extreme.type === 'mostHumid' ? 'humidity' :
                extreme.type === 'biggestSwing' ? 'swing' :
                extreme.type === 'mostRain' ? 'rain' : null,
                extreme.stat
              )}&quot;
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
                <div className={`mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>latitude</div>
                <div className="font-bold">{extreme.lat.toFixed(2)}°</div>
              </div>
              <div className={`rounded-xl p-3 ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
                <div className={`mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>longitude</div>
                <div className="font-bold">{extreme.lon.toFixed(2)}°</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onShare(extreme, extreme.type, extreme.stat, extreme.unit)}
            className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Share2 className="w-6 h-6" />
            share this extreme
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherExtremesTracker;