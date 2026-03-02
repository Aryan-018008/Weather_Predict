
document.addEventListener("DOMContentLoaded", () => {
//Api Key
const apiKey = "6547f558fd8fc3553522ec45a5cfe7ee";


const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const city = document.getElementById("city");
const condition = document.getElementById("condition");
const forecastContainer = document.getElementById("forecastContainer");
const cityInput = document.getElementById("cityInput");
const dateTime = document.getElementById("dateTime");

const searchBtn = document.getElementById("searchBtn");
// const refreshBtn = document.getElementById("refreshBtn");
const darkToggle = document.getElementById("darkToggle");

/* ==============================
   GLOBAL STATE
============================== */

let currentCityId = null;

//Fetch Weather// Heading


async function fetchWeather(place) {

  try {

    /* STEP 1 — GET EXACT LOCATION */
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${place},IN&limit=1&appid=${apiKey}`
    );

    const geoData = await geoRes.json();

    if (!geoData.length) {
      alert("City not found ❌");
      return;
    }

    const { lat, lon, name, country } = geoData[0];

    /* STEP 2 — WEATHER BY COORDINATES */
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const currentData = await currentRes.json();

    /* STEP 3 — FORECAST */
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    const forecastData = await forecastRes.json();

    /* FORCE DISPLAYED NAME (IMPORTANT) */
    currentData.name = name;
    currentData.sys.country = country;

    displayWeather(currentData);
    displayForecast(forecastData);

  } catch (error) {
    console.error(error);
    alert("Network Error 🌐");
  }
}

/* Fetch Weather By City */
async function fetchWeatherById(id) {

  try {

    /* CURRENT WEATHER BY ID */
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&appid=${apiKey}`
    );

    const currentData = await currentRes.json();

    /* FORECAST BY ID */
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?id=${id}&units=metric&appid=${apiKey}`
    );

    const forecastData = await forecastRes.json();

    displayWeather(currentData);
    displayForecast(forecastData);

  } catch (error) {
    console.error(error);
  }
}

/* Display Current Weather */

function displayWeather(data) {

  city.textContent = data.name;
  temp.textContent = Math.round(data.main.temp) + "°C";
  humidity.textContent = data.main.humidity + "%";
  wind.textContent = data.wind.speed + " m/s";
  condition.textContent = data.weather[0].main;

  changeBackground(data.weather[0].main);
}

/* forecast */

function displayForecast(data) {

  forecastContainer.innerHTML = "";

  const days = data.list
    .filter(item => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  days.forEach(day => {

    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
      <h4>${new Date(day.dt_txt).toDateString()}</h4>
      <p>
        ${Math.round(day.main.temp_min)}° /
        ${Math.round(day.main.temp_max)}°
      </p>
    `;

    forecastContainer.appendChild(card);
  });
}

/* Background Change */

function changeBackground(weather) {

  weather = weather.toLowerCase();

  document.body.classList.remove("clear", "rain", "cloud");

  if (weather.includes("rain"))
    document.body.classList.add("rain");
  else if (weather.includes("cloud"))
    document.body.classList.add("cloud");
  else
    document.body.classList.add("clear");
}

/* Events */

/* SEARCH BUTTON */
searchBtn.addEventListener("click", () => {

  const place = cityInput.value.trim();

  if (!place) {
    alert("Enter city name");
    return;
  }

  fetchWeather(place);
});

/* ENTER KEY SEARCH */
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});


/* DARK MODE */
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

/* Date and Time*/

function updateDateTime() {

  const now = new Date();

  const date = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  dateTime.textContent = `${date} | ${time}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();

/*Initial Reload */

fetchWeather("Bhubaneswar");

});
//Refresh
function refreshWeather(){
  location.reload();
}