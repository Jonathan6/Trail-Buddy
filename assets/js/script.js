var weatherData;

var imgEl = document.querySelectorAll("img");
var dateEl = document.getElementsByClassName("Date");
var dayEl = document.getElementsByClassName("Day");
var maxEl = document.getElementsByClassName("Max");
var minEl = document.getElementsByClassName("Min");
var windEl = document.getElementsByClassName("Wind");
var weatherMainEl = document.getElementsByClassName("WeatherMain");
var weatherDesEl = document.getElementsByClassName("WeatherDes");

//When the search button is clicked the functions will start.. Add location to the API to give weather of state
function getTrails(){
    displayTrails();
    
}
// Input: Need Latitude, Longitude, API key (https://openweathermap.org/api/one-call-api)
function getWeatherData(input) {
    // TODO: get actual OPEN WEATHER API url and key
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=47.466605&lon=-121.655338&exclude=current,minutely,hourly&appid=31ed1d78ece05a26dbb0c6020e7b32b5&units=imperial";
    fetch(apiUrl)
        .then(function (response) {
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
};

function saveDataLocal() {
    localStorage.setItem("TESTING", JSON.stringify(weatherData));
}

function loadDataLocal() {
    weatherData = JSON.parse(localStorage.getItem("TESTING"));
}

function unixConversion(unix) {
    var date = new Date(unix * 1000);
    var temp = date.toDateString();
    temp = temp.substring(0, temp.length - 4);
    return temp;
}

// Start of trails function
//When the user gives the state code he needs to be able to pull a list of trails in the given state 


var searchBtn = document.querySelector("#searchBtn");
searchBtn.addEventListener("click", getTrails);
var menuList = document.querySelector(".menu");

function displayTrails(){
    var selectState = document.querySelector("#selectState");
    var state = selectState.options[selectState.selectedIndex].value  //because options is an array,selected index is the index of the one we have currently selelcted

   
    var apiUrl = "https://developer.nps.gov/api/v1/places?statecode=" + state + "&limit=10&q=trails&api_key=WdgBOclP1YDr6ZIL0vXfInjZRVwmb8VjKrcvwpoZ"


    fetch(apiUrl)
    .then(function (response) {
        if (response.ok)
        response.json().then(function (data) {
            trailsData = data;
            console.log(data);
            updateUI();
            // setImage();
                    // var menuList = document.querySelector(".menu");
                    for (var i = 0; i < data.data.length; i++) {
                        var item = document.createElement("li");
                        item.textContent = data.data[i].title;
                        item.dataset.text = data.data[i].bodyText;
                        item.dataset.image = data.data[i].images[0].url;
                        item.addEventListener("click", function (event) {
                            var trailDescription = document.querySelector("#trailDescription");
                            trailDescription.innerHTML = event.target.dataset.text; //dataset stores extra information  
                            var koolAidMan = document.getElementById("koolAidMan");
                            koolAidMan.setAttribute("src", event.target.dataset.image);
                        })
                        
                        
                        
                        
                        
                        
                        menuList.appendChild(item);
                }
            });
    });
}

function updateUI() {
    console.log("Sup")
    menuList.replaceChildren();
}





// var trailEl = document.querySelector('ul');
var trailsData;






// function showTitle() {
//     for (var i = 0; i < trailsData.length; i++) {
//         var trails = trailsData.data.title;
//         trailEl
//         console.log(trailsData);
//     };
// };

// getTrailsData();
// showTitle();


// Ajane's adding image
// This is how we access the URL of the image we want
// trailsData.data[0].images[0].url
// var koolAidMan = document.getElementById("koolAidMan");
// function setImage() {
//     koolAidMan.src = trailsData.data[0].images[0].url;
// }
