import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public icon: string
  ) {}
}

// Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseUrl: string = 'https://api.openweathermap.org';
  private apiKey: string = process.env.WEATHER_API_KEY || '';
  city!: string;
  // Removed unused 'city' property

  // Create fetchLocationData method: fetches location (geocoding) data for the given query
  private async fetchLocationData(query: string): Promise<any> {
    const geocodeUrl = this.buildGeocodeQuery(query);
    const response = await fetch(geocodeUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    return data;
  }

  // Create destructureLocationData method: extracts coordinates from the returned data
  private destructureLocationData(locationData: any): Coordinates {
    if (!Array.isArray(locationData) || locationData.length === 0) {
      throw new Error('No location data found');
    }
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  // Create buildGeocodeQuery method: constructs the URL for the geocoding API request
  private buildGeocodeQuery(query: string): string {
    return `${this.baseUrl}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method: constructs the URL for the weather API request
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseUrl}/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method: fetches and extracts coordinates for a given city
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method: fetches weather data using the coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherUrl = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  }

  // Build parseCurrentWeather method: extracts current weather details from the API response
  private parseCurrentWeather(response: any): Weather {
    const current = response.current;
    return new Weather(
      current.temp,
      current.weather[0].description,
      current.weather[0].icon
    );
  }

  // Complete buildForecastArray method: maps the daily forecast data into an array of Weather objects
  private buildForecastArray(weatherData: any): Weather[] {
    return weatherData.daily.map((day: any) => {
      return new Weather(
        day.temp.day,
        day.weather[0].description,
        day.weather[0].icon
      );
    });
  }

  // Complete getWeatherForCity method: orchestrates the fetching and processing of weather data for a city
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    this.city = city;
    // Fetch location coordinates based on the city name
    const coordinates = await this.fetchAndDestructureLocationData(city);
    // Fetch weather data using the coordinates
    const weatherData = await this.fetchWeatherData(coordinates);
    // Parse current weather from the response
    const currentWeather = this.parseCurrentWeather(weatherData);
    // Build forecast array from the daily data
    const forecast = this.buildForecastArray(weatherData);
    return { current: currentWeather, forecast };
  }

  public async getWeatherData(city: string): Promise<any> {
    // Example implementation: fetch weather data for the given city
    // You might want to use your fetchLocationData and then make another API call.
    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);
    // Call OpenWeather API with coordinates and return result
    const weatherUrl = `${this.baseUrl}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  }

 
}

const city = 'New York';
console.log(`Current city: ${city}`);

export default new WeatherService();
