import React, {useEffect, useState} from 'react';
import {View, Text} from '@/components/ui';

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    // Example coordinates (New York)
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current_weather=true',
    )
      .then(res => res.json())
      .then(data => setWeather(data.current_weather))
      .catch(err => console.error(err));
  }, []);

  if (!weather) return null;

  return (
    <View className="p-4 bg-blue-500 rounded-lg mb-4 shadow-md">
      <Text className="text-white text-lg font-bold">Current Weather</Text>
      <View className="flex-row items-end">
        <Text className="text-white text-4xl font-bold">
          {weather.temperature}°C
        </Text>
        <Text className="text-white ml-4 mb-1">
          Wind: {weather.windspeed} km/h
        </Text>
      </View>
    </View>
  );
};
