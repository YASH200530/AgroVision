import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  location: string;
}

export default function WeatherBar() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      const savedWeather = localStorage.getItem('weather_data');
      const savedTime = localStorage.getItem('weather_time');

      if (savedWeather && savedTime) {
        const timeDiff = Date.now() - parseInt(savedTime);
        if (timeDiff < 300000) {
          setWeather(JSON.parse(savedWeather));
          setLoading(false);
          return;
        }
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const mockWeather: WeatherData = {
              temperature: Math.round(25 + Math.random() * 10),
              humidity: Math.round(60 + Math.random() * 30),
              rainfall: Math.round(Math.random() * 50),
              windSpeed: Math.round(5 + Math.random() * 15),
              location: 'Your Location'
            };

            setWeather(mockWeather);
            localStorage.setItem('weather_data', JSON.stringify(mockWeather));
            localStorage.setItem('weather_time', Date.now().toString());
            setLoading(false);
            setError(false);
          },
          () => {
            const defaultWeather: WeatherData = {
              temperature: 28,
              humidity: 70,
              rainfall: 10,
              windSpeed: 12,
              location: 'India'
            };
            setWeather(defaultWeather);
            setLoading(false);
          }
        );
      } else {
        const defaultWeather: WeatherData = {
          temperature: 28,
          humidity: 70,
          rainfall: 10,
          windSpeed: 12,
          location: 'India'
        };
        setWeather(defaultWeather);
        setLoading(false);
      }
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/90 border-b-2 border-gray-700/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-agri-400"></div>
            <span className="ml-2 text-gray-400 text-sm">Loading weather...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <div className="bg-gray-800/90 backdrop-blur-md border-b-2 border-gray-700/50 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Cloud className="w-4 h-4 text-agri-400" />
            <span className="font-medium">{weather.location}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Thermometer className="w-4 h-4 text-red-400" />
            <span className="font-medium">{weather.temperature}°C</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="font-medium">{weather.humidity}% Humidity</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Cloud className="w-4 h-4 text-indigo-400" />
            <span className="font-medium">{weather.rainfall}mm Rainfall</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Wind className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">{weather.windSpeed} km/h</span>
          </div>

          <div className="text-xs text-gray-500 italic">
            Weather affects disease likelihood
          </div>
        </div>
      </div>
    </div>
  );
}
