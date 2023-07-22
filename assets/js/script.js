var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#cityInput');

var currentCity = document.querySelector('#city');

var apiKey = '6d16b9f1f20092ca89c4382c6758f30c';

var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        // set current city name
        currentCity.textContent += city;
        getCoords(city);

        // currentCity.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};

// get coords from city input using geocoding API
var getCoords = function (city) {
    var limit = 1;

    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log("response: ", response);
                response.json().then(function (data) {
                    console.log("data: ", data);
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                
                    getCurrentWeather(lat, lon);
                    get5DayWeather(lat, lon);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openweathermap API');
        });
};

// use coords to get current weather
var getCurrentWeather = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log("current weather: ", data);
                    // displayCurrentWeather(data, user);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openweathermap API');
        });
};

// use coords to get 5 day weather forecast
var get5DayWeather = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log("5 day forecast: ", data);
                    // displayRepos(data, user);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openweathermap API');
        });
};

cityFormEl.addEventListener('submit', formSubmitHandler);