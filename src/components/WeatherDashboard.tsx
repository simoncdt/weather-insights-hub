import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, TrendingUp, Loader2 } from "lucide-react";
import { format, subDays, subYears } from "date-fns";
import { cn } from "@/lib/utils";
import { TemperatureChart } from "./charts/TemperatureChart";
import { PrecipitationChart } from "./charts/PrecipitationChart";
import { StatisticsCards } from "./StatisticsCards";
import { CorrelationChart } from "./charts/CorrelationChart";
import { fetchWeatherData, CANADIAN_CITIES, WeatherData } from "@/lib/weatherApi";
import { useToast } from "@/hooks/use-toast";

export const WeatherDashboard = () => {
  const [selectedCity, setSelectedCity] = useState(CANADIAN_CITIES[0].name);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 90),
    to: subDays(new Date(), 1) // API has 5-day delay for archive data
  });
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadWeatherData = async () => {
      setIsLoading(true);
      try {
        const city = CANADIAN_CITIES.find(c => c.name === selectedCity);
        if (!city) return;
        
        const data = await fetchWeatherData(city, dateRange.from, dateRange.to);
        setWeatherData(data);
        
        toast({
          title: "Données chargées",
          description: `${data.length} jours de données météo pour ${selectedCity}`,
        });
      } catch (error) {
        console.error('Error loading weather data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données météo. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWeatherData();
  }, [selectedCity, dateRange, toast]);

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
                <h1 className="text-2xl font-bold tracking-tight">Météo Analytics Canada</h1>
                <p className="text-sm text-muted-foreground font-mono">Données réelles Open-Meteo API</p>
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
                  {CANADIAN_CITIES.map(city => (
                    <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
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

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
              <p className="text-muted-foreground font-mono">Chargement des données météo...</p>
            </div>
          </div>
        ) : weatherData.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Aucune donnée disponible pour cette période</p>
          </div>
        )}
      </main>
    </div>
  );
};
