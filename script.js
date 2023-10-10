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
    uv: currentWeather.uv,
  };
  return currentGeneral;
};

// uses getData function to fetch weather info for the next 2 days
const getFuture = async (location, day) => {
  const mainWeatherObj = await getData(location);
  const currentDay = mainWeatherObj.forecast.forecastday[day];
  // object containing generalized info for an upcoming day
  const futureWeather = {
    date: currentDay.date,
    tempMax: currentDay.day.maxtemp_c,
    tempMin: currentDay.day.mintemp_c,
    icon: currentDay.day.condition.icon,
    rain: currentDay.day.totalprecip_mm,
    rainChance: currentDay.day.daily_chance_of_rain,
    wind: Math.round(currentDay.day.maxwind_kph * 0.28) + "m/s",
  };
  return futureWeather;
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
const uv = document.querySelector(".uv");

// function that populates weather info with the details provided
// by the response of the API call after the user runs the search
const populateCurrent = (weatherObj) => {
  weatherLocation.textContent = `${weatherObj.location} (${weatherObj.region}), ${weatherObj.country}`;
  weatherDate.textContent = new Date().toUTCString();
  weatherTemp.textContent = `Current: ${weatherObj.temp}`;
  weatherGeneral.textContent = weatherObj.general;
  weatherIcon.src = "https:" + weatherObj.icon;
  weatherFeel.textContent = `Feels like: ${weatherObj.feels}`;
  weatherRain.textContent = `Rain: ${weatherObj.rain} (${weatherObj.rainChance}%)`;
  weatherWindDirection.src = `./images/${weatherObj.windDir}.png`;
  weatherWindSpeed.textContent = weatherObj.wind;
  uv.textContent = `UV: ${weatherObj.uv}`;
};

// target tomorrow weather info's DOM elements
const tomorrowDate = document.querySelector(".tomorrow-date");
const tomorrowTempMax = document.querySelector(".tomorrow-temp-max");
const tomorrowTempMin = document.querySelector(".tomorrow-temp-min");
const tomorrowIcon = document.querySelector(".tomorrow-icon");
const tomorrowRain = document.querySelector(".tomorrow-rain");
const tomorrowWindSpeed = document.querySelector(".tomorrow-wind-speed");
// populates tomorrow's card
const populateTomorrow = (weatherObj) => {
  tomorrowDate.textContent = weatherObj.date;
  tomorrowTempMax.textContent = `Max t°: ${weatherObj.tempMax}°C`;
  tomorrowTempMin.textContent = `Min t°: ${weatherObj.tempMin}°C`;
  tomorrowIcon.src = "https:" + weatherObj.icon;
  tomorrowRain.textContent = `Rain: ${weatherObj.rain}mm (${weatherObj.rainChance}%)`;
  tomorrowWindSpeed.textContent = `Wind: ${weatherObj.wind}`;
};

// target vdrugiden weather info's DOM elements
const vdrugidenDate = document.querySelector(".vdrugiden-date");
const vdrugidenTempMax = document.querySelector(".vdrugiden-temp-max");
const vdrugidenTempMin = document.querySelector(".vdrugiden-temp-min");
const vdrugidenIcon = document.querySelector(".vdrugiden-icon");
const vdrugidenRain = document.querySelector(".vdrugiden-rain");
const vdrugidenWindSpeed = document.querySelector(".vdrugiden-wind-speed");
// populates vdrugiden's card
const populateVdrugiden = (weatherObj) => {
  vdrugidenDate.textContent = weatherObj.date;
  vdrugidenTempMax.textContent = `Max t°: ${weatherObj.tempMax}°C`;
  vdrugidenTempMin.textContent = `Min t°: ${weatherObj.tempMin}°C`;
  vdrugidenIcon.src = "https:" + weatherObj.icon;
  vdrugidenRain.textContent = `Rain: ${weatherObj.rain}mm (${weatherObj.rainChance}%)`;
  vdrugidenWindSpeed.textContent = `Wind: ${weatherObj.wind}`;
};

// target search button and search input
const searchButton = document.querySelector(".search button");
const searchInput = document.querySelector(".search input");
// target weather info cards
const weatherCard = document.querySelector(".weather-card");
const tomorrowCard = document.querySelector(".tomorrow-card");
const vdrugidenCard = document.querySelector(".vdrugiden-card");
// target loading screen
const loading = document.querySelector(".loading");

// get weather data when search button is clicked, for the location
// that's in the input
searchButton.addEventListener("click", async () => {
  const location = searchInput.value;
  loading.style.display = "flex";
  const current = await getCurrent(location);
  const tomorrow = await getFuture(location, 1);
  const vdrugiden = await getFuture(location, 2);
  loading.style.display = "none";
  weatherCard.style.display = "grid";
  tomorrowCard.style.display = "grid";
  vdrugidenCard.style.display = "grid";
  populateCurrent(current);
  populateTomorrow(tomorrow);
  populateVdrugiden(vdrugiden);
  searchInput.value = "";
});

// same as above but when you hit enter
searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const location = searchInput.value;
    loading.style.display = "flex";
    const current = await getCurrent(location);
    const tomorrow = await getFuture(location, 1);
    const vdrugiden = await getFuture(location, 2);
    loading.style.display = "none";
    weatherCard.style.display = "grid";
    tomorrowCard.style.display = "grid";
    vdrugidenCard.style.display = "grid";
    populateCurrent(current);
    populateTomorrow(tomorrow);
    populateVdrugiden(vdrugiden);
    searchInput.value = "";
  }
});

searchInput.focus();

/// set up autocomplete =>
// http://api.weatherapi.com/v1/search.json?key=fcfc5bf03eb543b5be0185337231909&q=
/// +city

/// pimp up design and UX both on desktop and mobile
