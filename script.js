// ── DOM References ─────────────────────────
const selectState = document.querySelector("#selectState");
const searchBtn = document.querySelector("#searchBtn");
const trailListBox = document.getElementById("trailListBox");
const trailDetailPanel = document.getElementById("trailDescriptionBoxes");
const menuList = document.querySelector(".trail-list");

const imgEls = document.querySelectorAll(".weather-img");
const dateEls = document.getElementsByClassName("Date");
const dayEls = document.getElementsByClassName("Day");
const maxEls = document.getElementsByClassName("Max");
const minEls = document.getElementsByClassName("Min");
const windEls = document.getElementsByClassName("Wind");
const weatherMainEls = document.getElementsByClassName("WeatherMain");
const weatherDesEls = document.getElementsByClassName("WeatherDes");

const saveBtnEl = document.getElementById("trailSaver");
const favoriteBoxEl = document.getElementById("selectFavorite");
const favoriteButtonEl = document.getElementById("favoriteButton");
const defaultEl = document.getElementById("selectDefault");

// ── State ──────────────────────────────────
var weatherData;
var trailsData;
let favoriteData = {};

// ── Search ─────────────────────────────────
searchBtn.addEventListener("click", function () {
  const state = selectState.value;
  if (state !== defaultEl.textContent && state !== "Choose a State") {
    displayTrails(state);
  }
});

// ── Weather ────────────────────────────────
function getWeatherData(latitude, longitude) {
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&exclude=current,minutely,hourly&appid=31ed1d78ece05a26dbb0c6020e7b32b5&units=imperial";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          weatherData = data;
          renderWeather();
        });
      } else {
        alert("Weather Error: " + response.statusText);
      }
    })
    .catch(function () {
      alert("Could not reach the weather service.");
    });
}

function renderWeather() {
  for (var i = 0; i < dateEls.length; i++) {
    const current = weatherData.daily[i];

    imgEls[i].src = "assets/images/" + current.weather[0].description + ".jpg";
    dateEls[i].textContent = unixConversion(current.dt);
    dayEls[i].textContent = current.temp.day + "\u00B0F";
    maxEls[i].textContent = "High: " + current.temp.max + "\u00B0F";
    minEls[i].textContent = "Low: " + current.temp.min + "\u00B0F";
    windEls[i].textContent = current.wind_speed + " MPH";
    weatherMainEls[i].textContent = current.weather[0].main;
    weatherDesEls[i].textContent = current.weather[0].description;
  }
}

function unixConversion(unix) {
  const date = new Date(unix * 1000);
  const temp = date.toDateString();
  return temp.substring(0, temp.length - 4);
}

// ── Trails ─────────────────────────────────
function displayTrails(state) {
  trailListBox.style.display = "block";

  const apiUrl =
    "https://developer.nps.gov/api/v1/places?statecode=" +
    state +
    "&limit=50&q=trails&api_key=WdgBOclP1YDr6ZIL0vXfInjZRVwmb8VjKrcvwpoZ";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        trailsData = data;
        menuList.replaceChildren();

        for (var i = 0; i < data.data.length; i++) {
          const trail = data.data[i];
          if (trail.latitude !== "" || trail.longitude !== "") {
            const item = document.createElement("li");
            item.dataset.latitude = trail.latitude;
            item.dataset.longitude = trail.longitude;
            item.textContent = trail.title;
            item.dataset.text = trail.bodyText;
            item.dataset.image = trail.images[0].url;
            item.dataset.state = state;

            item.addEventListener("click", function (event) {
              // Remove active class from siblings
              document
                .querySelectorAll(".trail-list li")
                .forEach((el) => el.classList.remove("active"));
              event.target.classList.add("active");

              showTrailDetail(event.target.dataset);
            });

            menuList.appendChild(item);
          }
        }
      });
    }
  });
}

function showTrailDetail(dataset) {
  trailDetailPanel.style.display = "flex";

  getWeatherData(dataset.latitude, dataset.longitude);

  document.querySelector("#trailDescription").innerHTML = dataset.text;
  document.getElementById("koolAidMan").setAttribute("src", dataset.image);

  saveBtnEl.dataset.latitude = dataset.latitude;
  saveBtnEl.dataset.longitude = dataset.longitude;
  saveBtnEl.dataset.title = dataset.title || dataset.textContent;
  saveBtnEl.dataset.text = dataset.text;
  saveBtnEl.dataset.image = dataset.image;
  saveBtnEl.dataset.state = dataset.state;

  updateSaveButtonText(saveBtnEl.dataset.title);
}

// ── Parallax ───────────────────────────────
(function () {
  const speed = 0.7;
  window.onscroll = function () {
    const pos = "50% " + window.pageYOffset * speed + "px";
    document.documentElement.style.backgroundPosition = pos;
  };
})();

// ── Save / Favorites ───────────────────────
saveBtnEl.addEventListener("click", function () {
  const title = saveBtnEl.dataset.title;
  if (!title) return;

  if (!(title in favoriteData)) {
    favoriteData[title] = {
      title: title,
      longitude: saveBtnEl.dataset.longitude,
      latitude: saveBtnEl.dataset.latitude,
      text: saveBtnEl.dataset.text,
      image: saveBtnEl.dataset.image,
      state: saveBtnEl.dataset.state,
    };
  } else {
    delete favoriteData[title];
  }

  saveFavoriteData();
  renderFavorite();
  updateSaveButtonText(title);
});

favoriteButtonEl.addEventListener("click", function () {
  if (favoriteBoxEl.value !== "") {
    const data = favoriteData[favoriteBoxEl.value];
    if (!data) return;

    displayTrails(data.state);
    trailDetailPanel.style.display = "flex";

    getWeatherData(data.latitude, data.longitude);
    document.querySelector("#trailDescription").innerHTML = data.text;
    document.getElementById("koolAidMan").setAttribute("src", data.image);

    updateSaveButtonData(data);
    updateSaveButtonText(data.title);
    renderFavorite();
  }
});

function renderFavorite() {
  favoriteBoxEl.innerHTML = "";
  if (favoriteData !== null) {
    for (var [key] of Object.entries(favoriteData)) {
      favoriteBoxEl.insertAdjacentHTML("beforeend", `<option>${key}</option>`);
    }
  }
}

function saveFavoriteData() {
  localStorage.setItem("favoriteData", JSON.stringify(favoriteData));
}

function loadFavoriteData() {
  const stored = localStorage.getItem("favoriteData");
  if (stored !== null) {
    favoriteData = JSON.parse(stored);
  }
}

function updateSaveButtonText(title) {
  saveBtnEl.textContent =
    favoriteData !== null && title in favoriteData
      ? "Unsave Trail"
      : "Save Trail";
}

function updateSaveButtonData(data) {
  saveBtnEl.dataset.latitude = data.latitude;
  saveBtnEl.dataset.longitude = data.longitude;
  saveBtnEl.dataset.title = data.title;
  saveBtnEl.dataset.text = data.text;
  saveBtnEl.dataset.image = data.image;
  saveBtnEl.dataset.state = data.state;
}

// ── Init ───────────────────────────────────
loadFavoriteData();
renderFavorite();
