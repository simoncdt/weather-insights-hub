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
    <Card className="p-4 sm:p-6 shadow-[var(--shadow-card)] border-border">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold mb-1">Précipitations</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Distribution quotidienne</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData}>
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
          <Bar 
            dataKey="precipitation" 
            fill="hsl(var(--data-precip))"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
