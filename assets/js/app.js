// Weather Condition Codes
const weatherConditions = {
    0:  { label: 'Clear sky',           icon: '☀️' },
    1:  { label: 'Mainly clear',        icon: '🌤️' },
    2:  { label: 'Partly cloudy',       icon: '⛅' },
    3:  { label: 'Overcast',            icon: '☁️' },
    45: { label: 'Foggy',               icon: '🌫️' },
    48: { label: 'Icy fog',             icon: '🌫️' },
    51: { label: 'Light drizzle',       icon: '🌦️' },
    53: { label: 'Drizzle',             icon: '🌦️' },
    55: { label: 'Heavy drizzle',       icon: '🌧️' },
    61: { label: 'Light rain',          icon: '🌧️' },
    63: { label: 'Rain',                icon: '🌧️' },
    65: { label: 'Heavy rain',          icon: '🌧️' },
    71: { label: 'Light snow',          icon: '🌨️' },
    73: { label: 'Snow',                icon: '❄️' },
    75: { label: 'Heavy snow',          icon: '❄️' },
    77: { label: 'Snow grains',         icon: '🌨️' },
    80: { label: 'Light showers',       icon: '🌦️' },
    81: { label: 'Showers',             icon: '🌧️' },
    82: { label: 'Heavy showers',       icon: '⛈️' },
    85: { label: 'Snow showers',        icon: '🌨️' },
    86: { label: 'Heavy snow showers',  icon: '❄️' },
    95: { label: 'Thunderstorm',        icon: '⛈️' },
    96: { label: 'Thunderstorm',        icon: '⛈️' },
    99: { label: 'Severe thunderstorm', icon: '⛈️' }
};

// Variables
const btn = document.getElementById("searchBtn");
let input = document.getElementById("cityInput");
let cityName = ''
let countryName = ''

// Event Listener for search button
btn.addEventListener("click", function () {
    // Assign city variable to the input value from the user
    const city = input.value;
    // Fetch the API with the city variable
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
        .then(res => res.json())
        .then(data => {
            const { latitude, longitude, name, country } = data.results[0];
            cityName = name;
            countryName = country;

            // Return latitude, longitude, name, country from the API
            return (fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&forecast_days=1`))
        })
        .then(res => res.json())
        .then(weather => {
            console.log(weather.current)
            const code = weather.current.weathercode;

            // Paste the data onto the DOM
            document.getElementById('cityName').textContent = cityName;
            document.getElementById('countryName').textContent = countryName;
            document.getElementById('temperature').textContent = Math.round(weather.current.temperature_2m) + '°C';
            document.getElementById('wind').textContent = Math.round(weather.current.windspeed_10m) + ' km/h';
            document.getElementById('humidity').textContent = Math.round(weather.current.relative_humidity_2m) + '%';
            document.getElementById('weatherIcon').textContent = weatherConditions[code].icon;
            document.getElementById('condition').textContent = weatherConditions[code].label;

            // Hide the default view 
            document.getElementById('default').style.display = "none";

        });
});
// Event Listener for Enter Key
input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        btn.click();
    }
});