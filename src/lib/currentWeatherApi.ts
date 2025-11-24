import { City } from "./weatherApi";

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
  time: string;
}

// WMO Weather interpretation codes
const weatherCodeDescriptions: { [key: number]: string } = {
  0: "Ciel dégagé",
  1: "Principalement dégagé",
  2: "Partiellement nuageux",
  3: "Couvert",
  45: "Brouillard",
  48: "Brouillard givrant",
  51: "Bruine légère",
  53: "Bruine modérée",
  55: "Bruine dense",
  61: "Pluie légère",
  63: "Pluie modérée",
  65: "Pluie forte",
  71: "Neige légère",
  73: "Neige modérée",
  75: "Neige forte",
  77: "Grains de neige",
  80: "Averses légères",
  81: "Averses modérées",
  82: "Averses violentes",
  85: "Averses de neige légères",
  86: "Averses de neige fortes",
  95: "Orage",
  96: "Orage avec grêle légère",
  99: "Orage avec grêle forte"
};

export const getWeatherDescription = (code: number): string => {
  return weatherCodeDescriptions[code] || "Inconnu";
};

export const fetchCurrentWeather = async (city: City): Promise<CurrentWeather> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`;
    
    console.log('Fetching current weather:', city.name);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.current) {
      throw new Error('Invalid API response');
    }
    
    const currentWeather: CurrentWeather = {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      time: data.current.time,
    };
    
    console.log('Current weather fetched:', currentWeather);
    
    return currentWeather;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};
