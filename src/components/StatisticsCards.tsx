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
      value: `${avgTemp.toFixed(1)}°C`,
      detail: `Min: ${minTemp.toFixed(1)}°C | Max: ${maxTemp.toFixed(1)}°C`,
      icon: Thermometer,
      color: "text-data-orange",
      bgColor: "bg-data-orange/10"
    },
    {
      label: "Précipitations totales",
      value: `${totalPrecip.toFixed(0)} mm`,
      detail: `${data.filter(d => d.precipitation > 0).length} jours de pluie`,
      icon: CloudRain,
      color: "text-data-blue",
      bgColor: "bg-data-blue/10"
    },
    {
      label: "Humidité moyenne",
      value: `${avgHumidity.toFixed(0)}%`,
      detail: `Écart-type: ${Math.sqrt(data.reduce((acc, d) => acc + Math.pow(d.humidity - avgHumidity, 2), 0) / data.length).toFixed(1)}%`,
      icon: Droplets,
      color: "text-data-cyan",
      bgColor: "bg-data-cyan/10"
    },
    {
      label: "Vent moyen",
      value: `${(data.reduce((acc, d) => acc + d.windSpeed, 0) / data.length).toFixed(1)} km/h`,
      detail: `Max: ${Math.max(...data.map(d => d.windSpeed)).toFixed(0)} km/h`,
      icon: Wind,
      color: "text-data-green",
      bgColor: "bg-data-green/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <Card 
          key={idx} 
          className="p-6 shadow-[var(--shadow-data)] border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={cn("p-2.5 rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            <p className="text-3xl font-bold font-mono tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-mono">{stat.detail}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
