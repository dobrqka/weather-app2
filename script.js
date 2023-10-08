// returns an object containing all the weather info

const getData = async (location) => {
  // parameters needed to create the URL for the API call
  const mainUrl = "http://api.weatherapi.com/v1/forecast.json";
  const API_KEY = "fcfc5bf03eb543b5be0185337231909";
  const apiPart = "?key=" + API_KEY;
  const place = "&q=" + location;
  const numberOfDays = "&days=3";
  // API call to fetch json with weather data
  try {
    const response = await fetch(
      `${mainUrl}${apiPart}${place}${numberOfDays}`,
      {
        mode: "cors",
      }
    );
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  } catch (error) {
    console.error("Error:", error);
  }
};

// uses the getData function to access its "current" property to
// only fetch the current weather

const getCurrent = async (location) => {
  const mainWeatherObj = await getData(location);
  const currentWeather = mainWeatherObj.current;

  // object containining only summarized current weather info
  const currentGeneral = {
    location: mainWeatherObj.location.name,
    region: mainWeatherObj.location.region,
    country: mainWeatherObj.location.country,
    temp: currentWeather.temp_c + "°C",
    feels: currentWeather.feelslike_c + "°C",
    wind: Math.round(currentWeather.wind_kph * 0.28) + "m/s", // converts km/h to m/s
    windDir: currentWeather.wind_dir,
    rain: currentWeather.precip_mm + "mm",
    rainChance: mainWeatherObj.forecast.forecastday[0].day.daily_chance_of_rain,
    general: currentWeather.condition.text,
    icon: currentWeather.condition.icon,
  };
  console.log(currentGeneral);
  return currentGeneral;
};

// target weather info card DOM elements to use with following function
const weatherLocation = document.querySelector(".location");
const weatherDate = document.querySelector(".date");
const weatherTemp = document.querySelector(".temp");
const weatherIcon = document.querySelector(".icon");
const weatherGeneral = document.querySelector(".general");
const weatherFeel = document.querySelector(".feel");
const weatherRain = document.querySelector(".rain");
const weatherWindSpeed = document.querySelector(".wind-speed");
const weatherWindDirection = document.querySelector(".wind-dir");

// function that populates weather info with the details provided
// by the response of the API call after the user runs the search
const populateInfo = (weatherObj) => {
  weatherLocation.textContent = `${weatherObj.location} (${weatherObj.region}), ${weatherObj.country}`;
  weatherDate.textContent = new Date().toUTCString();
  weatherTemp.textContent = weatherObj.temp;
  weatherGeneral.textContent = weatherObj.general;
  weatherIcon.src = "https:" + weatherObj.icon;
  weatherFeel.textContent = `Feels like: ${weatherObj.feels}`;
  weatherRain.textContent = `Rain: ${weatherObj.rain} (${weatherObj.rainChance}%)`;
  weatherWindDirection.src = `./images/${weatherObj.windDir}.png`;
  weatherWindSpeed.textContent = weatherObj.wind;
};

// target search button and search input
const searchButton = document.querySelector(".search button");
const searchInput = document.querySelector(".search input");
searchInput.focus();
// target weather info card
const weatherCard = document.querySelector(".weather-card");

// get weather data when search button is clicked, for the location
// that's in the input
searchButton.addEventListener("click", async () => {
  const location = searchInput.value;
  const weatherInfo = await getCurrent(location);
  populateInfo(weatherInfo);
  searchInput.value = "";
});

// same as above but when you hit enter
searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const location = searchInput.value;
    const weatherInfo = await getCurrent(location);
    populateInfo(weatherInfo);
    searchInput.value = "";
  }
});

/// set up background image depending on weather, list of weather conditions:
// https://www.weatherapi.com/docs/weather_conditions.json

//////// set up functions to get forecast for upcoming days

/// set up autocomplete =>
// http://api.weatherapi.com/v1/search.json?key=fcfc5bf03eb543b5be0185337231909&q=
/// +city
