import fs from 'fs/promises';
import path from 'path';

// Define a City class with name and id properties
class City {
  constructor(public id: number, public name: string) {}
}

// Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, '../../searchHistory.json');
  }

  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  public async getCities(): Promise<City[]> {
    return this.read();
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  public async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(Date.now(), cityName);
    cities.push(newCity);
    await this.write(cities);
  }

  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  public async removeCity(id: number): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
