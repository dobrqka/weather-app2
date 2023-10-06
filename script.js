const API_KEY = "fcfc5bf03eb543b5be0185337231909";

const getData = async (location) => {
  const mainUrl = "http://api.weatherapi.com/v1/forecast.json";
  const apiKey = "?key=" + API_KEY;
  const place = "&q=" + location;
  const numberOfDays = "&days=3";

  const response = await fetch(`${mainUrl}${apiKey}${place}${numberOfDays}`, {
    mode: "cors",
  });
  const weatherData = await response.json();
  console.log(weatherData);
};

getData("Shumen");
