import { promises as fs } from 'fs';
import path from 'path';

// Resolve the file path for the search history JSON file
const dataDirectory = path.join(process.cwd(), 'data');
const searchHistoryFilePath = path.join(dataDirectory, 'searchHistory.json');

// Ensure the data directory exists
async function ensureDataDirectoryExists(): Promise<void> {
  try {
    await fs.mkdir(dataDirectory, { recursive: true });
    console.log('Data directory ensured:', dataDirectory);
  } catch (error) {
    console.error('Error ensuring data directory:', error);
    throw new Error('Failed to ensure data directory exists.');
  }
}

// Ensure the directory exists during initialization
await ensureDataDirectoryExists();

// Define the structure of a history entry
interface HistoryEntry {
  id: number;
  city: string;
  timestamp: string;
}

// HistoryService class to manage search history
export default class HistoryService {
  // Read the search history from the file
  private async readHistory(): Promise<HistoryEntry[]> {
    try {
      console.log('Reading from file:', searchHistoryFilePath);
      const data = await fs.readFile(searchHistoryFilePath, 'utf-8');
      console.log('Data read from file:', data);
      return JSON.parse(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.warn('File not found, creating a new file with empty history.');
        await this.writeHistory([]); // Create an empty file
        return [];
      }
      console.error('Error reading from file:', error);
      throw new Error('Failed to read search history.');
    }
  }

  // Write the search history to the file
  private async writeHistory(history: HistoryEntry[]): Promise<void> {
    try {
      console.log('writeHistory method called');
      console.log('Attempting to write to file:', searchHistoryFilePath);
      console.log('Data being written:', JSON.stringify(history, null, 2));
      await fs.writeFile(searchHistoryFilePath, JSON.stringify(history, null, 2), 'utf-8');
      console.log('Successfully wrote to file.');
    } catch (error) {
      console.error('Error writing to file:', error);
      throw new Error('Failed to write search history.');
    }
  }

  // Get all search history
  public async getHistory(): Promise<HistoryEntry[]> {
    return await this.readHistory();
  }

  // Add a city to the search history
  public async addCityToHistory(city: string): Promise<void> {
    try {
      console.log('Adding city to history:', city);

      // Read the current history
      const history = await this.readHistory();
      console.log('Current history before adding:', history);

      // Create a new entry
      const newEntry: HistoryEntry = {
        id: history.length > 0 ? history[history.length - 1].id + 1 : 1,
        city,
        timestamp: new Date().toISOString(),
      };

      // Add the new entry to the history
      history.push(newEntry);
      console.log('Updated history after adding:', history);

      // Write the updated history back to the file
      await this.writeHistory(history);
      console.log('City added successfully');
    } catch (error) {
      console.error('Error adding city to history:', error);
      throw new Error('Failed to add city to history.');
    }
  }

  // Delete a city from the search history by its ID
  public async deleteCityFromHistory(id: number): Promise<boolean> {
    try {
      console.log('Deleting city with ID:', id);

      // Read the current history
      const history = await this.readHistory();
      console.log('Current history before deletion:', history);

      // Find the index of the city to delete
      const index = history.findIndex((entry) => entry.id === id);
      if (index === -1) {
        console.warn('City with the given ID not found.');
        return false;
      }

      // Remove the city from the history
      history.splice(index, 1);
      console.log('Updated history after deletion:', history);

      // Write the updated history back to the file
      await this.writeHistory(history);
      console.log('City deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting city from history:', error);
      throw new Error('Failed to delete city from history.');
    }
  }
}
