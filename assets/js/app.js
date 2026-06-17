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
    56: { label: 'Light freezing drizzle', icon: '🌧️' },
    57: { label: 'Freezing drizzle', icon: '🌧️' },
    61: { label: 'Light rain', icon: '🌧️' },
    63: { label: 'Rain', icon: '🌧️' },
    65: { label: 'Heavy rain', icon: '🌧️' },
    66: { label: 'Light freezing rain', icon: '🌧️' },
    67: { label: 'Freezing rain', icon: '🌧️' },
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
// Safe lookup — falls back to a generic icon/label instead of throwing
// if the API ever returns a weather code we haven't mapped.
function getCondition(code) {
    return weatherConditions[code] || { label: 'Unknown', icon: '🌡️' };
}

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

//=====================================================================
// Search disambiguation — lets people type "Dover, UK" or "Dover, Tennessee"
// to skip straight to the right place instead of guessing.

// Splits "Dover, UK" into { city: 'Dover', qualifier: 'UK' }.
// Anything after the first comma is treated as the qualifier.
function parseCityInput(raw) {
    const commaIndex = raw.indexOf(',');
    if (commaIndex === -1) return { city: raw.trim(), qualifier: '' };
    return {
        city: raw.slice(0, commaIndex).trim(),
        qualifier: raw.slice(commaIndex + 1).trim()
    };
}

// Shorthand country names people commonly type instead of the full name
const countryAliases = {
    'uk': 'united kingdom',
    'u.k.': 'united kingdom',
    'gb': 'united kingdom',
    'great britain': 'united kingdom',
    'usa': 'united states',
    'u.s.a.': 'united states',
    'us': 'united states',
    'u.s.': 'united states',
    'america': 'united states'
};

// Does a geocoding result match a typed qualifier such as "UK", "Tennessee", "Kent"
function matchesQualifier(place, qualifier) {
    const q = qualifier.toLowerCase();
    const country = (place.country || '').toLowerCase();
    const countryCode = (place.country_code || '').toLowerCase();
    const admin1 = (place.admin1 || '').toLowerCase();
    const admin2 = (place.admin2 || '').toLowerCase();
    const aliasedCountry = countryAliases[q];

    return country === q ||
        countryCode === q ||
        admin1 === q ||
        admin2 === q ||
        admin1.includes(q) ||
        admin2.includes(q) ||
        (!!aliasedCountry && country === aliasedCountry);
}

// Renders a list of candidate places for the user to choose between,
// e.g. when "Dover" alone matches several different places.
function showLocationPicker(candidates, requestId) {
    const picker = document.getElementById('locationPicker');
    picker.innerHTML = '';

    candidates.slice(0, 8).forEach(place => {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'location-option';

        const nameEl = document.createElement('span');
        nameEl.className = 'location-option-name';
        nameEl.textContent = place.name;

        const detailEl = document.createElement('span');
        detailEl.className = 'location-option-detail';
        detailEl.textContent = [place.admin1, place.country].filter(Boolean).join(', ');

        option.appendChild(nameEl);
        option.appendChild(detailEl);
        option.addEventListener('click', function () {
            hideLocationPicker();
            loadWeatherForPlace(place, requestId);
        });
        picker.appendChild(option);
    });

    picker.style.display = 'flex';
}

function hideLocationPicker() {
    const picker = document.getElementById('locationPicker');
    picker.innerHTML = '';
    picker.style.display = 'none';
}

// Local Storage Function
// History entries are { name, qualifier } objects so a chip click can
// re-run the exact same disambiguated search. Older plain-string entries
// (saved before this feature existed) are still read correctly.
function updateHistoryChips() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const container = document.getElementById('lastSearched');
    container.innerHTML = '';

    history.forEach(entry => {
        const name = typeof entry === 'string' ? entry : entry.name;
        const qualifier = typeof entry === 'string' ? '' : (entry.qualifier || '');

        const chip = document.createElement('span');
        chip.classList.add('history-chip');
        chip.textContent = '🕐 ' + name + (qualifier ? ', ' + qualifier : '');
        chip.addEventListener('click', function () {
            input.value = qualifier ? `${name}, ${qualifier}` : name;
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
let activeRequestId = 0 // guards against a slower, stale request overwriting a newer one


//=====================================================================
// Event Listener for search button
btn.addEventListener("click", function () {

    //=====================================================================
    // Assign city variable to the input value from the user, splitting
    // off an optional qualifier — e.g. "Dover, Tennessee" or "Dover, UK"
    const rawValue = input.value.trim();
    input.value = '';
    hideLocationPicker();

    if (!rawValue) return; // nothing typed — don't fire a request

    const { city, qualifier } = parseCityInput(rawValue);

    // Mark this as the latest request; older in-flight requests will
    // check this and bail out instead of overwriting the UI with stale data.
    const requestId = ++activeRequestId;

    //Spinner
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('default').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    //=====================================================================
    // Fetch the API with the city variable (encoded so spaces/accents work)
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=20`)
        .then(res => {
            if (!res.ok) throw new Error('Geocoding request failed');
            return res.json();
        })
        .then(data => {
            if (requestId !== activeRequestId) return; // a newer search has superseded this one

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

            // Narrow down using the typed qualifier, e.g. "Dover, UK" only
            // keeps results in the United Kingdom; "Dover, Tennessee" only
            // keeps the Tennessee one.
            let candidates = data.results;
            if (qualifier) {
                const filtered = candidates.filter(place => matchesQualifier(place, qualifier));
                if (filtered.length > 0) candidates = filtered;
            }

            if (candidates.length === 1) {
                // Unambiguous — go straight to the weather
                loadWeatherForPlace(candidates[0], requestId);
            } else {
                // Still more than one match — let the user pick rather than guessing
                document.getElementById('spinner').style.display = 'none';
                showLocationPicker(candidates, requestId);
            }
        })
        .catch(err => {
            console.error(err);
            if (requestId !== activeRequestId) return; // a newer search already took over
            document.getElementById('spinner').style.display = 'none';
            const error = document.getElementById('errorMessage');
            error.textContent = 'Something went wrong fetching the weather. Please try again.';
            error.style.display = 'block';
        });
});

//=====================================================================
// Fetches and renders the forecast for one specific, already-chosen place.
function loadWeatherForPlace(place, requestId) {
    const { latitude, longitude, name, country, admin1, timezone } = place;
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';

    // Get Data
    cityName = name;
    countryName = [admin1, country].filter(Boolean).join(', ');
    cityTimezone = timezone

    //=====================================================================
    // Return latitude, longitude, name, country, uv index from the API
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m,uv_index,precipitation,visibility,apparent_temperature,winddirection_10m&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset&forecast_days=5&timezone=auto`)
        .then(res => {
            if (!res.ok) throw new Error('Forecast request failed');
            return res.json();
        })
        .then(weather => {
            if (requestId !== activeRequestId) return; // a newer search has superseded this one

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
            document.getElementById('weatherIcon').textContent = getCondition(code).icon;
            document.getElementById('condition').textContent = getCondition(code).label;
            document.getElementById('uvIndex').textContent = Math.round(weather.current.uv_index);
            document.getElementById('uvState').textContent = getUvState(weather.current.uv_index);
            const feelsLikeC = Math.round(weather.current.apparent_temperature);
            const feelsLikeEl = document.getElementById('feelsLike');
            feelsLikeEl.textContent = feelsLikeC + '°C';
            feelsLikeEl.dataset.c = feelsLikeC;
            document.getElementById('precipitation').textContent = weather.current.precipitation + ' mm';
            document.getElementById('visibility').textContent = (weather.current.visibility / 1000).toFixed(1) + ' km';
            document.getElementById('windDir').textContent = getWindDirection(weather.current.winddirection_10m);

            // Sunrise & Sunset — index [0] is today
            const sunriseRaw = new Date(weather.daily.sunrise[0]);
            const sunsetRaw = new Date(weather.daily.sunset[0]);

            const timeFormat = {
                timeZone: cityTimezone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };

            document.getElementById('sunrise').textContent = new Intl.DateTimeFormat('en-GB', timeFormat).format(sunriseRaw);
            document.getElementById('sunset').textContent = new Intl.DateTimeFormat('en-GB', timeFormat).format(sunsetRaw);

            //Local Storage Save — keep the qualifier so repeat-clicking the
            //chip re-runs the exact same disambiguated search
            const newEntry = { name: cityName, qualifier: admin1 || country || '' };
            let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
            history = history.filter(entry => {
                const entryName = typeof entry === 'string' ? entry : entry.name;
                const entryQualifier = typeof entry === 'string' ? '' : (entry.qualifier || '');
                return !(entryName === newEntry.name && entryQualifier === newEntry.qualifier);
            });
            history.unshift(newEntry);
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
                const icon = getCondition(weather.daily.weathercode[i]).icon;
                const max = Math.round(weather.daily.temperature_2m_max[i]);
                const min = Math.round(weather.daily.temperature_2m_min[i]);

                forecastGrid.innerHTML += `
        <div class="forecast-day">
            <p class="forecast-day-name">${dayName}</p>
            <span class="forecast-icon">${icon}</span>
            <p class="forecast-max" data-c="${max}">${max}°</p>
            <p class="forecast-min" data-c="${min}">${min}°</p>
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

            // Re-apply the saved unit preference (so it stays consistent across searches)
            applyUnit(localStorage.getItem('preferredUnit') || 'C')
        })
        .catch(err => {
            console.error(err);
            if (requestId !== activeRequestId) return; // a newer search already took over
            document.getElementById('spinner').style.display = 'none';
            const error = document.getElementById('errorMessage');
            error.textContent = 'Something went wrong fetching the weather. Please try again.';
            error.style.display = 'block';
        });
}

//=====================================================================
//Temperature toggle
// Converts the current temp, feels-like, and every forecast high/low together,
// and remembers the choice for next visit.
function applyUnit(unit) {
    const tempEl = document.getElementById('temperature');
    const feelsLikeEl = document.getElementById('feelsLike');

    if (unit === 'F') {
        const f = Math.round((rawTemp * 9 / 5) + 32);
        tempEl.innerHTML = `${f}<sup>°F</sup>`;
        if (feelsLikeEl.dataset.c !== undefined) {
            const feelsF = Math.round((Number(feelsLikeEl.dataset.c) * 9 / 5) + 32);
            feelsLikeEl.textContent = feelsF + '°F';
        }
        document.querySelectorAll('.forecast-max, .forecast-min').forEach(el => {
            if (el.dataset.c !== undefined) {
                const dayF = Math.round((Number(el.dataset.c) * 9 / 5) + 32);
                el.textContent = dayF + '°';
            }
        });
        document.getElementById('toggleF').classList.add('active');
        document.getElementById('toggleC').classList.remove('active');
    } else {
        tempEl.innerHTML = `${rawTemp}<sup>°C</sup>`;
        if (feelsLikeEl.dataset.c !== undefined) {
            feelsLikeEl.textContent = feelsLikeEl.dataset.c + '°C';
        }
        document.querySelectorAll('.forecast-max, .forecast-min').forEach(el => {
            if (el.dataset.c !== undefined) {
                el.textContent = el.dataset.c + '°';
            }
        });
        document.getElementById('toggleC').classList.add('active');
        document.getElementById('toggleF').classList.remove('active');
    }

    localStorage.setItem('preferredUnit', unit);
}

document.getElementById('toggleC').addEventListener('click', function () {
    applyUnit('C');
});

document.getElementById('toggleF').addEventListener('click', function () {
    applyUnit('F');
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
                    // Carry the region/country through too, so the follow-up
                    // search lands on this exact place instead of guessing
                    // between same-named cities elsewhere.
                    const qualifier = data.address.state || data.address.country || '';
                    input.value = qualifier ? `${city}, ${qualifier}` : city;
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

    // Reflect the saved unit preference on the toggle buttons (actual values
    // get applied once a search loads data, via applyUnit in the search handler)
    if (localStorage.getItem('preferredUnit') === 'F') {
        document.getElementById('toggleF').classList.add('active');
        document.getElementById('toggleC').classList.remove('active');
    }
});