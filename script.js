const API_KEY = "c920ebd57eb6fb202e94ab7459317bdb"; // paste your OpenWeatherMap key here
const DEFAULT_CITY = "Dhaka";
const QUICK_CITIES = ["Dhaka", "London", "Tokyo", "Oslo"];

const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const message = document.getElementById("message");
const weatherBox = document.getElementById("weather");
const chips = document.getElementById("chips");

// Quick city buttons
chips.innerHTML = QUICK_CITIES
  .map(c => `<button type="button" data-city="${c}">${c}</button>`)
  .join("");

chips.addEventListener("click", (e) => {
  const city = e.target.dataset.city;
  if (city) {
    input.value = city;
    getWeather(city);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city) getWeather(city);
});

async function getWeather(city) {
  message.textContent = "Loading...";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${"c920ebd57eb6fb202e94ab7459317bdb"}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(res.status === 404 ? "City not found" : "Something went wrong. Check your API key.");
    }

    const data = await res.json();
    showWeather(data);
    message.textContent = "";
  } catch (error) {
    message.textContent = "⚠️ " + error.message;
  }
}

function showWeather(data) {
  document.getElementById("city-name").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("temp").textContent = Math.round(data.main.temp);
  document.getElementById("description").textContent = data.weather[0].description;
  document.getElementById("humidity").textContent = data.main.humidity + "%";
  document.getElementById("wind").textContent = data.wind.speed + " m/s";
  document.getElementById("feels").textContent = Math.round(data.main.feels_like) + "°C";
  document.getElementById("icon").textContent = getEmoji(data.weather[0].icon);

  setTheme(data.weather[0].main);

  // replay the pop animation
  weatherBox.classList.remove("hidden");
  weatherBox.style.animation = "none";
  weatherBox.offsetHeight;
  weatherBox.style.animation = "";
}

// Emoji icon from OpenWeatherMap icon code (e.g. "01d")
function getEmoji(code) {
  const night = code.endsWith("n");
  const map = {
    "01": night ? "🌙" : "☀️",
    "02": "⛅",
    "03": "☁️",
    "04": "☁️",
    "09": "🌧️",
    "10": "🌦️",
    "11": "⛈️",
    "13": "❄️",
    "50": "🌫️"
  };
  return map[code.slice(0, 2)] || "🌡️";
}

// Change background by weather type
function setTheme(type) {
  const map = {
    Clear: "clear",
    Clouds: "clouds",
    Rain: "rain",
    Drizzle: "rain",
    Thunderstorm: "thunder",
    Snow: "snow"
  };
  document.body.className = map[type] || "clouds";
}

// Show default city when the page opens
getWeather(DEFAULT_CITY);