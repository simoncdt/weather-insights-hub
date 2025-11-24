export interface WeatherData {
  date: string;
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

// Seeded random number generator for consistent data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateWeatherData = (city: string, startDate: Date, endDate: Date): WeatherData[] => {
  const data: WeatherData[] = [];
  const citySeeds: { [key: string]: number } = {
    "Paris": 1000,
    "Lyon": 2000,
    "Marseille": 3000,
    "Toulouse": 4000,
    "Nice": 5000,
    "Bordeaux": 6000,
    "Lille": 7000
  };
  
  const baseSeed = citySeeds[city] || 1000;
  let currentDate = new Date(startDate);
  let index = 0;

  while (currentDate <= endDate) {
    const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 86400000);
    const seasonalTempOffset = 15 * Math.sin((dayOfYear / 365) * 2 * Math.PI - Math.PI / 2);
    
    const seed = baseSeed + index;
    const tempNoise = (seededRandom(seed) - 0.5) * 10;
    const temperature = 15 + seasonalTempOffset + tempNoise;
    
    const precipProb = seededRandom(seed + 10000);
    const precipitation = precipProb > 0.7 ? seededRandom(seed + 20000) * 25 : 0;
    
    const humidity = 50 + (seededRandom(seed + 30000) * 40) + (precipitation > 0 ? 10 : 0);
    
    const windSpeed = 5 + seededRandom(seed + 40000) * 40;

    data.push({
      date: currentDate.toISOString().split('T')[0],
      temperature: parseFloat(temperature.toFixed(1)),
      precipitation: parseFloat(precipitation.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(0)),
      windSpeed: parseFloat(windSpeed.toFixed(1))
    });

    currentDate = new Date(currentDate.getTime() + 86400000);
    index++;
  }

  return data;
};
