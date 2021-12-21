$("#trailListBox").hide();
$("#trailDescriptionBoxes").hide();

var weatherData;
var trailsData;
let favoriteData = {};

var selectState = document.querySelector("#selectState");

var imgEl = document.querySelectorAll("img");
var dateEl = document.getElementsByClassName("Date");
var dayEl = document.getElementsByClassName("Day");
var maxEl = document.getElementsByClassName("Max");
var minEl = document.getElementsByClassName("Min");
var windEl = document.getElementsByClassName("Wind");
var weatherMainEl = document.getElementsByClassName("WeatherMain");
var weatherDesEl = document.getElementsByClassName("WeatherDes");
var menuList = document.querySelector(".menu");
var searchBtn = document.querySelector("#searchBtn");
var hiddenObj = document.querySelectorAll(".hidden");

var saveBtnEl = document.getElementById("trailSaver");
var favoriteBoxEl = document.getElementById("selectFavorite");
var favoriteButtonEl = document.getElementById("favoriteButton");

var defaultEl = document.getElementById("selectDefault");

searchBtn.addEventListener("click", function () {
    var state = selectState.value
    if (state !== defaultEl.textContent) {
        displayTrails(state);
    }
});

function getWeatherData(latitude, longitude) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly&appid=31ed1d78ece05a26dbb0c6020e7b32b5&units=imperial";
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    weatherData = data;
                    renderWeather();
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Did not get a response");
        });
};

function renderWeather() {
    for (var i = 0; i < dateEl.length; i++) {
        var current = weatherData.daily[i];

        imgEl[i].src = "assets/images/" + current.weather[0].description + ".jpg"

        dateEl[i].textContent = unixConversion(current.dt);
        dayEl[i].textContent = current.temp.day + "\u00B0F";
        maxEl[i].textContent = "High: " + current.temp.max + "\u00B0F";
        minEl[i].textContent = "Low: " + current.temp.min + "\u00B0F";
        windEl[i].textContent = current.wind_speed + " MPH";
        weatherMainEl[i].textContent = current.weather[0].main;
        weatherDesEl[i].textContent = current.weather[0].description;

    }
};

function unixConversion(unix) {
    var date = new Date(unix * 1000);
    var temp = date.toDateString();
    temp = temp.substring(0, temp.length - 4);
    return temp;
}

function displayTrails(state) {
    $("#trailListBox").show();

    var apiUrl = "https://developer.nps.gov/api/v1/places?statecode=" + state + "&limit=20&q=trails&api_key=WdgBOclP1YDr6ZIL0vXfInjZRVwmb8VjKrcvwpoZ";

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    trailsData = data;
                    updateUI();
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].latitude != "" || data.data[i].longitude != ""){
                            var item = document.createElement("li");
                         
                          
                            item.dataset.latitude = data.data[i].latitude;
                            item.dataset.longitude = data.data[i].longitude;
                            item.textContent = data.data[i].title;
                            item.dataset.text = data.data[i].bodyText;
                            item.dataset.image = data.data[i].images[0].url;
                            item.dataset.state = state;
                            item.addEventListener("click", function setDescription(event) {
                                $("#trailDescriptionBoxes").show();
                                getWeatherData(event.target.dataset.latitude, event.target.dataset.longitude);
                                var trailDescription = document.querySelector("#trailDescription");
                                trailDescription.innerHTML = event.target.dataset.text; //dataset stores extra information  
                                var koolAidMan = document.getElementById("koolAidMan");
                                koolAidMan.setAttribute("src", event.target.dataset.image);
                                updateSaveButtonText(this.textContent);
                                
                                saveBtnEl.dataset.latitude = event.target.dataset.latitude;
                                saveBtnEl.dataset.longitude = event.target.dataset.longitude;
                                saveBtnEl.dataset.title = event.target.textContent;
                                saveBtnEl.dataset.text = event.target.dataset.text;
                                saveBtnEl.dataset.image = event.target.dataset.image;
                                saveBtnEl.dataset.state = event.target.dataset.state;
                            });
                            menuList.appendChild(item);
                            
                        }
                    }
                });
            }
        });
};

function updateUI() {
    menuList.replaceChildren();
}


// Adds scroll effect for background image
(function () {

    var parallax = document.querySelectorAll("html"),
        speed = 0.7;

    window.onscroll = function () {
        [].slice.call(parallax).forEach(function (el, i) {

            var windowYOffset = window.pageYOffset,
                elBackgrounPos = "50% " + (windowYOffset * speed) + "px";

            el.style.backgroundPosition = elBackgrounPos;

        });
    };
})();

saveBtnEl.addEventListener("click", function() {
    var title = saveBtnEl.dataset.title;
    
    if (!(title in favoriteData)) {
        favoriteData[saveBtnEl.dataset.title] = {
            title: title,
            longitude: saveBtnEl.dataset.longitude,
            latitude: saveBtnEl.dataset.latitude,
            text: saveBtnEl.dataset.text,
            image: saveBtnEl.dataset.image,
            state: saveBtnEl.dataset.state
        };
    } else {
        delete favoriteData[title]; 
    }
    saveFavoriteData();
    renderFavorite();
    updateSaveButtonText(title);
    console.log(favoriteData);
});

favoriteButtonEl.addEventListener("click", function() {
    if (favoriteBoxEl.value !== '') {
        var data = favoriteData[favoriteBoxEl.value];

        displayTrails(data.state);

        $("#trailDescriptionBoxes").show();
        getWeatherData(data.latitude, data.longitude);
        var trailDescription = document.querySelector("#trailDescription");
        trailDescription.innerHTML = data.text; //dataset stores extra information  
        var koolAidMan = document.getElementById("koolAidMan");
        koolAidMan.setAttribute("src", data.image);
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
    if (localStorage.getItem("favoriteData") !== null) {
        favoriteData = JSON.parse(localStorage.getItem("favoriteData"));
    }
}

function updateSaveButtonText(title) {
    if (favoriteData !== null && title in favoriteData) {
        saveBtnEl.textContent = "Unsave";
    } else {
        saveBtnEl.textContent = "Save";
    }
}

function updateSaveButtonData(data) {
    saveBtnEl.dataset.latitude = data.latitude;
    saveBtnEl.dataset.longitude = data.latitude;
    saveBtnEl.dataset.title = data.title;
    saveBtnEl.dataset.text = data.text;
    saveBtnEl.dataset.image = data.image;
    saveBtnEl.dataset.state = data.state;
}

loadFavoriteData();
renderFavorite();
