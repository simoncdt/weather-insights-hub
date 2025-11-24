import { Card } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, CloudRain } from "lucide-react";
import { CurrentWeather, getWeatherDescription } from "@/lib/currentWeatherApi";

interface CurrentWeatherCardProps {
  weather: CurrentWeather | null;
  city: string;
}

export const CurrentWeatherCard = ({ weather, city }: CurrentWeatherCardProps) => {
  if (!weather) return null;

  const weatherDesc = getWeatherDescription(weather.weatherCode);

  return (
    <Card className="p-6 mb-6 bg-primary text-primary-foreground shadow-[var(--shadow-elevated)] border-0">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium opacity-90 mb-1">Maintenant à {city}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold tracking-tight">{Math.round(weather.temperature)}°</span>
            <span className="text-lg opacity-75">{weatherDesc}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary-foreground/20">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 opacity-75" />
            <div>
              <p className="text-xs opacity-75">Humidité</p>
              <p className="text-sm font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 opacity-75" />
            <div>
              <p className="text-xs opacity-75">Vent</p>
              <p className="text-sm font-semibold">{Math.round(weather.windSpeed)} km/h</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CloudRain className="h-4 w-4 opacity-75" />
            <div>
              <p className="text-xs opacity-75">Pluie</p>
              <p className="text-sm font-semibold">{weather.precipitation} mm</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
