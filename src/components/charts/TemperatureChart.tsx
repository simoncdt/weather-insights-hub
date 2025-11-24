import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { WeatherData } from "@/lib/weatherData";
import { format } from "date-fns";

interface TemperatureChartProps {
  data: WeatherData[];
  city: string;
}

export const TemperatureChart = ({ data, city }: TemperatureChartProps) => {
  // Calculate moving average
  const movingAverage = (arr: number[], windowSize: number) => {
    return arr.map((_, idx, array) => {
      const start = Math.max(0, idx - Math.floor(windowSize / 2));
      const end = Math.min(array.length, idx + Math.ceil(windowSize / 2));
      const subset = array.slice(start, end);
      return subset.reduce((a, b) => a + b, 0) / subset.length;
    });
  };

  const temps = data.map(d => d.temperature);
  const ma7 = movingAverage(temps, 7);

  const chartData = data.map((d, idx) => ({
    date: format(new Date(d.date), "dd/MM"),
    temperature: d.temperature,
    ma7: ma7[idx]
  }));

  return (
    <Card className="p-6 shadow-[var(--shadow-data)] border-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Évolution de la température</h3>
        <p className="text-sm text-muted-foreground font-mono">{city} • Tendance avec moyenne mobile 7j</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--data-orange))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--data-orange))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            label={{ value: '°C', angle: -90, position: 'insideLeft', style: { fontSize: 11, fontFamily: 'IBM Plex Mono' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              fontFamily: 'IBM Plex Mono',
              fontSize: '12px'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="temperature" 
            stroke="hsl(var(--data-orange))" 
            strokeWidth={2}
            fill="url(#colorTemp)"
          />
          <Line 
            type="monotone" 
            dataKey="ma7" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
