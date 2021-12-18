var weatherData;
var trailsData;

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

searchBtn.addEventListener("click", function() {
    if (selectState.value !== 'Select dropdown') {
        displayTrails();
    }
});

function getWeatherData(latitude, longitude) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude +"&lon=" + longitude +"&exclude=current,minutely,hourly&appid=31ed1d78ece05a26dbb0c6020e7b32b5&units=imperial";
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

function displayTrails(){
    var state = selectState.value  //because options is an array,selected index is the index of the one we have currently selelcted
    
    var apiUrl = "https://developer.nps.gov/api/v1/places?statecode=" + state + "&limit=10&q=trails&api_key=WdgBOclP1YDr6ZIL0vXfInjZRVwmb8VjKrcvwpoZ";
    
    unHide();

    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                trailsData = data;
                console.log(data);
                updateUI();
                for (var i = 0; i < data.data.length; i++) {
                    var item = document.createElement("li");
                    item.dataset.latitude = data.data[i].latitude;
                    item.dataset.longitude = data.data[i].longitude;
                    item.textContent = data.data[i].title;
                    item.dataset.text = data.data[i].bodyText;
                    item.dataset.image = data.data[i].images[0].url;
                    item.addEventListener("click", function setDescription(event) {
                        getWeatherData(event.target.dataset.latitude, event.target.dataset.longitude); 
                        var trailDescription = document.querySelector("#trailDescription");
                        trailDescription.innerHTML = event.target.dataset.text; //dataset stores extra information  
                        var koolAidMan = document.getElementById("koolAidMan");
                        koolAidMan.setAttribute("src", event.target.dataset.image);
                    });

                    menuList.appendChild(item);
                }
            });
        }
    });
};

function updateUI() {
    menuList.replaceChildren();
}

function unHide() {
    for (var i = hiddenObj.length-1; i >= 0; i--) {
        hiddenObj[i].classList.remove("hidden");
    }
}

// Adds scroll efect for background image
(function(){

    var parallax = document.querySelectorAll("body"),
        speed = 0.7;
  
    window.onscroll = function(){
      [].slice.call(parallax).forEach(function(el,i){
  
        var windowYOffset = window.pageYOffset,
            elBackgrounPos = "50% " + (windowYOffset * speed) + "px";
  
        el.style.backgroundPosition = elBackgrounPos;
  
      });
    };
  
  })();