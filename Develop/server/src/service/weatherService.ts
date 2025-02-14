import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  constructor(
    public date: string,
    public icon: string,
    public temperature: number,
    public windSpeed: number,
    public humidity: number
  ) {}
}

// Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor(cityName: string) {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.API_KEY || 'YOUR_API_KEY'; // Replace with your actual OpenWeatherMap API key
    this.cityName = cityName;
  }

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(query);
    return response.json();
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData.coord;
    return { lat, lon };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/weather?q=${this.cityName}&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const geocodeQuery = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(geocodeQuery);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const weatherData = await this.fetchLocationData(weatherQuery);
    return weatherData;
  }

  // Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [];
    for (let i = 0; i < weatherData.length; i += 8) { // Loop through the weather data list, taking every 8th item
      const weather = weatherData[i];
      forecastArray.push(
        new Weather(
          new Date(weather.dt * 1000).toLocaleDateString(),
          weather.weather[0].icon,
          weather.main.temp,
          weather.wind.speed,
          weather.main.humidity
        )
      );
    }
    return forecastArray;
  }

  // Public method to get weather forecast
  public async getWeatherForecast(): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.buildForecastArray(weatherData.list);
  }
}

export default WeatherService;
