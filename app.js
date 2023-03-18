
const USERNAME = 'serpensalasia';
const API_KEY = 'fefb616271719ba63c08ba7a05c97655';
const API_URL = 'https://api.openweathermap.org/data/2.5/'


const defaultCity = "Dallas";

const searchbox = document.querySelector('.search-box');
function setQuery(evt) {
    if (evt.keyCode == 13 || evt.type === "load") {
        getResults(searchbox.value || defaultCity);
    }
}

searchbox.addEventListener("keypress", setQuery);
window.addEventListener("load", setQuery);

async function getResults(query) {
    const response = await axios.get(`${API_URL}weather?q=${query}&units=metric&APPID=${API_KEY}`);
    const weatherData = response.data;
    const latitude = weatherData.coord.lat;
    const longitude = weatherData.coord.lon;
    const location = await getLocation(latitude, longitude);
    const state = location[0];
    const country = location[1];
    displayResults(weatherData, state, country);
}


function displayResults(weather, placeState, placeCountry) {
    let city = document.querySelector('.location .city');
    city.innerText = getCityStateString(weather, placeState);

    let country = document.querySelector('.location .country');
    country.innerText = `${placeCountry}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerText = `${Math.round(weather.main.temp)}°c`;

    let weather_el = document.querySelector('.current .description');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ~ ${month} ${date}, ${year}`;
}

async function getLocation(latitude, longitude) {

    try {
        const response = await axios.get(`http://api.geonames.org/countrySubdivision?lat=${latitude}&lng=${longitude}&username=${USERNAME}`);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const country = xmlDoc.querySelector("countryName").textContent;

        let state = '';
        if (country === 'United States') {
            state = xmlDoc.querySelector("adminCode1").textContent;
        }

        return [state, country];

    } catch (e) {
        console.log('Error at GeoNames');
    }
}

function getCityStateString(weather, placeState) {
    if (placeState !== '') {
        return `${weather.name}, ${placeState}`;
    }
    return `${weather.name}`;
}

