let city = document.getElementById("city");
let type = document.getElementById("type");
let temp = document.getElementById("temp");
let image = document.getElementById("img");
let input = document.getElementById("inp");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");
let windSpeed = document.getElementById("wind-speed");
let API_key = "8e1b80df880a70de880b2881fd0bd091";
let timezoneOffset = 0;
let continentElement = document.getElementById("continent");
let countryElement = document.getElementById("country");
let timeZoneElement = document.getElementById("time-zone");
async function data(search) {
    let getData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_key}&units=metric`);
    let jsonData = await getData.json();
    if (jsonData.cod == 400) {
        alert("Please Enter Location");
        image.src = "error1.jpeg";
        city.innerHTML = "";
        temp.innerHTML = "";
        type.innerHTML = "";
        humidity.innerHTML = "";
        pressure.innerHTML = "";
        windSpeed.innerHTML = "";
        return;
    }
    if (jsonData.cod == 404) {
        alert("Please Enter Correct Location");
        image.src = "error2.jpeg";
        city.innerHTML = search;
        temp.innerHTML = "";
        type.innerHTML = "";
        humidity.innerHTML = "";
        pressure.innerHTML = "";
        windSpeed.innerHTML = "";
        return;
    }
    city.innerHTML = jsonData.name;
    temp.innerHTML = Math.floor(jsonData.main.temp) + "°C";
    type.innerHTML = jsonData.weather[0].main;
    humidity.innerHTML = jsonData.main.humidity + "%";
    pressure.innerHTML = jsonData.main.pressure + " hPa";
    windSpeed.innerHTML = jsonData.wind.speed + " m/s";
    setImageAndBackground(type.innerHTML);
    input.value = "";
    timezoneOffset = jsonData.timezone;
    updateTimeAndDate();
    updatePlaceInfo(jsonData.coord.lat, jsonData.coord.lon);
}
function setImageAndBackground(weatherType) {
    switch (weatherType.toLowerCase()) {
        case "clouds":
            image.src = "clouds.png";
            document.body.style.backgroundImage = "url('cloudy.jpg')";
            break;
        case "clear":
            image.src = "clears.png";
            document.body.style.backgroundImage = "url('clear.jpg')";
            break;
        case "rain":
            image.src = "rain.png";
            document.body.style.backgroundImage = "url('Rain.jpg')";
            break;
        case "snow":
            image.src = "snow.png";
            document.body.style.backgroundImage = "url('snowy.jpg')";
            break;
        case "haze":
            image.src = "haze.png";
            document.body.style.backgroundImage = "url('haze.jpg')";
            break;
        case "storm":
            image.src = "strom.png";
            document.body.style.backgroundImage = "url('storm.jpg')";
            break;
        case "mist":
            image.src = "mist.png";
            document.body.style.backgroundImage = "url('mist.jpg')";
            break;
        default:
            image.src = "default.png";
            document.body.style.backgroundImage = "url('default.jpg')";
            break;
    }
}
function myFun() {
    let search = input.value;
    data(search);
}
function updateTimeAndDate() {
    const timeElement = document.getElementById('time');
    const amPmElement = document.getElementById('am-pm');
    const dateElement = document.getElementById('date');
    const now = new Date();
    const localTime = new Date(now.getTime() + (timezoneOffset * 1000) + (now.getTimezoneOffset() * 60000));
    let hours = localTime.getHours();
    const minutes = localTime.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedTime = `${hours}:${formattedMinutes}`;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayOfWeek = days[localTime.getDay()];
    const month = months[localTime.getMonth()];
    const day = localTime.getDate();
    const formattedDate = `${dayOfWeek}, ${day} ${month}`;
    timeElement.innerHTML = `${formattedTime} <span id="am-pm">${amPm}</span>`;
    dateElement.textContent = formattedDate;
}
function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`)
        .then(response => response.json())
        .then(jsonData => {
            city.innerHTML = jsonData.name;
            temp.innerHTML = Math.floor(jsonData.main.temp) + "°C";
            type.innerHTML = jsonData.weather[0].main;
            humidity.innerHTML = jsonData.main.humidity + "%";
            pressure.innerHTML = jsonData.main.pressure + " hPa";
            windSpeed.innerHTML = jsonData.wind.speed + " m/s";
            setImageAndBackground(type.innerHTML);
            timezoneOffset = jsonData.timezone;
            updateTimeAndDate();
            updatePlaceInfo(jsonData.coord.lat, jsonData.coord.lon);
        });
}
function updatePlaceInfo(lat, lon) {
    fetch(`https://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&username=demo`)
        .then(response => response.json())
        .then(jsonData => {
            countryElement.innerHTML = jsonData.geonames[0].countryName;
            timezoneOffset = jsonData.geonames[0].timezone.gmtOffset;
            timeZoneElement.innerHTML = jsonData.geonames[0].timezone.id;
        })
        .catch(error => console.log('Error:', error));
}
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
setInterval(updateTimeAndDate, 1000);
getCurrentLocationWeather();
