import "./styles.scss";
import showTime from "./timeModule";
import ClearIcon from "./imgs/clear-icon.jpg";
import ClearBg from "./imgs/Clear-bg.jpg";
import ThunderstormIcon from "./imgs/Thunderstorm-icon.png";
import ThunderstormBg from "./imgs/Thunderstorm-bg.jpg";
import CloudsIcon from "./imgs/cloudy-icon.png";
import CloudsBg from "./imgs/Clouds-bg.jpg";
import RainIcon from "./imgs/rain-icon.png";
import RainBg from "./imgs/Rain-bg.jpg";
import QuestionMark from "./imgs/question.png";

let city = document.querySelector(".city");
let icon = document.querySelector(".icon");
let description = document.querySelector(".description");
let forecast = document.querySelector(".forecast");
let clock = document.querySelector(".time");
let temperature = document.querySelector(".temperature");

city.addEventListener("click", inputswap);
city.addEventListener("mouseover", () => (city.style.color = "red"));
city.addEventListener("mouseout", () => (city.style.color = "black"));

function inputswap() {
  let citytemp = city.innerText;
  let input = document.createElement("input");
  input.value = citytemp;
  input.focus();
  city.removeEventListener("click", inputswap);
  city.innerHTML = "";
  city.appendChild(input);

  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      setCity(input.value);
      city.addEventListener("click", inputswap);
    }
  });
}

showTimeUI();
function showTimeUI() {
  clock.innerText = showTime();
  setTimeout(showTimeUI, 1000);
}

setCity("samarinda");
function setCity(cities) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cities}&appid=3a29dc96b4a26763a1e1d16815ea3c3d`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message);
        temperature.innerText = "Check your input";
        description.innerText = "City Not Found";
        forecast.innerHTML = "";
        icon.style.backgroundImage = `url(${QuestionMark})`;
        city.style.color = "red";
      } else {
        renderForecast(data);
        city.style.color = "black";
      }
    });

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cities}&appid=3a29dc96b4a26763a1e1d16815ea3c3d`
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data.message) {
        console.log(data);
        renderCurrent(data);
      }
    });
}
function renderCurrent(data) {
  city.innerText = data.name;
  temperature.innerText = trunc(data.main.temp - 273) + "\xB0C";

  let weathericon;
  let weatherbg;
  console.log(data.weather[0].main);
  switch (data.weather[0].main) {
    case "Clear":
      weathericon = ClearIcon;
      weatherbg = ClearBg;

      break;
    case "Rain":
    case "Drizzle":
      weathericon = RainIcon;
      weatherbg = RainBg;

      break;
    case "Clouds":
      weathericon = CloudsIcon;
      weatherbg = CloudsBg;

      break;
    case "Thunderstorm":
      weathericon = ThunderstormIcon;
      weatherbg = ThunderstormBg;

      break;
  }
  icon.style.backgroundImage = `url(${weathericon})`;
  description.innerText = data.weather[0].description;
  document.body.style.backgroundImage = `url(${weatherbg})`;
}

function renderForecast(data) {
  forecast.innerHTML = "";
  let splice = data.list.splice(3, 8);
  console.log(splice);
  splice.forEach((e) => {
    let weathericon;
    switch (e.weather[0].main) {
      case "Clear":
        weathericon = ClearIcon;
        break;
      case "Rain":
      case "Drizzle":
        weathericon = RainIcon;
        break;
      case "Clouds":
        weathericon = CloudsIcon;
        break;
      case "Thunderstorm":
        weathericon = ThunderstormIcon;
        break;
    }

    const Ftime = document.createElement("div");
    Ftime.innerText = e.dt_txt.slice(-8);
    const Fdescription = document.createElement("div");
    Fdescription.innerText = e.weather[0].description;
    const Ftemp = document.createElement("div");
    Ftemp.innerText = trunc(e.main.temp - 273) + "\xB0C";
    const forecastNode = document.createElement("div");
    forecastNode.classList.add("node");
    forecastNode.appendChild(Ftime);
    forecastNode.appendChild(Fdescription);
    forecastNode.appendChild(Ftemp);
    forecastNode.style.backgroundImage = `url(${weathericon})`;
    forecast.appendChild(forecastNode);
  });
}

function trunc(num) {
  return Math.floor(num * 100) / 100;
}
