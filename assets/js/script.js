var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#cityInput');

var presentForecast = document.querySelector('#present-forecast');
var futureForecast = document.querySelector('#future-forecast');

var currentCity = document.querySelector('#city');
var currentTemp = document.querySelector('#temp');
var currentWind = document.querySelector('#wind');
var currentHumidity = document.querySelector('#humidity');

var city;

var todayDate = dayjs().format('MM/DD/YYYY');

var apiKey = '6d16b9f1f20092ca89c4382c6758f30c';

var formSubmitHandler = function (event) {
    event.preventDefault();

    city = cityInputEl.value.trim();

    if (city) {
        getCoords(city);

        presentForecast.textContent = '';
        
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
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log("current weather: ", data);
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
    h3City.textContent += ("City: " + city + date);

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
                console.log(response);
                response.json().then(function (data) {
                    console.log("5 day forecast: ", data);
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

    for (var i = 1; i < 6; i++){
        var col = document.createElement('div');
        col.classList = 'col card';

        // add date for next 5 days
        var h5El = document.createElement('h5');
        h5El.setAttribute('id', 'date-' + i);
        h5El.classList = 'card-header text-uppercase';

        var date = dayjs().add(i, 'day').format('MM/DD/YYYY');
        h5El.textContent = date;

        // weather icon
        var icon = document.createElement('span');
        icon.setAttribute('id', 'icon-' + i);

        var ind = (i-1)*8;
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

cityFormEl.addEventListener('submit', formSubmitHandler);