const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const loadingSpinner = document.querySelector(".loading-spinner");
const appContainer = document.querySelector(".app-container");

const API_KEY = "63f592f11f0f64407ce2f89b75638670";

// Add temperature unit conversion
let isCelsius = true;
const toggleTempUnit = (temp) => {
    return isCelsius ? temp : (temp * 9/5) + 32;
};

// Format date
const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get weather icon with animation
const getWeatherIcon = (iconCode, size = "4x") => {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

// Set background based on weather condition
const setBackground = (weatherCondition) => {
    const conditions = {
        'clear': {
            gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            image: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        },
        'clouds': {
            gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
            image: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        },
        'rain': {
            gradient: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
            image: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        },
        'snow': {
            gradient: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
            image: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        },
        'thunderstorm': {
            gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            image: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        },
        'default': {
            gradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
            image: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        }
    };
    
    const condition = weatherCondition.toLowerCase();
    const { gradient, image } = conditions[condition] || conditions.default;
    
    document.body.style.background = gradient;
    document.body.style.backgroundImage = `url(${image})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
};

// Show loading spinner
const showLoading = () => {
    loadingSpinner.classList.add("active");
    appContainer.style.opacity = "0.5";
};

// Hide loading spinner
const hideLoading = () => {
    loadingSpinner.classList.remove("active");
    appContainer.style.opacity = "1";
};

// Show error message
const showError = (message) => {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
};

const createWeatherCard = (cityName, weatherItem, index) => {
    const temp = (weatherItem.main.temp - 273.15).toFixed(1);
    const date = formatDate(weatherItem.dt_txt);
    const weatherIcon = getWeatherIcon(weatherItem.weather[0].icon);
    const description = weatherItem.weather[0].description;
    
    if(index === 0) {
        setBackground(weatherItem.weather[0].main);
        return `
            <div class="weather-icon">
                <img src="${weatherIcon}" alt="weather-icon" class="weather-img">
                <h6 class="weather-description">${description}</h6>
            </div>
            <div class="details">
                <h2 class="city-name">${cityName}</h2>
                <div class="weather-info">
                    <div class="temp">
                        <i class="fas fa-temperature-high"></i>
                        <span>Temperature: ${toggleTempUnit(temp)}°${isCelsius ? 'C' : 'F'}</span>
                    </div>
                    <div class="wind">
                        <i class="fas fa-wind"></i>
                        <span>Wind: ${weatherItem.wind.speed} M/S</span>
                    </div>
                    <div class="humidity">
                        <i class="fas fa-droplet"></i>
                        <span>Humidity: ${weatherItem.main.humidity}%</span>
                    </div>
                    <div class="pressure">
                        <i class="fas fa-gauge-high"></i>
                        <span>Pressure: ${weatherItem.main.pressure} hPa</span>
                    </div>
                </div>
                </div>`;
    } else {
        return `
            <li class="card">
                <div class="date">${date.split(",")[0]}</div>
                <img src="${weatherIcon}" alt="weather-icon" class="weather-img">
                <h3 class="temp">${toggleTempUnit(temp)}°${isCelsius ? 'C' : 'F'}</h3>
                <div class="weather-details">
                    <div class="wind"><i class="fas fa-wind"></i> ${weatherItem.wind.speed} M/S</div>
                    <div class="humidity"><i class="fas fa-droplet"></i> ${weatherItem.main.humidity}%</div>
                </div>
                </li>`;
    }
};

const getWeatherDetails = (cityName, latitude, longitude) => {
    showLoading();
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Weather data not found");
            return response.json();
        })
        .then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
        })
        .catch(error => {
            showError(error.message || "An error occurred while fetching the weather forecast!");
        })
        .finally(() => {
            hideLoading();
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") {
        showError("Please enter a city name");
        return;
    }
    
    showLoading();
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            if (!data.length) {
                throw new Error(`No coordinates found for ${cityName}`);
            }
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
        })
        .catch(error => {
            showError(error.message || "An error occurred while fetching the coordinates!");
            hideLoading();
        });
};

const getUserCoordinates = () => {
    showLoading();
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            
            fetch(API_URL)
                .then(response => {
                    if (!response.ok) throw new Error("Location data not found");
                    return response.json();
                })
                .then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
                })
                .catch(error => {
                    showError(error.message || "An error occurred while fetching the city name!");
                    hideLoading();
            });
        },
        error => {
            hideLoading();
            if (error.code === error.PERMISSION_DENIED) {
                showError("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                showError("Geolocation request error. Please reset location permission.");
            }
}
    );
};

// Add event listeners
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

// Add temperature unit toggle
document.addEventListener("click", e => {
    if (e.target.classList.contains("temp")) {
        isCelsius = !isCelsius;
        const cityName = document.querySelector(".city-name").textContent;
        const currentCard = currentWeatherDiv.querySelector(".temp span");
        const tempValue = parseFloat(currentCard.textContent.split(": ")[1]);
        currentCard.textContent = `Temperature: ${toggleTempUnit(tempValue)}°${isCelsius ? 'C' : 'F'}`;
    }
});
