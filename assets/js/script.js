var searchForm = document.querySelector("#form-inline");
var searchCity = document.querySelector("#search-city");
var searchState = document.querySelector("#search-state");
// var state = "ca";
var apiKey = "3d08e285a7104854e880e77d9ed464c9";
var mainWeatherBox = document.querySelector(".card-title");
var mainWeatherCondition = document.querySelector(".card-condition");
var mainTemp = document.querySelector(".card-temp");
var mainWind = document.querySelector(".card-wind");
var mainHumidity = document.querySelector(".card-humidity");
var fiveDayDiv = document.getElementById("box-1")

var todaysDate = dayjs().format('MM/DD/YYYY');

var buildSearchData = function (event) {
    var cityToSearch = searchCity.value.trim();
    var stateToSearch = searchState.value.trim().toUpperCase();

    event.preventDefault();

    console.log("value of city to search is: " + cityToSearch);

    longAndLat(cityToSearch, stateToSearch)
}

function longAndLat(city, stateToSearch) {
    if (!city) {
        alert("You need to enter a city. Please try again");
        return;
    }

    if (!stateToSearch || stateToSearch === "" || stateToSearch === null) {
        alert("No state found");
        return;
    } else

        var lalUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + stateToSearch + "," + "&limit=1&appid=" + apiKey;
    console.log("Long and Lat " + lalUrl)

    fetch(lalUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (doResponse) {
            console.log("here is lat:_ " + doResponse[0].lat + " and long is:_ " + doResponse[0].lon);
            var lonTude = doResponse[0].lon;
            var latTude = doResponse[0].lat;

            goGetWeather(city, stateToSearch, lonTude, latTude)

        });
}


var goGetWeather = function (city, stateToSearch, lonTude, latTude) {

    var buildWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latTude + "&lon=" + lonTude + "&appid=" + apiKey + "&units=imperial";
    console.log("the weather url to use is " + buildWeatherURL)

    var weatherIconUrl = 'https://openweathermap.org/img/wn/';

    fetch(buildWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (doWeather) {
            // Create an image element for the weather icon
            var iconImg = document.createElement('img');
            iconImg.src = `${weatherIconUrl}${doWeather.weather[0].icon}@2x.png`;  // Use the icon code from the API response

            // Find the #weather-icon div and append the iconImg to it
            var weatherIconContainer = document.getElementById('weather-icon');
            weatherIconContainer.innerHTML = '';  // Clear previous content
            weatherIconContainer.appendChild(iconImg);

            // Display the weather condition
            mainWeatherCondition.textContent = "Condition: " + doWeather.weather[0].main;
            console.log("the icon code is: " + iconImg.src + " icon name " + doWeather.weather[0].main + " text content " + mainWeatherCondition.textContent)

            console.log("Todays Date: " + todaysDate)
            console.log("City Name: " + doWeather.name);
            console.log("Temp: " + doWeather.main.temp + "°F");
            console.log("Weather: " + doWeather.weather[0].main);
            console.log("Wind: " + doWeather.wind.speed + " MPH");
            console.log("Humidity: " + doWeather.main.humidity + " %");


            mainWeatherBox.textContent = doWeather.name + "," + stateToSearch + " (" + todaysDate + ") " + doWeather.weather[0].main;
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
            // Loop through the forecast data
            for (var i = 0; i < 5; i++) {
                // Find the existing box element
                var boxElement = document.querySelector('.box-' + i);

                // Create the title of eac day in the 5-day forcast
                var dayTitle = document.createElement('h3');
                dayTitle.textContent = 'Day ' + (i + 1);

                // How about we get the icon in those boxes too
                var iconImg = document.createElement('img');
                iconImg.src = 'https://openweathermap.org/img/wn/' + doFiveDay.list[i].weather[0].icon + '.png';

                // Create and populate elements for the forecast data (adjust as needed)
                var tempParagraph = document.createElement('p');
                tempParagraph.textContent = 'Temp: ' + doFiveDay.list[i].main.temp + '°F';

                var windParagraph = document.createElement('p');
                windParagraph.textContent = 'Wind: ' + doFiveDay.list[i].wind.speed + ' MPH';

                var humidityParagraph = document.createElement('p');
                humidityParagraph.textContent = 'Humidity: ' + doFiveDay.list[i].main.humidity + '%';

                // Append the elements to the existing boxElement
                boxElement.innerHTML = '';  // Clear previous content
                boxElement.appendChild(dayTitle);
                boxElement.appendChild(iconImg);
                boxElement.appendChild(tempParagraph);
                boxElement.appendChild(windParagraph);
                boxElement.appendChild(humidityParagraph);
            }
        });
}


searchForm.addEventListener("submit", buildSearchData);