import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, TrendingUp, CloudRain, Thermometer, Wind } from "lucide-react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { TemperatureChart } from "./charts/TemperatureChart";
import { PrecipitationChart } from "./charts/PrecipitationChart";
import { StatisticsCards } from "./StatisticsCards";
import { CorrelationChart } from "./charts/CorrelationChart";
import { generateWeatherData } from "@/lib/weatherData";

const CITIES = [
  "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Bordeaux", "Lille"
];

export const WeatherDashboard = () => {
  const [selectedCity, setSelectedCity] = useState("Paris");
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 90),
    to: new Date()
  });

  const weatherData = generateWeatherData(selectedCity, dateRange.from, dateRange.to);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Météo Analytics</h1>
                <p className="text-sm text-muted-foreground font-mono">Advanced Weather Trends Visualizer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="p-6 mb-8 shadow-[var(--shadow-data)] border-border/50">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Ville</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[250px]">
              <label className="text-sm font-medium mb-2 block">Période d'analyse</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Sélectionner une période</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => range && setDateRange(range as any)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <StatisticsCards data={weatherData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TemperatureChart data={weatherData} city={selectedCity} />
          <PrecipitationChart data={weatherData} city={selectedCity} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <CorrelationChart data={weatherData} city={selectedCity} />
        </div>
      </main>
    </div>
  );
};
