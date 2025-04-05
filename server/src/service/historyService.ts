import { promises as fs } from 'fs';
import path from 'path';


// Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  private historyFilePath: string;
  private history: string[] = [];

  constructor() {
    // Assume searchHistory.json is located in the same directory as this file.
    this.historyFilePath = path.resolve(__dirname, 'searchHistory.json');
  }

  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.historyFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      // Map raw objects to City instances
      return parsed.map((item: any) => new City(item.id, item.name));
    } catch (error) {
      // If the file doesn't exist or an error occurs, return an empty array
      return [];
    }
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.historyFilePath, JSON.stringify(cities, null, 2), 'utf-8');
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    // Generate a unique id (here using the current timestamp)
    const newCity = new City(Date.now().toString(), cityName);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<City> {
    const cities = await this.read();
    const index = cities.findIndex(city => city.id === id);
    if (index === -1) {
      throw new Error('City not found');
    }
    const removedCity = cities.splice(index, 1)[0];
    await this.write(cities);
    return removedCity;
  }

  public addCityToHistory(city: string): void {
    this.history.push(city);
  }

  public getHistory(): string[] {
    return this.history;
  }

  public deleteCityFromHistory(id: number): string | null {
    // For example purposes, treat id as an index
    if (id < 0 || id >= this.history.length) {
      return null;
    }
    return this.history.splice(id, 1)[0];
  }
}

export default new HistoryService();
export function addCityToHistory(city: string): void {
  const historyService = new HistoryService();
  historyService.addCityToHistory(city);
}

export function getHistory() {
  throw new Error('Function not implemented.');
}

export function deleteCityFromHistory(id: number): string | null {
  const historyService = new HistoryService();
  return historyService.deleteCityFromHistory(id);
}

import historyService from './historyService';

await historyService.addCity('New York');



