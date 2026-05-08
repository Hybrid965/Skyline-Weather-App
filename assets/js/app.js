//=====================================================================
// Weather Condition Codes
const weatherConditions = {
    0: { label: 'Clear sky', icon: '☀️' },
    1: { label: 'Mainly clear', icon: '🌤️' },
    2: { label: 'Partly cloudy', icon: '⛅' },
    3: { label: 'Overcast', icon: '☁️' },
    45: { label: 'Foggy', icon: '🌫️' },
    48: { label: 'Icy fog', icon: '🌫️' },
    51: { label: 'Light drizzle', icon: '🌦️' },
    53: { label: 'Drizzle', icon: '🌦️' },
    55: { label: 'Heavy drizzle', icon: '🌧️' },
    61: { label: 'Light rain', icon: '🌧️' },
    63: { label: 'Rain', icon: '🌧️' },
    65: { label: 'Heavy rain', icon: '🌧️' },
    71: { label: 'Light snow', icon: '🌨️' },
    73: { label: 'Snow', icon: '❄️' },
    75: { label: 'Heavy snow', icon: '❄️' },
    77: { label: 'Snow grains', icon: '🌨️' },
    80: { label: 'Light showers', icon: '🌦️' },
    81: { label: 'Showers', icon: '🌧️' },
    82: { label: 'Heavy showers', icon: '⛈️' },
    85: { label: 'Snow showers', icon: '🌨️' },
    86: { label: 'Heavy snow showers', icon: '❄️' },
    95: { label: 'Thunderstorm', icon: '⛈️' },
    96: { label: 'Thunderstorm', icon: '⛈️' },
    99: { label: 'Severe thunderstorm', icon: '⛈️' }
};
//=====================================================================
//Functions
//Function for dynamic background animations
function updateWeatherUI(code) {
    const weatherAnim = document.querySelector('#weather-animation');
    if (!weatherAnim) return;

    const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82];
    const snowCodes = [71, 73, 75, 77, 85, 86];
    const stormCodes = [95, 96, 99];
    let body = document.querySelector('body')

    if (code <= 1) { // Clear or Mainly Clear
        weatherAnim.setAttribute('src', 'https://lottie.host/84af1f9a-968c-43d2-861d-d17839dab9f7/6zd9IYLpKB.lottie');
        body.classList.add('sunny-glow');
    }

    else if (rainCodes.includes(code)) {
        weatherAnim.setAttribute('src', 'https://lottie.host/6562c01f-dac7-4a2a-ac81-9138db3bddbf/yrbxneHuF0.lottie');
        body.classList.remove('sunny-glow')
    }
    else if (snowCodes.includes(code)) {
        weatherAnim.setAttribute('src', 'https://lottie.host/f3a2d154-a4e2-43be-b348-a3cad637b8d1/vesOckjaNN.lottie');
        body.classList.remove('sunny-glow')
    }
    else if (stormCodes.includes(code)) {
        weatherAnim.setAttribute('src', 'https://lottie.host/6562c01f-dac7-4a2a-ac81-9138db3bddbf/yrbxneHuF0.lottie');
        body.classList.remove('sunny-glow')
    }

    else {
        // Default to a cloudy animation
        body.classList.remove('sunny-glow')
        weatherAnim.setAttribute('src', 'https://lottie.host/84af1f9a-968c-43d2-861d-d17839dab9f7/6zd9IYLpKB.lottie');
    }
}

// Degree Function
function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
}

//UV Index State Function
function getUvState(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
}

// Local Storage Function 
function updateHistoryChips() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const container = document.getElementById('lastSearched');
    container.innerHTML = '';

    history.forEach(city => {
        const chip = document.createElement('span');
        chip.classList.add('history-chip');
        chip.textContent = '🕐 ' + city;
        chip.addEventListener('click', function () {
            input.value = city;
            btn.click();
        });
        container.appendChild(chip);
    });

    container.style.display = history.length ? 'flex' : 'none';
}
//=====================================================================
// Variables
const btn = document.getElementById("searchBtn");
let input = document.getElementById("cityInput");
let cityName = ''
let countryName = ''
let cityTimezone = ''
let rawTemp = 0


//=====================================================================
// Event Listener for search button
btn.addEventListener("click", function () {

    //=====================================================================
    // Assign city variable to the input value from the user
    const city = input.value;
    input.value = '';
    //Spinner
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('default').style.display = 'none';
    //=====================================================================
    // Fetch the API with the city variable
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=20`)
        .then(res => res.json())
        .then(data => {

            console.log(data)

            // Prefer UK locations
            const bestMatch =
                data.results.find(function (place) {

                   return place.country === 'United Kingdom'}) || data.results[0];
        

            // Error Handling for invalid city
            if (!data.results || data.results.length === 0) {
        document.getElementById('spinner').style.display = 'none';
        const error = document.getElementById('errorMessage');
        error.textContent = 'City not found, please try again';
        error.style.display = 'block';

        // Hide weather UI
        document.getElementById('weatherCard').style.display = 'none';
        document.getElementById('stats').style.display = 'none';
        document.getElementById('forecast').style.display = 'none';

        return
    }
    document.getElementById('errorMessage').style.display = 'none';

    // Get Data
    const { latitude, longitude, name, country, timezone } = bestMatch;
    cityName = name;
    countryName = country;
    cityTimezone = timezone

    //=====================================================================
    // Return latitude, longitude, name, country, uv index from the API
    return (fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m,uv_index,precipitation,visibility,surface_pressure,apparent_temperature,winddirection_10m&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=5&timezone=auto`))

})
    .then(res => res.json())
    .then(weather => {
        console.log(weather.current)
        const code = weather.current.weathercode;

        //=====================================================================
        //Unhide the Data
        document.getElementById('weatherCard').style.display = 'block';
        document.getElementById('stats').style.display = 'grid';
        document.getElementById('forecast').style.display = 'block';

        //=====================================================================
        // Paste the data onto the DOM
        document.getElementById('cityName').textContent = cityName;
        document.getElementById('countryName').textContent = countryName;
        document.getElementById('temperature').innerHTML = `${Math.round(weather.current.temperature_2m)}<sup>°C</sup>`;
        document.getElementById('wind').textContent = Math.round(weather.current.windspeed_10m) + ' km/h';
        document.getElementById('humidity').textContent = Math.round(weather.current.relative_humidity_2m) + '%';
        document.getElementById('weatherIcon').textContent = weatherConditions[code].icon;
        document.getElementById('condition').textContent = weatherConditions[code].label;
        document.getElementById('uvIndex').textContent = Math.round(weather.current.uv_index);
        document.getElementById('uvState').textContent = getUvState(weather.current.uv_index);
        document.getElementById('feelsLike').textContent = Math.round(weather.current.apparent_temperature) + '°C';
        document.getElementById('precipitation').textContent = weather.current.precipitation + ' mm';
        document.getElementById('visibility').textContent = (weather.current.visibility / 1000).toFixed(1) + ' km';
        document.getElementById('pressure').textContent = Math.round(weather.current.surface_pressure) + ' hPa';
        document.getElementById('windDir').textContent = getWindDirection(weather.current.winddirection_10m);

        //Local Stoage Save
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (history.includes(cityName)) {
            history.splice(history.indexOf(cityName), 1);
        }
        history.unshift(cityName);
        if (history.length > 3) {
            history.pop();
        }
        localStorage.setItem('searchHistory', JSON.stringify(history));
        updateHistoryChips();

        //Getting the time
        const now = new Date();
        const localtime = new Intl.DateTimeFormat('en-GB', {
            timeZone: cityTimezone,
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        }).format(now);

        document.getElementById('dateTime').textContent = localtime;

        //Update the Temp
        rawTemp = Math.round(weather.current.temperature_2m);

        //=====================================================================
        // Hide the default view 
        document.getElementById('default').style.display = "none";

        //=====================================================================
        //5 Day Forecast
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const forecastGrid = document.getElementById('forecastGrid');
        forecastGrid.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            const date = new Date(weather.daily.time[i]);
            let dayName
            if (i === 0) {
                dayName = 'Today'
            } else {
                dayName = days[date.getDay()]

            };
            const icon = weatherConditions[weather.daily.weathercode[i]].icon;
            const max = Math.round(weather.daily.temperature_2m_max[i]);
            const min = Math.round(weather.daily.temperature_2m_min[i]);

            forecastGrid.innerHTML += `
        <div class="forecast-day">
            <p class="forecast-day-name">${dayName}</p>
            <span class="forecast-icon">${icon}</span>
            <p class="forecast-max">${max}°</p>
            <p class="forecast-min">${min}°</p>
        </div>`;
        }

        //=====================================================================
        // Clear search value
        input.value = '';
        //Hide the spinner 
        document.getElementById('spinner').style.display = 'none';
        //=====================================================================
        // Update background
        updateWeatherUI(code)
    });
});

//=====================================================================
//Temperature toggle
document.getElementById('toggleC').addEventListener('click', function () {
    document.getElementById('temperature').innerHTML = `${rawTemp}<sup>°C</sup>`;
    document.getElementById('toggleC').classList.add('active');
    document.getElementById('toggleF').classList.remove('active');
});

document.getElementById('toggleF').addEventListener('click', function () {
    const f = Math.round((rawTemp * 9 / 5) + 32);
    document.getElementById('temperature').innerHTML = `${f}<sup>°F</sup>`;
    document.getElementById('toggleF').classList.add('active');
    document.getElementById('toggleC').classList.remove('active');
});
//=====================================================================
// Additional Event Listeners

// Event Listener for Enter Key
input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        btn.click();
    }
});

//Event Listener for Location button
document.getElementById('locationBtn').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('spinner').style.display = 'block';
            document.getElementById('default').style.display = 'none';

            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
                .then(res => {
                    //Check if it resolved location
                    if (!res.ok) {
                        throw new Error('Reverse geocoding failed');
                    }
                    return res.json();
                })
                .then(data => {
                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village;
                    if (!city) {
                        throw new Error('No city found');
                    }
                    input.value = city;
                    btn.click();
                })
                .catch(err => {
                    console.error(err);
                    alert('Unable to get your location.');
                    //Stop spinner
                    document.getElementById('spinner').style.display = 'none';
                });
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }

});
//=====================================================================
// On page load get local stoage
window.addEventListener('load', function () {
    updateHistoryChips();
});
