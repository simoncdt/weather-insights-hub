import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2, MapPin } from "lucide-react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { TemperatureChart } from "./charts/TemperatureChart";
import { PrecipitationChart } from "./charts/PrecipitationChart";
import { StatisticsCards } from "./StatisticsCards";
import { CorrelationChart } from "./charts/CorrelationChart";
import { fetchWeatherData, CANADIAN_CITIES, WeatherData } from "@/lib/weatherApi";
import { fetchCurrentWeather, CurrentWeather } from "@/lib/currentWeatherApi";
import { CurrentWeatherCard } from "./CurrentWeatherCard";
import { useToast } from "@/hooks/use-toast";

export const WeatherDashboard = () => {
  const [selectedCity, setSelectedCity] = useState(CANADIAN_CITIES[0].name);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 90),
    to: subDays(new Date(), 1)
  });
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadWeatherData = async () => {
      setIsLoading(true);
      try {
        const city = CANADIAN_CITIES.find(c => c.name === selectedCity);
        if (!city) return;
        
        const [historicalData, current] = await Promise.all([
          fetchWeatherData(city, dateRange.from, dateRange.to),
          fetchCurrentWeather(city)
        ]);
        
        setWeatherData(historicalData);
        setCurrentWeather(current);
        
        toast({
          title: "Données chargées",
          description: `Météo actuelle et ${historicalData.length} jours d'historique`,
        });
      } catch (error) {
        console.error('Error loading weather data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données météo.",
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
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-[var(--shadow-card)]">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Météo Canada</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Données en temps réel</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
        {/* Current Weather */}
        <CurrentWeatherCard weather={currentWeather} city={selectedCity} />
        
        {/* Filters */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6 shadow-[var(--shadow-card)]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Ville</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-12 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CANADIAN_CITIES.map(city => (
                    <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block text-foreground">Période historique</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Sélectionner</span>
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
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
          </div>
        ) : weatherData.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            <StatisticsCards data={weatherData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <TemperatureChart data={weatherData} city={selectedCity} />
              <PrecipitationChart data={weatherData} city={selectedCity} />
            </div>
            <CorrelationChart data={weatherData} city={selectedCity} />
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Aucune donnée</p>
          </div>
        )}
      </main>
    </div>
  );
};
