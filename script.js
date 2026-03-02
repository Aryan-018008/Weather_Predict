
document.addEventListener("DOMContentLoaded", () => {
//Api Key
// const apiKey = "cf33ca966c73286497b4c87abf545edf";
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

/* fetch weather */

async function fetchWeather(place) {

  try {

    const currentRes = await fetch(
     `https://api.openweathermap.org/data/2.5/weather?q=${place},IN&units=metric&appid=${apiKey}`
    );

    const currentData = await currentRes.json();

    if (currentData.cod != 200) {
      alert("City not found ❌");
      return;
    }

    /* SAVE CITY ID */
    currentCityId = currentData.id;

    /* GET FORECAST */
    await fetchWeatherById(currentCityId);

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
// async function fetchWeather(place) {
//   try {

//     const res = await fetch(
//       `/.netlify/functions/weather?city=${place}`
//     );

//     const data = await res.json();

//     if (data.current.cod != 200) {
//       alert("City not found ❌");
//       return;
//     }

//     displayWeather(data.current);
//     displayForecast(data.forecast);

//   } catch (error) {
//     console.error(error);
//     alert("Network Error 🌐");
//   }
// }

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

/* ⭐ REFRESH BUTTON (NOW WORKS) */
// refreshBtn.addEventListener("click", () => {

//   if (!currentCityId) {
//     alert("No city loaded yet");
//     return;
//   }

//   console.log("Refreshing city:", currentCityId);
//   fetchWeatherById(currentCityId);
// });

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