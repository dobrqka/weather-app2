// returns an object containing all the weather info

const getData = async (location) => {
  // parameters needed to create the URL for the API call
  const mainUrl = "http://api.weatherapi.com/v1/forecast.json";
  const API_KEY = "fcfc5bf03eb543b5be0185337231909";
  const apiPart = "?key=" + API_KEY;
  const place = "&q=" + location;
  const numberOfDays = "&days=3";
  // API call to fetch json with weather data
  const response = await fetch(`${mainUrl}${apiPart}${place}${numberOfDays}`, {
    mode: "cors",
  });
  const weatherData = await response.json();
  return weatherData;
};

// uses the getData function to access its "current" property to
// only fetch the current weather

const getCurrent = async (location) => {
  const mainWeatherObj = await getData(location);
  const currentWeather = mainWeatherObj.current;

  // object containining only summarized current weather info
  const currentGeneral = {
    temp: currentWeather.temp_c + "°C",
    feels: currentWeather.feelslike_c + "°C",
    wind: Math.round(currentWeather.wind_kph * 0.28) + "m/s", // converts km/h to m/s
    rain: currentWeather.precip_mm + "mm",
    general: currentWeather.condition.text,
    icon: currentWeather.condition.icon,
  };
  console.log(currentGeneral);
};

getCurrent("Shumen");
