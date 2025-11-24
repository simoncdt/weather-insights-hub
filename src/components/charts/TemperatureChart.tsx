import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { WeatherData } from "@/lib/weatherApi";
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
    <Card className="p-4 sm:p-6 shadow-[var(--shadow-card)] border-border">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold mb-1">Température</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Moyenne mobile 7 jours</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
            tickLine={false}
            width={35}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.75rem',
              fontSize: '11px',
              padding: '8px 12px'
            }}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          <Area 
            type="monotone" 
            dataKey="temperature" 
            stroke="hsl(var(--data-temp))" 
            strokeWidth={2.5}
            fill="hsl(var(--data-temp))"
            fillOpacity={0.1}
          />
          <Line 
            type="monotone" 
            dataKey="ma7" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
