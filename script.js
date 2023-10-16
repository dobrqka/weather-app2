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
  // new object containining only summarized info of the current weather
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

// week days array used to convert the entire date to a weekday
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// uses the getData function to fetch weather info for the next 2 days
const getFuture = async (location, day) => {
  const mainWeatherObj = await getData(location);
  const currentDay = mainWeatherObj.forecast.forecastday[day];
  // convert date such as 12-10-2023 to a weekday such as Friday
  const futureDate = new Date(currentDay.date);
  const futureDay = weekDays[futureDate.getDay()];
  // new object containing generalized info for an upcoming day
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

// target weather info card DOM elements of today
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

// object containing all weather conditions used to summarize them
const allConditions = {
  sunny: ["Sunny"],
  clear: ["Clear"],
  cloudy: ["Partly cloudy"],
  overcast: ["Cloudy", "Overcast"],
  mist: ["Mist", "Fog", "Freezing fog"],
  thunder: [
    "Moderate or heavy snow with thunder",
    "Patchy light snow with thunder",
    "Patchy light rain with thunder",
    "Moderate or heavy rain with thunder",
    "Thundery outbreaks possible",
  ],
  rain: [
    "Patchy rain possible",
    "Patchy rain possible",
    "Patchy freezing drizzle possible",
    "Patchy light drizzle",
    "Light drizzle",
    "Freezing drizzle",
    "Heavy freezing drizzle",
    "Patchy light rain",
    "Light rain",
    "Moderate rain at times",
    "Moderate rain",
    "Heavy rain at times",
    "Heavy rain",
    "Light freezing rain",
    "Moderate or heavy freezing rain",
    "Light rain shower",
    "Moderate or heavy rain shower",
    "Torrential rain shower",
  ],
};

// loops through all possible weather conditions in the allConditions object and if it finds a match
// with the current weather condition it returns the key of that property as a string, we then use that string
// to display a corresponding background image. We do all this so that we don't have to set a different background image for all 48 possible weather conditions
const summarizeWeather = (condition) => {
  let currentWeather;
  for (let property in allConditions) {
    let values = allConditions[property];
    values.forEach((value) => {
      if (condition === value) {
        currentWeather = property;
      }
    });
  }
  if (currentWeather === undefined) {
    return "snow"; // all other weather conditions are covered
  }
  return currentWeather;
};

// function that populates weather info in the DOM elements with the details provided
// by the response of the API call after the user runs the search
const populateCurrent = (weatherObj) => {
  weatherLocation.textContent = `${weatherObj.location}`;
  const dateString = new Date().toUTCString(); // used to shorten the current date format
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

// takes the user input and uses it to make an API call that gets and display weather info for today and next 2 days
const getAndDisplayWeather = async () => {
  if (searchInput.value.length >= 3) {
    const location = searchInput.value;
    loading.style.display = "flex"; // activates loading screen
    const current = await getCurrent(location);
    const tomorrow = await getFuture(location, 1);
    const vdrugiden = await getFuture(location, 2);
    loading.style.display = "none"; // deactivates loading screen
    // displays and populates weather cards
    weatherCard.style.display = "grid";
    tomorrowCard.style.display = "grid";
    vdrugidenCard.style.display = "grid";
    populateCurrent(current);
    populateTomorrow(tomorrow);
    populateVdrugiden(vdrugiden);
    searchInput.value = ""; // resets input value
    // clears autocomplete menu
    while (autoCompleteMenu.firstChild) {
      autoCompleteMenu.removeChild(autoCompleteMenu.firstChild);
    }
    autoCompleteMenu.style.display = "none";
  }
};

// get and display weather data when search button is clicked
searchButton.addEventListener("click", async () => {
  // used to show input field after clicking on the search icon on mobile view
  if (!searchInput.classList.contains("visible")) {
    searchInput.classList.add("visible");
    return;
  }
  getAndDisplayWeather();
  // hides search input on mobile view
  if (searchInput.classList.contains("visible")) {
    searchInput.classList.remove("visible");
  }
});

// same as above but when you hit enter
searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getAndDisplayWeather();
  }
});

/// target autocomplete dropdown DOM element
const autoCompleteMenu = document.querySelector(".autocomplete");

// when you click on a suggestion set the search input's value to the
// text content of the target suggestion and clear the suggestions list
const selectSuggestion = () => {
  // target autocomplete suggestions
  const autoSuggestions = document.querySelectorAll(".autocomplete p");
  // adds click event listener on each suggestion
  autoSuggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
      searchInput.value = suggestion.textContent; // sets input to suggestion
      // clears suggestion list
      while (autoCompleteMenu.firstChild) {
        autoCompleteMenu.removeChild(autoCompleteMenu.firstChild);
      }
      autoCompleteMenu.style.display = "none";
      searchInput.focus(); // focuses on the input
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
  const data = await response.json(); // main object with suggestions
  const suggestions = [];
  // gets an individual suggestion object from the main array with all suggestions, summarizes and converts
  // it to a string and then adds it to the array of suggestions with the same index as the one it had in the main array
  data.forEach((suggestion) => {
    suggestions[
      data.indexOf(suggestion)
    ] = `${suggestion.name} (${suggestion.region}), ${suggestion.country}`;
  });
  // clears out the old suggestion dropdown
  while (autoCompleteMenu.firstChild) {
    autoCompleteMenu.removeChild(autoCompleteMenu.firstChild);
  }
  // prevents dropdown from displaying if there are no suggestions
  if (suggestions.length === 0) {
    autoCompleteMenu.style.display = "none";
  } else if (suggestions.length > 0) {
    autoCompleteMenu.style.display = "block";
    // creates a new <p> element in the autocomplete menu for each suggestion
    suggestions.forEach((suggestion) => {
      autoCompleteMenu.appendChild(document.createElement("p")).textContent =
        suggestion;
    });
    selectSuggestion(); // adds click event listener for suggestions
  }
};

// implement autocomplete functionality whenever the user types something
// in the search input
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    return;
  }
  // prevents erroneous api calls on short inputs
  if (searchInput.value.length >= 2) {
    autoComplete(searchInput.value);
  }
});
