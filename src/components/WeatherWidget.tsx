
import React, { useEffect, useState } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Loader } from 'lucide-react';

interface WeatherData {
  location: string;
  currentTemp: number;
  forecast: {
    day: string;
    icon: React.ReactNode;
    temp: number;
  }[];
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching weather data for Hyderabad
    // In a real app, you would fetch this from an API
    setTimeout(() => {
      setWeather({
        location: 'Hyderabad',
        currentTemp: 32, // Always hot in Hyderabad!
        forecast: [
          { day: 'WED', icon: <CloudRain size={22} />, temp: 31 },
          { day: 'THU', icon: <Cloud size={22} />, temp: 33 },
          { day: 'FRI', icon: <Sun size={22} />, temp: 35 },
          { day: 'SAT', icon: <Sun size={22} />, temp: 34 },
          { day: 'SUN', icon: <CloudDrizzle size={22} />, temp: 30 },
        ],
      });
      setLoading(false);
    }, 1500);
  }, []);

  // Map weather condition to icon
  const getWeatherIcon = (temp: number) => {
    if (temp > 30) return <Sun className="text-yellow-400" size={48} />;
    if (temp > 20) return <Sun className="text-yellow-400" size={48} />;
    if (temp > 10) return <Cloud className="text-gray-400" size={48} />;
    if (temp <= 0) return <CloudSnow className="text-blue-200" size={48} />;
    return <Cloud className="text-gray-400" size={48} />;
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-center text-white min-h-[220px]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 text-white min-h-[220px]">
        <p>Weather data unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">
      <div className="p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {getWeatherIcon(weather.currentTemp)}
            <span className="text-white mt-2">{weather.location}</span>
          </div>
          <div className="text-8xl font-medium text-white">
            {weather.currentTemp}°
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center bg-slate-800 p-2">
        {weather.forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center px-2 py-1">
            <span className="text-gray-300 text-sm mb-2">{day.day}</span>
            <div className="text-gray-300">
              {day.icon}
            </div>
            <span className="text-white text-sm mt-2">{day.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
