// ================= SELECT ELEMENTS =================
var inputvalue = document.querySelector('#cityinput');
var btn = document.querySelector('#add');
var city = document.querySelector('#cityoutput');
var description = document.querySelector('#description');
var temp = document.querySelector('#temp');
var wind = document.querySelector('#wind');
var humidity = document.querySelector('#humidity');
var feelsLike = document.querySelector('#feelslike');
var icon = document.querySelector('#icon');
var loader = document.querySelector('.loader'); // using class loader
var wrapper = document.querySelector('.wrapper');

var apiKey = '1bea3135f7b149c705ac1f23815521b2';

// Hide loader initially
loader.style.display = "none";


// ================= MAIN WEATHER =================
btn.addEventListener('click', function () {

    var inputValue = inputvalue.value.trim();

    if (inputValue === "") {
        alert("Please enter city name");
        return;
    }

    // SHOW LOADER
    loader.style.display = "flex";
    wrapper.style.display = "none";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {

            if (data.cod !== 200) {
                throw new Error(data.message);
            }

            // Update Current Weather UI
            city.innerHTML = 'Weather of <span>' + data.name + '</span>';
            description.innerHTML = 'Sky conditions: <span>' + data.weather[0].description + '</span>';
            temp.innerHTML = 'Temperature: <span>' + data.main.temp + ' °C</span>';
            wind.innerHTML = 'Wind speed: <span>' + data.wind.speed + ' km/h</span>';
            humidity.innerHTML = 'Humidity: <span>' + data.main.humidity + ' %</span>';
            feelsLike.innerHTML = 'Feels Like: <span>' + data.main.feels_like + ' °C</span>';

            var iconCode = data.weather[0].icon;
            icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            // Smooth animation trigger
            wrapper.classList.remove('fade-update');
            void wrapper.offsetWidth;
            wrapper.classList.add('fade-update');

            // Call forecast
            getForecast(data.name);

            // HIDE LOADER
            loader.style.display = "none";
            wrapper.style.display = "block";

        })
        .catch(err => {
            loader.style.display = "none";
            wrapper.style.display = "block";
            alert("Error: " + err.message);
        });

});


// ================= 5 DAY FORECAST =================
function getForecast(cityName) {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {

            const forecastContainer = document.getElementById("forecast");
            forecastContainer.innerHTML = "";

            for (let i = 0; i < data.list.length; i += 8) {

                const dayData = data.list[i];
                const date = new Date(dayData.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                const dayTemp = dayData.main.temp;
                const iconCode = dayData.weather[0].icon;

                const card = `
                    <div class="forecast-card">
                        <p>${dayName}</p>
                        <img src="https://openweathermap.org/img/wn/${iconCode}.png">
                        <p>${dayTemp}°C</p>
                    </div>
                `;

                forecastContainer.innerHTML += card;
            }
        });
}


// ================= DATE & TIME =================
function updateDateTime() {

    const now = new Date();

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    document.getElementById("date").textContent =
        now.toLocaleDateString('en-US', options);

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    document.getElementById("time").textContent =
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();
