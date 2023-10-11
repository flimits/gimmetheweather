var searchForm = document.querySelector("#form-inline");
var searchCity = document.querySelector("#search-city");
var state = "ca";
var apiKey = "3d08e285a7104854e880e77d9ed464c9";
var mainWeatherBox = document.querySelector(".card-title");
var mainTemp = document.querySelector(".card-temp");
var mainWind = document.querySelector(".card-wind");
var mainHumidity = document.querySelector(".card-humidity");
var fiveDayDiv = document.getElementById("box-1")

var todaysDate = dayjs().format('MM/DD/YYYY');

var buildSearchData = function (event) {
    var cityToSearch = searchCity.value.trim();
    event.preventDefault();

    console.log("value of city to search is: " + cityToSearch);

    longAndLat(cityToSearch, state)
}

function longAndLat(city, state) {
    if (!city) {
        alert("You need to enter a city. Please try again");
        return;
    }

    if (!state || state === "" || state === null) {
        alert("No state found");
        return;
    } else

        var lalUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + "," + "&limit=1&appid=" + apiKey;
    console.log("Long and Lat " + lalUrl)

    fetch(lalUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (doResponse) {
            console.log("here is lat:_ " + doResponse[0].lat + " and long is:_ " + doResponse[0].lon);
            var lonTude = doResponse[0].lon;
            var latTude = doResponse[0].lat;

            goGetWeather(city, state, lonTude, latTude)

        });
}


var goGetWeather = function (city, state, lonTude, latTude) {

    var buildWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latTude + "&lon=" + lonTude + "&appid=" + apiKey + "&units=imperial";
    console.log("the weather url to use is " + buildWeatherURL)

    fetch(buildWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (doWeather) {
            console.log("Todays Date: " + todaysDate)
            console.log("City Name: " + doWeather.name);
            console.log("Temp: " + doWeather.main.temp + "°F");
            console.log("Weather: " + doWeather.weather[0].main);
            console.log("Wind: " + doWeather.wind.speed + " MPH");
            console.log("Humidity: " + doWeather.main.humidity + " %");

            mainWeatherBox.textContent = doWeather.name + " (" + todaysDate + ") " + doWeather.weather[0].main;
            mainTemp.textContent = "Temp: " + doWeather.main.temp + "°F";
            mainWind.textContent = "Wind: " + doWeather.wind.speed + " MPH"
            mainHumidity.textContent = "Humidity: " + doWeather.main.humidity + " %"

            goGetForcast(lonTude, latTude)
        });
}


var goGetForcast = function (lonTude, latTude) {
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latTude + "&lon=" + lonTude + "&appid=" + apiKey + "&units=imperial";

    console.log("the url for 5 day forcast is:_ " + fiveDayURL)
    fetch(fiveDayURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (doFiveDay) {

            for (var i = 0; i < 5; i++) {
                console.log("temp 0 of 5 day forcast: " + doFiveDay.list[i].main.temp + "°F")
                console.log("wind 0 of 5 day forcast: " + doFiveDay.list[i].wind.speed)
                console.log("humidity 0 of 5 day forcast: " + doFiveDay.list[i].main.humidity)
                // This below is suppose to be a way to populate the 5-da forecast boxes. ... I woulc have been done, except I ran out of time.
                // Below is not the proper format. I need to build the p and append to the main div, not each box individually.
                    // p1 = document.createElement("p");
                    // p1.innerHTML = doFiveDay.list[i].main.temp + "°F";
                    // fiveDayDiv.append(p1);
            }

        });


}

searchForm.addEventListener("submit", buildSearchData);