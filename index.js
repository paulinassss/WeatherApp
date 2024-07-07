// weather app

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "7d104479a0063c882f618c824aaf0c7f";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault(); //we do not want to refresh the page

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    } 
    else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city){
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok){
        throw new Error("Couldn't fetch weather data");  
    }

    return await response.json();
}

function displayWeatherInfo(data){
    console.log(data);
    const {name: city, 
           main: {temp, humidity, feels_like},
           sys : {country},
           weather: [{description, id}]} = data;
    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h2");
    const tempDisplay = document.createElement("p");
    const feelsLike = document.createElement("p");
    const descDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("h2");

    cityDisplay.textContent = `${city}, ${country}`;
    tempDisplay.textContent = convertTemp(temp);
    feelsLike.textContent = `Feels like ${convertTemp(feels_like)}`;
    descDisplay.textContent = description[0].toUpperCase() + description.slice(1);
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityName");
    tempDisplay.classList.add("temp");
    feelsLike.classList.add("feelsLike");
    descDisplay.classList.add("desc");
    humidityDisplay.classList.add("humidity");
    weatherEmoji.classList.add("emoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(feelsLike);
    card.appendChild(descDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(weatherEmoji);
}

/*
2xx - thunderstorm
3xx - drizzle
5xx - rain
6xx - snow
7xx - atmosphere
800 - clear sky
80x - clouds
*/

function getWeatherEmoji(weatherId){
    switch (true){
        case (weatherId > 800):
            return "🌥️";
            break;
        case (weatherId == 800):
            return "☀️";
            break;
        case (weatherId > 700):
            return "🌫️";
            break;
        case (weatherId > 600):
            return "🌨️";
            break;
        case (weatherId > 300):
            return "🌧️";
            break;
        case (weatherId > 200):
            return "⛈️";
            break;
        default:
            return "🌤️";
            break;
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);

}

function convertTemp(temp){
    return `${Math.round(temp - 272.15)}°C`;
}