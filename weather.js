import cities from './cities.json' assert {type: 'json'};


$(function () {

    var availableTags = cities.map((element) => element.city)

    $("#searchField").autocomplete({
        source: availableTags,
        minLength: 0
    });

});

function currentWeather(city, utc) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=16727eaef267711b6e1616dd422158e5`)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                let error = new Error(response.statusText)
                error.response = response
                throw error;
            }
        })
        .then((data) => {
            var cityName = data.name
            var { temp, humidity, feels_like: feelsLike, pressure } = data.main;
            temp = Math.ceil(temp - 271);
            feelsLike = Math.ceil(feelsLike - 271);
            utc.setSeconds(data.timezone + utc.getSeconds())
            var localTime = String(utc).split(' ').slice(0, 5).join(' ');
            document.querySelector('#city').innerHTML = 'City: ' + cityName
            document.querySelector('#current-temp').innerHTML = 'Current temperature: ' + temp + '°C';
            document.querySelector('#feels-like').innerHTML = 'Feels like: ' + feelsLike + '°C';
            document.querySelector('#humidity').innerHTML = 'Humidity: ' + humidity + '%';
            document.querySelector('#pressure').innerHTML = 'Pressure: ' + pressure + ' hPa';
            document.querySelector('#local-time').innerHTML = 'Local Time: ' + localTime;
        })
        .catch((e) => {
            document.querySelector('.weather').style.visibility = 'hidden';
            setTimeout(() => {
                alert(e.message);
            }, 500);
            clearInterval(liveWeather);
        })
}

let liveWeather;

document.querySelector('#search').addEventListener('click', function () {

    if (liveWeather) {
        clearInterval(liveWeather);
    }

    let city = document.querySelector('#searchField').value
    document.querySelector('#searchField').value = ''
    let utc = utcTime();
    currentWeather(city, utc)

    liveWeather = setInterval(() => {
        let utc = utcTime();
        currentWeather(city, utc)
    }, 1000);
    
    document.querySelector('.weather').style.visibility = 'visible';
})

function utcTime() {

    let date = new Date()
    date.setSeconds(date.getSeconds() + date.getTimezoneOffset() * 60)

    return date;

}


