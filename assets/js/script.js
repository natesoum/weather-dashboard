// Declare Variables
var apiKey = "baf5ea5fdaa6e3a1057f67697171acd9";
var today = moment().format('L');
var searchHistoryList = [];


// Function for actively searched city
function currentCondition(city) {
    // Using 2.5 Openweather since its free
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    // Using AJAX (jQuery)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResponse) {
        
        $("#weatherContent").css("display", "block");
        $("#cityDetail").empty();
        
        var iconCode = cityWeatherResponse.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

        // Assigning info for Current City into variable
        var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
            <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
        `);

        // Append currentCity info into cityDetail
        $("#cityDetail").append(currentCity);

        // UV Index
        var lat = cityWeatherResponse.coord.lat;
        var lon = cityWeatherResponse.coord.lon;
        var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        $.ajax({
            url: uviQueryURL,
            method: "GET"
        }).then(function(uviResponse) {
            console.log(uviResponse);

            // Grab the value of UV
            var uvIndex = uviResponse.value;
            // Store HTML along with the value of uvIndex into variable
            var uvIndexP = $(`
                <p>UV Index: 
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
            `);

            // Append variable into cityDetail
            $("#cityDetail").append(uvIndexP);

            futureCondition(lat, lon);

            // According to Wikipedia, 0-2 Green, 3-5 Yellow, 6-7 Orange, 8-10 Red, 11+ Violet
            if (uvIndex >= 0 && uvIndex <= 2) {
                $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white");
            } else if (uvIndex >= 3 && uvIndex <= 5) {
                $("#uvIndexColor").css("background-color", "#FFF300");
            } else if (uvIndex >= 6 && uvIndex <= 7) {
                $("#uvIndexColor").css("background-color", "#F18B00");
            } else if (uvIndex >= 8 && uvIndex <= 10) {
                $("#uvIndexColor").css("background-color", "#E53210").css("color", "white");
            } else {
                $("#uvIndexColor").css("background-color", "#B567A4").css("color", "white"); 
            };  
        });
    });
}


