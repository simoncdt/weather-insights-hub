import { Card } from "@/components/ui/card";
import { Thermometer, CloudRain, Droplets, Wind } from "lucide-react";
import { WeatherData } from "@/lib/weatherApi";

interface StatisticsCardsProps {
  data: WeatherData[];
}

export const StatisticsCards = ({ data }: StatisticsCardsProps) => {
  const avgTemp = data.reduce((acc, d) => acc + d.temperature, 0) / data.length;
  const maxTemp = Math.max(...data.map(d => d.temperature));
  const minTemp = Math.min(...data.map(d => d.temperature));
  const totalPrecip = data.reduce((acc, d) => acc + d.precipitation, 0);
  const avgHumidity = data.reduce((acc, d) => acc + d.humidity, 0) / data.length;

  const stats = [
    {
      label: "Température moyenne",
      value: `${avgTemp.toFixed(1)}°`,
      detail: `${minTemp.toFixed(1)}° - ${maxTemp.toFixed(1)}°`,
      icon: Thermometer,
      color: "text-data-temp"
    },
    {
      label: "Précipitations",
      value: `${totalPrecip.toFixed(0)} mm`,
      detail: `${data.filter(d => d.precipitation > 0).length} jours`,
      icon: CloudRain,
      color: "text-data-precip"
    },
    {
      label: "Humidité moyenne",
      value: `${avgHumidity.toFixed(0)}%`,
      detail: `±${Math.sqrt(data.reduce((acc, d) => acc + Math.pow(d.humidity - avgHumidity, 2), 0) / data.length).toFixed(1)}%`,
      icon: Droplets,
      color: "text-data-humidity"
    },
    {
      label: "Vent moyen",
      value: `${(data.reduce((acc, d) => acc + d.windSpeed, 0) / data.length).toFixed(1)} km/h`,
      detail: `Max ${Math.max(...data.map(d => d.windSpeed)).toFixed(0)} km/h`,
      icon: Wind,
      color: "text-data-wind"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, idx) => (
        <Card 
          key={idx} 
          className="p-4 sm:p-5 shadow-[var(--shadow-card)] border-border hover:shadow-[var(--shadow-elevated)] transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-muted">
              <stat.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.detail}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
