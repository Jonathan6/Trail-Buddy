var weatherData;

var imgEl = document.querySelectorAll("img");
var dateEl = document.getElementsByClassName("Date");
var dayEl = document.getElementsByClassName("Day");
var maxEl = document.getElementsByClassName("Max");
var minEl = document.getElementsByClassName("Min");
var windEl = document.getElementsByClassName("Wind");
var weatherMainEl = document.getElementsByClassName("WeatherMain");
var weatherDesEl = document.getElementsByClassName("WeatherDes");

// Input: Need Latitude, Longitude, API key (https://openweathermap.org/api/one-call-api)
function getWeatherData(input) {
    // TODO: get actual OPEN WEATHER API url and key
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=47.466605&lon=-121.655338&exclude=current,minutely,hourly&appid=31ed1d78ece05a26dbb0c6020e7b32b5&units=imperial";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function (data) {
                    weatherData = data;
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

        imgEl[i].src = "assets/images/" + current.weather[0].main + ".jpg"

        dateEl[i].textContent = unixConversion(current.dt);
        dayEl[i].textContent = current.temp.day + "\u00B0F";
        maxEl[i].textContent = "High: " + current.temp.max + "\u00B0F";
        minEl[i].textContent = "Low: " + current.temp.min + "\u00B0F";
        windEl[i].textContent = current.wind_speed + " MPH";
        weatherMainEl[i].textContent = current.weather[0].main;
        weatherDesEl[i].textContent = current.weather[0].description; 

    }
}

function saveDataLocal() {
    localStorage.setItem("TESTING", JSON.stringify(weatherData));
}

function loadDataLocal() {
    weatherData = JSON.parse(localStorage.getItem("TESTING"));
}

function unixConversion(unix) {
    var date = new Date(unix*1000);
    var temp = date.toDateString();
    temp = temp.substring(0, temp.length - 4);
    return temp;
}