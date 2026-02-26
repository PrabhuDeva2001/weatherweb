var inputvalue = document.querySelector('#cityinput');
var btn = document.querySelector('#add');
var city = document.querySelector('#cityoutput');
var description = document.querySelector('#description');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var apiKey = '1bea3135f7b149c705ac1f23815521b2';

/* ============================= */
/*         DATE & TIME           */
/* ============================= */

var dateElement = document.querySelector('#date');
var timeElement = document.querySelector('#time');

function updateDateTime() {
    var now = new Date();

    var dateOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    var formattedDate = now.toLocaleDateString("en-IN", dateOptions);
    var formattedTime = now.toLocaleTimeString("en-IN");

    dateElement.innerHTML = formattedDate;
    timeElement.innerHTML = formattedTime;
}

updateDateTime();
setInterval(updateDateTime, 1000);


/* ============================= */
/*      WEATHER FUNCTION         */
/* ============================= */

function convertTemperature(val) {
    return (val - 273).toFixed(2);
}

btn.addEventListener('click', function() {

    var inputValue = inputvalue.value;

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputValue + '&appid=' + apiKey)
        .then(res => res.json())
        .then(data => {

            var nameVal = data.name;
            var descrip = data.weather[0].description;
            var tempature = data.main.temp;
            var windSpeed = data.wind.speed;

            city.innerHTML = 'Weather of <span>' + nameVal + '</span>';
            temp.innerHTML = 'Temperature: <span>' + convertTemperature(tempature) + ' °C</span>';
            description.innerHTML = 'Sky conditions: <span>' + descrip + '</span>';
            wind.innerHTML = 'Wind speed: <span>' + windSpeed + ' km/h</span>';

            /* ============================= */
            /*        RAIN EFFECT            */
            /* ============================= */

            if (
                data.weather[0].main.toLowerCase().includes("rain") ||
                data.weather[0].description.toLowerCase().includes("rain")
            ) {
                document.querySelector('.rain').style.display = 'block';
            } else {
                document.querySelector('.rain').style.display = 'none';
            }

        })
        .catch(err => alert('You Entered Wrong City name'));
});
