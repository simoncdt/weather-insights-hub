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
    <Card className="p-6 shadow-[var(--shadow-data)] border-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Analyse de corrélation : Température vs Humidité</h3>
        <p className="text-sm text-muted-foreground font-mono">
          {city} • Coefficient de Pearson: {correlation.toFixed(3)} • Taille des points = précipitations
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            type="number"
            dataKey="temperature"
            name="Température"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            label={{ value: 'Température (°C)', position: 'insideBottom', offset: -5, style: { fontSize: 11, fontFamily: 'IBM Plex Mono' } }}
          />
          <YAxis 
            type="number"
            dataKey="humidity"
            name="Humidité"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            label={{ value: 'Humidité (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fontFamily: 'IBM Plex Mono' } }}
          />
          <ZAxis type="number" dataKey="size" range={[20, 400]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              fontFamily: 'IBM Plex Mono',
              fontSize: '12px'
            }}
            formatter={(value: any, name: string) => {
              if (name === 'precipitation') return [`${value.toFixed(1)} mm`, 'Précipitations'];
              if (name === 'temperature') return [`${value.toFixed(1)}°C`, 'Température'];
              if (name === 'humidity') return [`${value.toFixed(0)}%`, 'Humidité'];
              return value;
            }}
          />
          <Scatter 
            data={chartData} 
            fill="hsl(var(--accent))"
            fillOpacity={0.6}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
};
