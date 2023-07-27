var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#cityInput');
var cityHistoryButton = $('#city-history');

var presentForecast = document.querySelector('#present-forecast');
var futureForecast = document.querySelector('#future-forecast');

var currentCity = document.querySelector('#city');
var currentTemp = document.querySelector('#temp');
var currentWind = document.querySelector('#wind');
var currentHumidity = document.querySelector('#humidity');

var city;

var todayDate = dayjs().format('MM/DD/YYYY');

var apiKey = '6d16b9f1f20092ca89c4382c6758f30c';

// listener for search button
var formSubmitHandler = function (event) {
    event.preventDefault();

    city = cityInputEl.value.trim();

    if (city) {
        cityInputEl.value = '';

        saveLocalStorage(city);
        getCoords(city);
        renderHistory();

    } else {
        alert('Please enter a city');
    }
};

function saveLocalStorage(city) {
    // add city to localStorage
    // if empty, then set to an empty arr
    var citiesArr = JSON.parse(localStorage.getItem("cities")) || [];

    let exists = false;

    // check if city exists already in localStorage
    for (const savedCity of citiesArr) {
        if (savedCity === city) {
            exists = true;
        }
    }

    // first time searching city, push city to array
    if (exists === false) {
        citiesArr.push(city);
    }

    localStorage.setItem("cities", JSON.stringify(citiesArr));
}

// get coords from city input using geocoding API
var getCoords = function (city) {
    var limit = 1;

    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                // console.log("response: ", response);
                response.json().then(function (data) {
                    // console.log("data: ", data);
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
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    // console.log("current weather: ", data);
                    displayCurrentWeather(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openweathermap API');
        });
};

var displayCurrentWeather = function (data) {
    // empty before displaying
    $("#present-forecast").empty();

    var date = ' (' + todayDate + ')';

    var html = $(`
        <h3 id="city">${city} ${date}<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></h3>
        <h3 id="temp">Temp: ${data.main.temp} °F</h3>
        <h3 id="wind">Wind: ${data.wind.speed} MPH</h3>
        <h3 id="humidity">Humidity: ${data.main.humidity}%</h3>
    `)

    $("#present-forecast").append(html);
}

// use coords to get 5 day weather forecast
var get5DayWeather = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                // console.log(response);
                response.json().then(function (data) {
                    // console.log("5 day forecast: ", data);
                    display5DayForecast(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to openweathermap API');
        });
};

var display5DayForecast = function (data) {
    $("#future-forecast").empty();

    var row = $(`
        <div class="row">
    `)

    for (var i = 1; i < 6; i++){
        var ind = (i - 1) * 8;
        var dataIndex = data.list[ind];

        var date = dayjs().add(i, 'day').format('MM/DD/YYYY');

        var card = $(`
            <div class="col card">
                <h5 id="date-${i}" class="card-header text-uppercase lightblue-bg">${date}<img
                        src="https://openweathermap.org/img/wn/03n@2x.png"></h5><span id="icon-${i}"></span>
                <h6 id="temp-${i}">Temp: ${dataIndex.main.temp} °F</h6>
                <h6 id="wind-${i}">Wind: ${dataIndex.wind.speed} MPH</h6>
                <h6 id="humidity-${i}">Humidity: ${dataIndex.main.humidity}%</h6>
            </div>
        `)
        row.append(card);
    }
    $("#future-forecast").append(row);
}


function renderHistory() {
    var cityStorage = localStorage.getItem("cities");
    var citiesArr = JSON.parse(cityStorage);
    // retrieve div for id of recent-searches
    var recentSearchesEl = document.querySelector('#recent-searches');

    // clear history element first before adding buttons
    recentSearchesEl.innerHTML = "";

    // adding buttons for searched cities
    if (cityStorage !== null) {
        for (var i = 0; i < citiesArr.length; i++) {
            var html = $(`
            <div class="container">
                <div class="row history-div">
                    <div class="col-9"><button class="btn btn-secondary">${citiesArr[i]}</button></div>
                    <div class="col-3"><button class="btn btn-danger">X</button></div>
                </div>
            </div>
            `)

            $("#recent-searches").append(html);
        }
    }
}

$(document).ready(function () {
    // assumes that these elements are already in the html 
    // var historyButton = $(".btn-secondary");
    // var deleteButton = $(".btn-danger");

    // city history button
    $("#recent-searches").on("click", ".btn-secondary", function (event) {
        var cityHistory = event.target.textContent;
        city = cityHistory;

        // clear current and 5-day forecast
        presentForecast.textContent = '';
        futureForecast.textContent = '';

        getCoords(cityHistory);
    });

    // delete button
    $("#recent-searches").on("click", ".btn-danger", function (event) {
        var cityToDelete = $(this).parent().parent().children()[0].textContent;
        var cityStorage = localStorage.getItem("cities");
        var citiesArr = JSON.parse(cityStorage);

        // find index of element to remove
        const index = citiesArr.indexOf(cityToDelete);

        // delete if item is found
        if (index > -1) {
            // 2nd parameter to remove one item only
            citiesArr.splice(index, 1);
        }

        // update localStorage after deleting entry from array
        localStorage.setItem("cities", JSON.stringify(citiesArr));
        renderHistory();
        location.reload();
    });
});


// The init() function fires when the page is loaded 
function init() {
    renderHistory();
}
init();

cityFormEl.addEventListener('submit', formSubmitHandler);