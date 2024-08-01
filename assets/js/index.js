'use strict';
const BASE_URL = `https://api.weatherapi.com/v1`;
const searchInput = document.getElementById('documentSearchInput');
const TodayCard = document.getElementById('TodayCard');
const TomorrowCard = document.getElementById('TomorrowCard');
const afterTomorrowCard = document.getElementById('afterTomorrowCard');

// Event Listeners
$('#documentSearchInput').on('input', function () {
    let closeBtn = $('.closeBtn');

    if (this.value.trim() !== '') {
        closeBtn.fadeIn(200);
    } else {
        closeBtn.fadeOut(200);
    }

    getWeatherData(this.value);
});

// Event listener for close button click
$('.closeBtn').on('click', function () {
    $('#documentSearchInput').val('');
    $(this).fadeOut(200);
});

// GPS Check Functionality
(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                getWeatherData(`${latitude},${longitude}`);
            },
            function (error) {
                if (error.code === error.PERMISSION_DENIED) {
                    getWeatherData('DELHI');
                }
            }
        );
    } else {
        // Default to Cairo if geolocation is not supported
        alert('Cannot find Location');
        getWeatherData('DELHI');
    }
})();

// Get Data Functionality
async function getWeatherData(query) {
    try {
        let response = await fetch(`${BASE_URL}/forecast.json?q=${query}&days=3&key=b149ae5e8f034f65b76110641242206`);
        let data = await response.json();
        console.log(data);
        displayWeatherData(data);
    } catch (error) {
        console.log("Error occurred:", error);
    }
}

// Function to update weather card content
function WeatherCard(dayDate, dayNum, month, city, dayDegree, iconUrl, dayStatus, dayHumidity, dayWind, dayWindDir = 'NW', card) {
    let cardContent = `
        <div class="card bg-light-subtle border-0 rounded-4" style="height: 25rem;">
            <h5 class="card-title bg-dark bg-opacity-50 py-2 px-3 mb-2 d-flex justify-content-between fw-light">
                <span>${dayDate}</span>
                <span>${dayNum} ${month}</span>
            </h5>
            <div class="card-body text-start p-4">
                <span class="fs-4 text-info fw-semibold">${city}</span>
                <div class="card-temp d-flex justify-content-between align-items-center py-4 mb-2">
                    <span class="fw-bolder display-1">${dayDegree}</span>
                    <img src="${iconUrl}" class="w-25" alt="Weather Icon">
                </div>
                <span class="text-info fw-semibold fs-5">${dayStatus}</span>
                <div class="card-info pt-5">
                    <span class="me-3"><img src="assets/imgs/icon-umberella.png" alt="umbrella icon" class="me-2">${dayHumidity}</span>
                    <span class="me-3"><img src="assets/imgs/icon-wind.png" alt="Wind Icon" class="me-2">${dayWind}</span>
                    
                </div>
            </div>
        </div>`;
    
    card.innerHTML = cardContent;
}

// Function to display weather data
function displayWeatherData(data) {
    displayDayWeather(data, 0, TodayCard);
    displayDayWeather(data, 1, TomorrowCard);
    displayDayWeather(data, 2, afterTomorrowCard);
}

// Function to display weather for a specific day
function displayDayWeather(data, index, card) {
    let dayData = data.forecast.forecastday[index];
    let date = new Date(dayData.date);
    let dayDate = date.toLocaleString('en-us', { weekday: 'long' });
    let dayNum = date.getDate();
    let month = date.toLocaleString('en-us', { month: 'long' });
    let city = data.location.name;
    let dayDegree = dayData.day.avgtemp_c;
    let iconUrl = dayData.day.condition.icon.startsWith('https') ? dayData.day.condition.icon : (dayData.day.condition.icon.startsWith('//') ? `https:${dayData.day.condition.icon}` : `https://example.com/${dayData.day.condition.icon}`);
    let dayStatus = dayData.day.condition.text;
    let dayHumidity = dayData.day.avghumidity;
    let dayWind = dayData.day.maxwind_kph;
    let dayWindDir = dayData.day.wind_dir;

    WeatherCard(dayDate, dayNum, month, city, dayDegree, iconUrl, dayStatus, dayHumidity, dayWind, dayWindDir, card);
}

