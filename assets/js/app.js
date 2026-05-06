// Weather Condition Codes
const weatherConditions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Icy fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Heavy drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    80: 'Light showers',
    81: 'Showers',
    82: 'Heavy showers',
    95: 'Thunderstorm',
    99: 'Severe thunderstorm'
};

// Variables
const btn = document.getElementById("searchBtn");
let input = document.getElementById("cityInput");
let cityName = ''

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

            // Return latitude, longitude, name, country from the API
            return (fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&forecast_days=1`))
        })
        .then(res => res.json())
        .then(weather => {
            console.log(weather.current)
            const code = weather.current.weathercode;

            // Paste the data onto the DOM
            document.getElementById('cityName').textContent = cityName;
            document.getElementById('temperature').textContent = Math.round(weather.current.temperature_2m) + '°C';
            document.getElementById('wind').textContent = Math.round(weather.current.windspeed_10m) + ' km/h';
            document.getElementById('humidity').textContent = Math.round(weather.current.relative_humidity_2m) + '%';
            document.getElementById('condition').textContent = weatherConditions[code];

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