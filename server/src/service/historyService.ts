import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const searchHistoryFilePath = path.join(__dirname, '../data/searchHistory.json');
console.log('Search History File Path:', searchHistoryFilePath);

interface HistoryEntry {
  id: number;
  city: string;
  timestamp: string;
}

export default class HistoryService {
  // Read the search history from the file
  private async readHistory(): Promise<HistoryEntry[]> {
    try {
      const data = await fs.readFile(searchHistoryFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // Write the search history to the file
  private async writeHistory(history: HistoryEntry[]): Promise<void> {
    await fs.writeFile('../data/searchHistory.json', JSON.stringify(history, null, 2), 'utf-8');
  }

  // Get all search history
  public async getHistory(): Promise<HistoryEntry[]> {
    return await this.readHistory();
  }

  // Add a city to the search history
  public async addCityToHistory(city: string): Promise<void> {
    const history = await this.readHistory();
    const newEntry: HistoryEntry = {
      id: history.length > 0 ? history[history.length - 1].id + 1 : 1,
      city,
      timestamp: new Date().toISOString(),
    };
    history.push(newEntry);
    await this.writeHistory(history);
  }

  // Delete a city from the search history by its ID
  public async deleteCityFromHistory(id: number): Promise<boolean> {
    const history = await this.readHistory();
    const index = history.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return false;
    }
    history.splice(index, 1);
    await this.writeHistory(history);
    return true;
  }
}
