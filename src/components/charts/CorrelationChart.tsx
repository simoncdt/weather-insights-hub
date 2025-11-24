import { Card } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { WeatherData } from "@/lib/weatherApi";

interface CorrelationChartProps {
  data: WeatherData[];
  city: string;
}

export const CorrelationChart = ({ data, city }: CorrelationChartProps) => {
  const chartData = data.map(d => ({
    temperature: d.temperature,
    humidity: d.humidity,
    precipitation: d.precipitation,
    size: Math.max(d.precipitation * 3, 20)
  }));

  // Calculate correlation coefficient
  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);
    
    return (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  };

  const temps = data.map(d => d.temperature);
  const humidities = data.map(d => d.humidity);
  const correlation = calculateCorrelation(temps, humidities);

  return (
    <Card className="p-4 sm:p-6 shadow-[var(--shadow-card)] border-border">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold mb-1">Corrélation</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Température vs Humidité • r = {correlation.toFixed(3)}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            type="number"
            dataKey="temperature"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
            tickLine={false}
          />
          <YAxis 
            type="number"
            dataKey="humidity"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
            tickLine={false}
            width={35}
          />
          <ZAxis type="number" dataKey="size" range={[20, 300]} />
          <Tooltip 
            cursor={{ strokeDasharray: '2 4' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.75rem',
              fontSize: '11px',
              padding: '8px 12px'
            }}
            formatter={(value: any, name: string) => {
              if (name === 'precipitation') return [`${value.toFixed(1)} mm`, 'Pluie'];
              if (name === 'temperature') return [`${value.toFixed(1)}°C`, 'Temp'];
              if (name === 'humidity') return [`${value.toFixed(0)}%`, 'Humid'];
              return value;
            }}
          />
          <Scatter 
            data={chartData} 
            fill="hsl(var(--primary))"
            fillOpacity={0.5}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
};
