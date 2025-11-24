import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { WeatherData } from "@/lib/weatherApi";
import { format } from "date-fns";

interface PrecipitationChartProps {
  data: WeatherData[];
  city: string;
}

export const PrecipitationChart = ({ data, city }: PrecipitationChartProps) => {
  const chartData = data.map(d => ({
    date: format(new Date(d.date), "dd/MM"),
    precipitation: d.precipitation,
  }));

  return (
    <Card className="p-6 shadow-[var(--shadow-data)] border-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Précipitations quotidiennes</h3>
        <p className="text-sm text-muted-foreground font-mono">{city} • Distribution des pluies</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
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
            label={{ value: 'mm', angle: -90, position: 'insideLeft', style: { fontSize: 11, fontFamily: 'IBM Plex Mono' } }}
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
          <Bar 
            dataKey="precipitation" 
            fill="hsl(var(--data-blue))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
