import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define an interface for the WeatherData object
export interface WeatherData {
  city: string;
  date: string;
  weather: { icon: string; description: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
}

// Define a class for the Weather object
export class Weather {
  constructor(
    public city: string,
    public date: string,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number
  ) {}
}

// Complete the WeatherService class
export default class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseUrl: string = 'https://api.openweathermap.org';
  private apiKey: string = process.env.WEATHER_API_KEY || '';
  city!: string;

  // Fetches location (geocoding) data for the given query
  private async fetchLocationData(query: string): Promise<any> {
    const geocodeUrl = this.buildGeocodeQuery(query);
    console.log('Geocode URL:', geocodeUrl);
    const response = await fetch(geocodeUrl);
    if (!response.ok) {
      console.error(response);
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  }

  // Extracts coordinates from the returned data
  private destructureLocationData(locationData: any): Coordinates {
    if (!Array.isArray(locationData) || locationData.length === 0) {
      throw new Error('No location data found');
    }
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  // Constructs the URL for the geocoding API request
  private buildGeocodeQuery(query: string): string {
    return `${this.baseUrl}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&&appid=${this.apiKey}`;
  }

  // (Removed unused buildWeatherQuery method)

  // Create fetchAndDestructureLocationData method: fetches and extracts coordinates for a given city
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method: fetches weather data using the coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherUrl = `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    return response.json();
  }

  // Build parseCurrentWeather method: extracts current weather details from the API response
  private parseCurrentWeather(response: any): Weather {
    //console.log(response);
    const current = response.list[0];
    return new Weather(
      this.city,
      current.dt_txt,
      current.weather[0].icon,
      current.weather[0].description,
      current.main.temp,
      current.wind.speed,
      current.main.humidity
    );
  }

  // Complete buildForecastArray method: maps the daily forecast data into an array of Weather objects
  private buildForecastArray(currentWeather: Weather, weatherData: any): Weather[] {
    //console.log('Weather Data:', weatherData);

    // Filter the forecast to include only one entry per day (e.g., at 12:00:00)
    const dailyForecast = weatherData.list.filter((entry: any) => entry.dt_txt.includes('12:00:00'));

    const forecast = dailyForecast.map((day: any) => {
      return new Weather(
        this.city,
        day.dt_txt,
        day.weather[0].icon,
        day.weather[0].description,
        day.main.temp,
        day.wind.speed,
        day.main.humidity
      );
    });

    return [currentWeather, ...forecast];
  }

  // Complete getWeatherForCity method: orchestrates the fetching and processing of weather data for a city
  static async getWeatherForCity(city: string): Promise<Weather[]> {
    const service = new WeatherService(); // Create an instance to access instance properties
    service.city = city;
    const coordinates = await service.fetchAndDestructureLocationData(city);
    const weatherData = await service.fetchWeatherData(coordinates);
    const currentWeather = service.parseCurrentWeather(weatherData);
    return service.buildForecastArray(currentWeather, weatherData);
  }
}

