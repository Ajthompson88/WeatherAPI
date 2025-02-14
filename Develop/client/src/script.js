document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const city = document.getElementById('search-input').value;
  fetchWeather(city);
  saveToHistory(city);
});

function fetchWeather(city) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Update the DOM with the weather data
      updateCurrentWeather(data);
      updateForecast(data);
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

// Function to update the current weather section in the DOM
function updateCurrentWeather(data) {
  const currentWeather = document.getElementById('current-weather');
  const weather = data.list[0]; // Get the first item from the weather data list
  currentWeather.innerHTML = `
    <h2>${data.city.name}</h2>
    <p>Date: ${new Date(weather.dt * 1000).toLocaleDateString()}</p>
    <p>Temperature: ${(weather.main.temp - 273.15).toFixed(2)}°C</p>
    <p>Humidity: ${weather.main.humidity}%</p>
    <p>Wind Speed: ${weather.wind.speed} m/s</p>
    <p>Description: ${weather.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}">
  `;
}

// Function to update the 5-day forecast section in the DOM
function updateForecast(data) {
  const forecast = document.getElementById('forecast');
  forecast.innerHTML = '<h2>5-Day Forecast</h2>';
  for (let i = 0; i < data.list.length; i += 8) { // Loop through the weather data list, taking every 8th item
    const weather = data.list[i];
    forecast.innerHTML += `
      <div>
        <p>Date: ${new Date(weather.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${(weather.main.temp - 273.15).toFixed(2)}°C</p>
        <p>Humidity: ${weather.main.humidity}%</p>
        <p>Wind Speed: ${weather.wind.speed} m/s</p>
        <p>Description: ${weather.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}">
      </div>
    `;
  }
}

// Function to save the searched city to the search history and update the DOM
function saveToHistory(city) {
  fetch('/api/weather/history') // Fetch the search history from the server
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
      // Update the search history section in the DOM
      const searchHistory = document.getElementById('search-history');
      searchHistory.innerHTML = '';
      data.forEach(item => {
        searchHistory.innerHTML += `<p>${item.city}</p>`;
      });
    });
}