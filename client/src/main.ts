import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById(
  'humidity'
) as HTMLParagraphElement;

/*

API Calls

*/

const fetchWeather = async (cityName: string): Promise<void> => {
  try {
    const response = await fetch('/api/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city: cityName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch weather data');
    }

    const weatherData = await response.json();
    if (!weatherData || weatherData.length === 0) {
      throw new Error('No weather data received');
    }

    renderCurrentWeather(weatherData[0]);
    renderForecast(weatherData.slice(1));
  } catch (error) {
    console.error('Error in fetchWeather:', error);
  }
};

const fetchSearchHistory = async (): Promise<void> => {
  try {
    if (!searchHistoryContainer) {
      console.error("Element with ID 'history' not found.");
      return;
    }

    const response = await fetch('/api/history');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const history: { id: number; city: string }[] = await response.json();
    console.log('Search History:', history);

    searchHistoryContainer.innerHTML = ''; // Clear existing content

    history.forEach((entry) => {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = `Delete ${entry.city} from history`;
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', () => deleteCityFromHistory(entry.id));
      searchHistoryContainer.appendChild(deleteButton);
    });
  } catch (error) {
    console.error('Error fetching search history:', error);
  }
};

const deleteCityFromHistory = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`/api/history/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete city with ID ${id}`);
    }

    console.log(`City with ID ${id} deleted successfully.`);
    fetchSearchHistory(); // Refresh the search history
  } catch (error) {
    console.error('Error deleting city from history:', error);
  }
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: any): void => {
  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } =
    currentWeather;

  heading.textContent = `${city} (${date})`;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: any): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  forecast.forEach((forecastItem: any) => {
    renderForecastCard(forecastItem);
  });
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } =
    createForecastCard();

  cardTitle.textContent = date;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add(
    'forecast-card',
    'card',
    'text-white',
    'bg-primary',
    'h-100'
  );
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

/*

Event Handlers

*/

const handleSearchFormSubmit = (event: Event): void => {
  event.preventDefault();

  if (!searchInput.value) {
    throw new Error('City cannot be blank');
  }

  const search = searchInput.value.trim();

  fetchWeather(search)
    .then(() => {
      return fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: search }),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add city to search history');
      }
      console.log('City added to search history successfully.');
      fetchSearchHistory();
    })
    .catch((error) => {
      console.error('Error handling search form submission:', error);
    });

  if (searchInput) {
    searchInput.value = '';
  }
};

/*

Initial Render

*/

searchForm?.addEventListener('submit', handleSearchFormSubmit);
document.addEventListener('DOMContentLoaded', fetchSearchHistory);
