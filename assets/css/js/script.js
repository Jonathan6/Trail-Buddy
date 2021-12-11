var weatherData;

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
    var apiUrl = "URL PLACEHOLDER" + input;
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