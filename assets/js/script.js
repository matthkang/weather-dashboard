var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#cityInput');
var cityHistoryButton = $('#city-history');

var presentForecast = document.querySelector('#present-forecast');
var futureForecast = document.querySelector('#future-forecast');

var currentCity = document.querySelector('#city');
var currentTemp = document.querySelector('#temp');
var currentWind = document.querySelector('#wind');
var currentHumidity = document.querySelector('#humidity');

// objs to store in local storage
// var currentWeatherObj;
// var futureWeatherObj;

var city;

var todayDate = dayjs().format('MM/DD/YYYY');

var apiKey = '6d16b9f1f20092ca89c4382c6758f30c';

// listener for search button
var formSubmitHandler = function (event) {
    event.preventDefault();

    city = cityInputEl.value.trim();

    if (city) {
        saveLocalStorage(city);
        getCoords(city);
        renderHistory();

        presentForecast.textContent = '';
        futureForecast.textContent = '';

        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};

function saveLocalStorage(city) {
    // add city to localStorage
    var cityStorage = localStorage.getItem("cities");

    // retrieve arr from localStorage or create new arr
    if (cityStorage !== null) {
        var citiesArr = JSON.parse(cityStorage);
    }
    else {
        var citiesArr = [];
    }

    let exists = false;

    // check if city exists already in localStorage
    for (var i = 0; i < citiesArr.length; i++) {
        // if city already exists
        if (citiesArr.includes(city)) {
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

    var apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${apiKey}`;

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
    // set current city name and weather icon
    var date = ' (' + todayDate + ')';
    var h3City = document.createElement('h3');
    h3City.setAttribute('id', 'city');
    city += date;
    h3City.textContent += (city);

    var val = data.weather[0].icon,
        src = 'https://openweathermap.org/img/wn/' + val + '@2x.png',
        img = document.createElement('img');

    img.src = src;
    var weatherIcon = img;
    h3City.append(weatherIcon);
    presentForecast.appendChild(h3City);

    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;

    // currentWeatherObj = {
    //     city: city,
    //     weatherIcon: weatherIcon,
    //     temp: temp,
    //     wind: wind,
    //     humidity: humidity,
    // };

    // console.log(currentWeatherObj);

    var h3Temp = document.createElement('h3');
    h3Temp.setAttribute('id', 'temp');

    var h3Wind = document.createElement('h3');
    h3Wind.setAttribute('id', 'wind');

    var h3Humidity = document.createElement('h3');
    h3Humidity.setAttribute('id', 'humidity');


    h3Temp.textContent = ("Temp: " + temp + ' °F');
    h3Wind.textContent = ("Wind: " + wind + ' MPH');
    h3Humidity.textContent = ("Humidity: " + humidity + '%');

    presentForecast.appendChild(h3Temp);
    presentForecast.appendChild(h3Wind);
    presentForecast.appendChild(h3Humidity);
};


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
    var row = document.createElement('div');
    row.classList = 'row';

    for (var i = 1; i < 6; i++) {
        var col = document.createElement('div');
        col.classList = 'col card';

        // add date for next 5 days
        var h5El = document.createElement('h5');
        h5El.setAttribute('id', 'date-' + i);
        h5El.classList = 'card-header text-uppercase lightblue-bg';

        var date = dayjs().add(i, 'day').format('MM/DD/YYYY');
        h5El.textContent = date;

        // weather icon
        var icon = document.createElement('span');
        icon.setAttribute('id', 'icon-' + i);

        var ind = (i - 1) * 8;
        var dataIndex = data.list[ind];
        var val = dataIndex.weather[0].icon,
            src = 'https://openweathermap.org/img/wn/' + val + '@2x.png',
            img = document.createElement('img');

        img.src = src;
        var weatherIcon = img;
        h5El.appendChild(weatherIcon);

        var tempVal = dataIndex.main.temp;
        var windVal = dataIndex.wind.speed;
        var humidityVal = dataIndex.main.humidity;

        // futureWeatherObj = {
        //     date: date,
        //     weatherIcon: weatherIcon,
        //     temp: tempVal,
        //     wind: windVal,
        //     humidity: humidityVal,
        // }
        // console.log("futureWeatherObj: ", futureWeatherObj);

        // temperature
        var temp = document.createElement('h6');
        temp.setAttribute('id', 'temp-' + i);
        temp.textContent = ("Temp: " + tempVal + ' °F');
        // wind
        var wind = document.createElement('h6');
        wind.setAttribute('id', 'wind-' + i);
        wind.textContent = ("Wind: " + windVal + ' MPH');
        // humidity
        var humidity = document.createElement('h6');
        humidity.setAttribute('id', 'humidity-' + i);
        humidity.textContent = ("Humidity: " + humidityVal + '%');

        row.appendChild(col);
        col.appendChild(h5El);
        col.appendChild(icon);
        col.appendChild(temp);
        col.appendChild(wind);
        col.appendChild(humidity);
    }

    futureForecast.appendChild(row);
};

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
            var containerDiv = document.createElement('div');
            containerDiv.classList = "container";

            var historyDiv = document.createElement('div');
            historyDiv.classList = "row history-div";

            var btnDiv = document.createElement('div');
            btnDiv.classList = "col-9";

            var btnDeleteDiv = document.createElement('div');
            btnDeleteDiv.classList = "col-3";

            var historyBtn = document.createElement('button');
            historyBtn.classList = "btn btn-secondary";
            historyBtn.textContent = citiesArr[i];

            var deleteBtn = document.createElement('button');
            deleteBtn.classList = "btn btn-danger";
            deleteBtn.textContent = "X";

            containerDiv.appendChild(historyDiv);
            btnDiv.appendChild(historyBtn);

            btnDeleteDiv.appendChild(deleteBtn);

            historyDiv.appendChild(btnDiv);
            historyDiv.appendChild(btnDeleteDiv);

            recentSearchesEl.appendChild(containerDiv);
        }
    }
}

$(document).ready(function() {
    var historyButton = $(".btn-secondary");
    var deleteButton = $(".btn-danger");

    historyButton.click(function(event){
        var cityHistory = event.target.textContent;
        city = cityHistory;

        // clear current and 5-day forecast
        presentForecast.textContent = '';
        futureForecast.textContent = '';

        getCoords(cityHistory);
    });

    deleteButton.click(function(event){
        var cityToDelete = $(this).parent().parent().children()[0].textContent;
        var cityStorage = localStorage.getItem("cities");
        var citiesArr = JSON.parse(cityStorage);

        // find index of element to remove
        const index = citiesArr.indexOf(cityToDelete);

        // delete if item is found
        if (index > -1){
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