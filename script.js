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
  console.log(mainWeatherObj);
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
    humidity: `${currentWeather.humidity}%`,
    pressure: `${currentWeather.pressure_mb} hPa`,
    sunrise: mainWeatherObj.forecast.forecastday[0].astro.sunrise,
    sunset: mainWeatherObj.forecast.forecastday[0].astro.sunset,
    moonrise: mainWeatherObj.forecast.forecastday[0].astro.moonrise,
    moonset: mainWeatherObj.forecast.forecastday[0].astro.moonset,
    moonPhase: mainWeatherObj.forecast.forecastday[0].astro.moon_phase,
    moonIllumination: `${mainWeatherObj.forecast.forecastday[0].astro.moon_illumination}%`,
  };
  return currentGeneral;
};
// week days array to convert date to weekday
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// uses getData function to fetch weather info for the next 2 days
const getFuture = async (location, day) => {
  const mainWeatherObj = await getData(location);
  const currentDay = mainWeatherObj.forecast.forecastday[day];
  // convert date such as 12-10-2023 to a weekday such as Friday
  const futureDate = new Date(currentDay.date);
  const futureDay = weekDays[futureDate.getDay()];
  // object containing generalized info for an upcoming day
  const futureWeather = {
    date: futureDay,
    tempMax: currentDay.day.maxtemp_c,
    tempMin: currentDay.day.mintemp_c,
    humidity: currentDay.day.avghumidity,
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
const humidity = document.querySelector(".humidity-perc");
const pressure = document.querySelector(".pressure");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const moonrise = document.querySelector(".moonrise");
const moonset = document.querySelector(".moonset");
const moonIcon = document.querySelector(".moon-icon > img");
const moonPhase = document.querySelector(".moon-phase");

// summarize weather
const summarizeWeather = (condition) => {
  if (condition === "Sunny") {
    return "sunny";
  } else if (condition === "Clear") {
    return "clear";
  } else if (condition === "Partly cloudy") {
    return "cloudy";
  } else if (
    condition === "Mist" ||
    condition === "Fog" ||
    condition === "Freezing fog"
  ) {
    return "mist";
  } else if (condition === "Cloudy" || condition === "Overcast") {
    return "overcast";
  } else if (
    condition === "Moderate or heavy snow with thunder" ||
    condition === "Patchy light snow with thunder" ||
    condition === "Patchy light rain with thunder" ||
    condition === "Moderate or heavy rain with thunder" ||
    condition === "Thundery outbreaks possible"
  ) {
    return "thunder";
  } else if (
    condition === "Patchy rain possible" ||
    condition === "Patchy rain possible" ||
    condition === "Patchy freezing drizzle possible" ||
    condition === "Patchy light drizzle" ||
    condition === "Light drizzle" ||
    condition === "Freezing drizzle" ||
    condition === "Heavy freezing drizzle" ||
    condition === "Patchy light rain" ||
    condition === "Light rain" ||
    condition === "Moderate rain at times" ||
    condition === "Moderate rain" ||
    condition === "Heavy rain at times" ||
    condition === "Heavy rain" ||
    condition === "Light freezing rain" ||
    condition === "Moderate or heavy freezing rain" ||
    condition === "Light rain shower" ||
    condition === "Moderate or heavy rain shower" ||
    condition === "Torrential rain shower"
  ) {
    return "rain";
  } else {
    return "snow";
  }
};

// function that populates weather info with the details provided
// by the response of the API call after the user runs the search
const populateCurrent = (weatherObj) => {
  // weatherLocation.textContent = ${weatherObj.location} (${weatherObj.region}), ${weatherObj.country};
  weatherLocation.textContent = `${weatherObj.location}`;
  const dateString = new Date().toUTCString();
  weatherDate.textContent = Array.from(dateString).splice(0, 11).join("");
  weatherTemp.textContent = `${weatherObj.temp}`;
  weatherGeneral.textContent = weatherObj.general;
  weatherIcon.src = "https:" + weatherObj.icon;
  weatherFeel.textContent = `Feels: ${weatherObj.feels}`;
  weatherRain.textContent = `${weatherObj.rain} (${weatherObj.rainChance}%)`;
  weatherWindDirection.src = `./images/${weatherObj.windDir}.png`;
  weatherWindSpeed.textContent = weatherObj.wind;
  uv.textContent = `UV: ${weatherObj.uv}`;
  document.body.style.backgroundImage = `url(
    "./images/weather/${summarizeWeather(weatherObj.general)}.jpeg"
  )`;
  humidity.textContent = weatherObj.humidity;
  pressure.textContent = weatherObj.pressure;
  sunrise.textContent = weatherObj.sunrise;
  sunset.textContent = weatherObj.sunset;
  moonrise.textContent = weatherObj.moonrise;
  moonset.textContent = weatherObj.moonset;
  moonIcon.src = `./images/moon/${weatherObj.moonPhase.replace(" ", "")}.png`;
  moonPhase.textContent = `${weatherObj.moonPhase} (${weatherObj.moonIllumination})`;
};

// target tomorrow weather info's DOM elements
const tomorrowDate = document.querySelector(".tomorrow-date");
const tomorrowTempMax = document.querySelector(".tomorrow-temp-max");
const tomorrowTempMin = document.querySelector(".tomorrow-temp-min");
const tomorrowHumidity = document.querySelector(".tomorrow-humidity-perc");
const tomorrowIcon = document.querySelector(".tomorrow-icon");
const tomorrowRain = document.querySelector(".tomorrow-rain");
const tomorrowWindSpeed = document.querySelector(".tomorrow-wind-speed");
// populates tomorrow's card
const populateTomorrow = (weatherObj) => {
  tomorrowDate.textContent = weatherObj.date;
  tomorrowTempMax.textContent = `${weatherObj.tempMax}°C`;
  tomorrowTempMin.textContent = `${weatherObj.tempMin}°C`;
  tomorrowIcon.src = "https:" + weatherObj.icon;
  tomorrowHumidity.textContent = `${weatherObj.humidity}%`;
  tomorrowRain.textContent = `${weatherObj.rain}mm (${weatherObj.rainChance}%)`;
  tomorrowWindSpeed.textContent = `${weatherObj.wind}`;
};

// target vdrugiden weather info's DOM elements
const vdrugidenDate = document.querySelector(".vdrugiden-date");
const vdrugidenTempMax = document.querySelector(".vdrugiden-temp-max");
const vdrugidenTempMin = document.querySelector(".vdrugiden-temp-min");
const vdrugidenHumidity = document.querySelector(".vdrugiden-humidity-perc");
const vdrugidenIcon = document.querySelector(".vdrugiden-icon");
const vdrugidenRain = document.querySelector(".vdrugiden-rain");
const vdrugidenWindSpeed = document.querySelector(".vdrugiden-wind-speed");
// populates vdrugiden's card
const populateVdrugiden = (weatherObj) => {
  vdrugidenDate.textContent = weatherObj.date;
  vdrugidenTempMax.textContent = `${weatherObj.tempMax}°C`;
  vdrugidenTempMin.textContent = `${weatherObj.tempMin}°C`;
  vdrugidenIcon.src = "https:" + weatherObj.icon;
  vdrugidenHumidity.textContent = `${weatherObj.humidity}%`;
  vdrugidenRain.textContent = `${weatherObj.rain}mm (${weatherObj.rainChance}%)`;
  vdrugidenWindSpeed.textContent = `${weatherObj.wind}`;
};

// target search button and search input
const searchButton = document.querySelector(".search button");
const searchInput = document.querySelector(".search input");
// target weather info cards
const weatherInfo = document.querySelector(".weather-info");
const weatherCard = document.querySelector(".weather-card");
const tomorrowCard = document.querySelector(".tomorrow-card");
const vdrugidenCard = document.querySelector(".vdrugiden-card");
// target loading screen
const loading = document.querySelector(".loading");

// get weather data when search button is clicked, for the location
// that's in the input
searchButton.addEventListener("click", async () => {
  if (!searchInput.classList.contains("visible")) {
    searchInput.classList.add("visible");
    return;
  }
  if (searchInput.value.length >= 3) {
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
    while (autoCompleteMenu.firstChild) {
      autoCompleteMenu.removeChild(autoCompleteMenu.firstChild);
    }
    autoCompleteMenu.style.display = "none";
    if (searchInput.classList.contains("visible")) {
      searchInput.classList.remove("visible");
    }
  }
});

// same as above but when you hit enter
searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (searchInput.value.length >= 3) {
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
      while (autoCompleteMenu.firstChild) {
        autoCompleteMenu.removeChild(autoCompleteMenu.firstChild);
      }
      autoCompleteMenu.style.display = "none";
    }
  }
});

/// target autocomplete dropdown DOM element
const autoCompleteMenu = document.querySelector(".autocomplete");

// when you click on a suggestion set the search input's value to the
// text content of the target suggestion and clear the suggestions list
const selectSuggestion = () => {
  // target autocomplete suggestions
  const autoSuggestions = document.querySelectorAll(".autocomplete p");
  // magic
  autoSuggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      searchInput.value = suggestion.textContent;
      while (autoCompleteMenu.firstChild) {
        autoCompleteMenu.removeChild(autoCompleteMenu.firstChild);
      }
      autoCompleteMenu.style.display = "none";
      searchInput.focus();
    });
  });
};

/// autocomplete function that shows suggestions based on current input
const autoComplete = async (input) => {
  const mainUrl = "http://api.weatherapi.com/v1/search.json";
  const apiQuery = "?key=fcfc5bf03eb543b5be0185337231909";
  const inputQuery = `&q=${input}`;
  const response = await fetch(`${mainUrl}${apiQuery}${inputQuery}`, {
    mode: "cors",
  });
  const data = await response.json();
  const suggestions = [];
  // summarizes json object with suggestions and converts each suggestion
  // object to a string instead
  data.forEach((suggestion) => {
    suggestions[
      data.indexOf(suggestion)
    ] = `${suggestion.name} (${suggestion.region}), ${suggestion.country}`;
  });

  while (autoCompleteMenu.firstChild) {
    autoCompleteMenu.removeChild(autoCompleteMenu.firstChild);
  }
  if (suggestions.length === 0) {
    autoCompleteMenu.style.display = "none";
  } else if (suggestions.length > 0) {
    autoCompleteMenu.style.display = "block";
    // creates a new <p> element in the autocomplete menu for each suggestion
    suggestions.forEach((suggestion) => {
      autoCompleteMenu.appendChild(document.createElement("p")).textContent =
        suggestion;
    });
    selectSuggestion();
  }
};

// implement autocomplete functionality whenever the user inputs something
// in the search input
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    return;
  }
  if (searchInput.value.length >= 2) {
    autoComplete(searchInput.value);
  }
});

// focus the search input on page load
searchInput.focus();

/// clean up html, css and js code, document it better
