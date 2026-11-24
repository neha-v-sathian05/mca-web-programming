
async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const result = document.getElementById("weatherResult");

    // Check empty input
    if (city === "") {
        result.innerHTML = "<p>Please enter a city name!</p>";
        return;
    }

    result.innerHTML = "<p>Loading weather data...</p>";

    try {

        // Step 1: Get city coordinates from India
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json&countryCode=IN`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to location service.");
        }

        const geoData = await geoResponse.json();

        // Check whether city exists
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found in India! Please enter a valid city name.");
        }

        // Get the first matching Indian location
        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Fetch current weather information
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather information.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Convert weather codes into descriptions
        const weatherCodes = {
            0: "Clear Sky",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Overcast",
            45: "Foggy",
            48: "Depositing Rime Fog",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Dense Drizzle",
            61: "Slight Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            71: "Slight Snow",
            73: "Moderate Snow",
            75: "Heavy Snow",
            80: "Rain Showers",
            81: "Moderate Rain Showers",
            82: "Heavy Rain Showers",
            95: "Thunderstorm"
        };

        const condition =
            weatherCodes[current.weather_code] || "Weather condition unavailable";

        // Step 4: Display weather information
        result.innerHTML = `
            <h2>${location.name}, ${location.country}</h2>
            <h3>${condition}</h3>
            <p>Temperature: ${current.temperature_2m} °C</p>
            <p>Humidity: ${current.relative_humidity_2m}%</p>
            <p>Wind Speed: ${current.wind_speed_10m} km/h</p>
        `;

    } catch (error) {

        // Step 5: Handle errors
        result.innerHTML = `<p>${error.message}</p>`;

    }
}

