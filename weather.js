import myJson from './city.list.json' assert {type: 'json'};

$(function () {
    var availableTags = myJson.map((element) => element.name)
    $("#searchField").autocomplete({
        source: availableTags,
        minLength: 3
    });
});


async function currentWeather(city, utc) {
    
    let [temperature, feelsLike, humidity, pressure, localTime] = []
    await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=16727eaef267711b6e1616dd422158e5`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            temperature = Math.ceil(data.main.temp - 271)
            feelsLike = Math.ceil(data.main.feels_like - 271)
            humidity = data.main.humidity
            pressure = data.main.pressure
            utc.setSeconds(data.timezone + utc.getSeconds())
            localTime = String(utc).split(' ').slice(0, 5).join(' ');
        });
    document.querySelector('#city').innerHTML = 'City: ' + city
    document.querySelector('#current-temp').innerHTML = 'Current temperature: ' + temperature + '°C';
    document.querySelector('#feels-like').innerHTML = 'Feels like: ' + feelsLike + '°C';
    document.querySelector('#humidity').innerHTML = 'Humidity: ' + humidity + '%';
    document.querySelector('#pressure').innerHTML = 'Pressure: ' + pressure + ' hPa';
    document.querySelector('#local-time').innerHTML = 'Local Time: ' + localTime;
}

let liveWeather;

document.querySelector('#search').addEventListener('click', function () {
    if (liveWeather) {
        clearInterval(liveWeather);
    }
    let city = document.querySelector('#searchField').value
    document.querySelector('#searchField').value = ''
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

