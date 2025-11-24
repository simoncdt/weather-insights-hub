export interface WeatherData {
  date: string;
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export const CANADIAN_CITIES: City[] = [
  { name: "Toronto", latitude: 43.65, longitude: -79.38 },
  { name: "Montréal", latitude: 45.50, longitude: -73.57 },
  { name: "Vancouver", latitude: 49.28, longitude: -123.12 },
  { name: "Calgary", latitude: 51.05, longitude: -114.07 },
  { name: "Ottawa", latitude: 45.42, longitude: -75.70 },
  { name: "Edmonton", latitude: 53.55, longitude: -113.47 },
  { name: "Québec", latitude: 46.81, longitude: -71.21 },
  { name: "Winnipeg", latitude: 49.90, longitude: -97.14 },
  { name: "Halifax", latitude: 44.65, longitude: -63.58 },
];

export const fetchWeatherData = async (
  city: City,
  startDate: Date,
  endDate: Date
): Promise<WeatherData[]> => {
  try {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    // Open-Meteo API - Free, no API key required
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${city.latitude}&longitude=${city.longitude}&start_date=${start}&end_date=${end}&daily=temperature_2m_mean,precipitation_sum,relative_humidity_2m_mean,wind_speed_10m_max&timezone=auto`;
    
    console.log('Fetching weather data:', { city: city.name, start, end });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.daily) {
      throw new Error('Invalid API response');
    }
    
    const weatherData: WeatherData[] = data.daily.time.map((date: string, index: number) => ({
      date,
      temperature: data.daily.temperature_2m_mean[index] || 0,
      precipitation: data.daily.precipitation_sum[index] || 0,
      humidity: data.daily.relative_humidity_2m_mean[index] || 0,
      windSpeed: data.daily.wind_speed_10m_max[index] || 0,
    }));
    
    console.log(`Successfully fetched ${weatherData.length} days of data`);
    
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
