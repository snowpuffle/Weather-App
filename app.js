/* Weather App Main */

// Set Environmental Variables
const USERNAME = config.USERNAME;
const API_KEY = config.API_KEY;
const API_URL = 'https://api.openweathermap.org/data/2.5/'

// Set Default City
const defaultCity = "Dallas";

// Select and Initialize Search Box
const searchbox = document.querySelector('.search-box');
// Listen for KeyPress Events on the Search Box and Call the setQuery Function
searchbox.addEventListener("keypress", setQuery);
function setQuery(evt) {
    // If the Enter key is Pressed or the Page has Finished Loading
    if (evt.keyCode == 13 || evt.type === "load") {
        // Call the getResults Function with the Value of the Search Box 
        // or a Default City if the Search Box is Empty
        getResults(searchbox.value || defaultCity);
    }
}

// Call the setQuery Function when the Page Loads
window.addEventListener("load", setQuery);

// Initialize Icons from FontAwesome
const icons = {
    "Thunderstorm": "fa-bolt",
    "Drizzle": "fa-cloud-rain",
    "Rain": "fa-cloud-showers-heavy",
    "Snow": "fa-snowflake",
    "Clear": "fa-sun",
    "Clouds": "fa-cloud",
    "Mist": "fa-smog"
};

// Get Weather Data from API
async function getResults(query) {
    // Make an API Request to get the Weather Data for the City in Imperial Units.
    const response = await axios.get(`${API_URL}weather?q=${query}&units=imperial&APPID=${API_KEY}`);

    // Extract the Weather Data from the Response Object.
    const weatherData = response.data;

    // Get the Latitude and Longitude of the City.
    const latitude = weatherData.coord.lat;
    const longitude = weatherData.coord.lon;

    // Get the State and Country of the City.
    const location = await getLocation(latitude, longitude);
    const state = location[0];
    const country = location[1];

    // Display the Weather Data on the Page.
    displayResults(weatherData, state, country);
}

// Display Results Given Weather Data and Location
function displayResults(weather, state, placeCountry) {

    // Select and Update City name Element with Formatted City and State String
    let city = document.querySelector('.location .city');
    city.innerText = getCityStateString(weather, state);

    // Select and Update Cuntry Element with Country's Name
    let country = document.querySelector('.location .country');
    country.innerText = `${placeCountry}`;

    // Select and Update Date Element with Current Date
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    // Select and Ipdate Temperature Element with Temperature in Fahrenheit
    let temp = document.querySelector('.current .temp');
    temp.innerText = `${Math.round(weather.main.temp)}°F`;

    // Select and Update Weather Description Element
    let weather_el = document.querySelector('.current .description');
    weather_el.innerText = weather.weather[0].main;

    // Select and Update High/Low Temperature Element
    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°F / ${Math.round(weather.main.temp_max)}°F`;

    // Select and Update Weather Icon Element with Icon based on Weather Condition
    let icon = document.querySelector('.icon');
    let iconClass = icons[weather.weather[0].main];
    icon.innerHTML = `<i class="fas ${iconClass}"></i>`;
}

// Function to Build a Date String
function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ~ ${month} ${date}, ${year}`;
}

// Function to get Location Data from GeoNames API given Latitude and Longitude
async function getLocation(latitude, longitude) {
    // Get Location Data from GeoNames API
    const response = await axios.get(`http://api.geonames.org/countrySubdivision?lat=${latitude}&lng=${longitude}&username=${USERNAME}`);

    // Parse the XML Data Received from the API Response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");

    // Get the Country's Name from the Parsed XML Data
    const country = xmlDoc.querySelector("countryName").textContent;

    // If the Country is United States, Get the State
    let state = '';
    if (country === 'United States') {
        state = xmlDoc.querySelector("adminCode1").textContent;
    }

    // Return an Array Containing State and Country Data
    return [state, country];
}

// Get String Format given the Weather and State Data
function getCityStateString(weather, state) {
    if (state !== '') {
        return `${weather.name}, ${state}`;
    }
    return `${weather.name}`;
}

