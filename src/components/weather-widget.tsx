import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from '@/components/ui';
import {Cloud, CloudRain, Sun, Wind, RefreshCw} from '@/components/ui/icons';

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);

    try {
      // Using New York coordinates as default; you can make this dynamic
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=4.1755&longitude=73.5093&current_weather=true',
      );

      if (!response.ok) throw new Error('Failed to fetch weather');

      const data = await response.json();
      setWeather(data.current_weather);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return Sun;
    if (code === 2 || code === 3) return Cloud;
    return CloudRain;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code === 1) return 'Mainly Clear';
    if (code === 2) return 'Partly Cloudy';
    if (code === 3) return 'Overcast';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    return 'Cloudy';
  };

  // Determine gradient based on weather
  const getGradientColors = () => {
    if (!weather) return 'from-blue-400 to-blue-600';

    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;

    if (isNight) return 'from-indigo-900 to-purple-900';
    if (weather.weathercode === 0 || weather.weathercode === 1) {
      return 'from-amber-400 via-orange-400 to-pink-500';
    }
    if (weather.weathercode >= 51) {
      return 'from-gray-500 to-blue-600';
    }
    return 'from-blue-400 to-cyan-500';
  };

  if (loading) {
    return (
      <View className="rounded-3xl p-6 mb-4 shadow-lg bg-purple-600">
        <View className="items-center justify-center h-24">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white/80 mt-2 text-sm">Loading weather...</Text>
        </View>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View className="rounded-3xl p-6 mb-4 shadow-lg bg-gray-700">
        <View className="items-center justify-center">
          <Cloud color="#FFFFFF" width={32} height={32} />
          <Text className="text-white text-lg font-semibold mt-2">
            Weather Unavailable
          </Text>
          <Text className="text-white/70 text-sm mt-1">
            Unable to fetch weather data
          </Text>
          <View className="mt-4">
            <View
              className="bg-white/20 rounded-full px-4 py-2 flex-row items-center"
              onTouchEnd={fetchWeather}>
              <RefreshCw color="#FFFFFF" width={16} height={16} />
              <Text className="text-white font-medium ml-2">Retry</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.weathercode);

  return (
    <View className="rounded-3xl p-6 mb-4 shadow-lg bg-purple-600">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <WeatherIcon color="#FFFFFF" width={40} height={40} />
            <View className="ml-3">
              <Text className="text-white text-5xl font-bold">
                {Math.round(weather.temperature)}°
              </Text>
            </View>
          </View>
          <Text className="text-white text-lg font-semibold">
            {getWeatherDescription(weather.weathercode)}
          </Text>
          <View className="flex-row items-center mt-2">
            <Wind color="#FFFFFF" width={16} height={16} />
            <Text className="text-white/90 ml-2 text-sm">
              {Math.round(weather.windspeed)} km/h
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-white/80 text-sm">Maldives</Text>
          <Text className="text-white/60 text-xs mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};
