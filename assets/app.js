const input = document.getElementById("search_input");
const forecastDailyDataDisplay = document.getElementById('daily-forecasting');
const forecastHourlyDataDisplay = document.getElementById('hourly-forecasting');
const greetingDisplay = document.getElementById('greeting');
const baseUrl = 'https://api.weatherapi.com/v1';

// update current weather

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        getCurrent();
        getForecast()
    }
});

async function getCurrent() {
    try {
        const response = await fetch(baseUrl + `/current.json?key=515056baf37f44d4a7643227242708&q=${input.value}`);
        const currentData = await response.json();
        updateCurrentData(s = currentData);

    } catch (error) {
        console.log(error);
    }
}

function updateCurrentData(currentData) {

    document.getElementById('name').innerText = currentData.location.name;
    document.getElementById('country').innerText = currentData.location.country;
    document.getElementById('temp-current').innerText = `${currentData.current.temp_c} °C`;
    document.getElementById('wind-current').innerText = `${currentData.current.wind_mph}mph`;
    document.getElementById('humidity-current').innerText = `${currentData.current.humidity}%`;
    document.getElementById('condition').innerText = currentData.current.condition.text;

    document.getElementById('humidity-current-info').innerText = `${currentData.current.humidity}%`;
    document.getElementById('uv-current-info').innerText = currentData.current.uv;
    document.getElementById('wind-current-info').innerText = `${currentData.current.wind_mph}mph`;
    document.getElementById('cloud-current-info').innerText = `${currentData.current.cloud}%`;
    document.getElementById('pressure-current-info').innerText = `${currentData.current.pressure_mb}mb`;

    document.getElementById('time-zone').innerText = currentData.location.tz_id;
    document.getElementById('local-time').innerText = currentData.location.localtime;
    document.getElementById('last-updated').innerText = currentData.current.last_updated;
    document.getElementById('feels-like').innerText = `${currentData.current.feelslike_c} °C`;
    document.getElementById('heat-index').innerText = `${currentData.current.heatindex_c} °C`;
}

// update forecasting

async function getForecast() {
    try {
        const response = await fetch(baseUrl + `/forecast.json?key=515056baf37f44d4a7643227242708&days=6&q=${input.value}&day_fields=time,temp_c,condition&hour_fields=time,temp_c,condition`);
        const forecastData = await response.json();

        console.log(forecastData);
        updateForecastData(forecastData);

    } catch (error) {
        console.log(error);
    }
}

function updateForecastData(forecastData) {
    forecastDailyDataDisplay.innerHTML = '';
    forecastHourlyDataDisplay.innerHTML = '';
    let i = 0;
    let day;

    forecastData.forecast.forecastday.forEach(element => {
        switch (new Date(forecastData.forecast.forecastday[i].date).getDay()) {
            case 0:
                day = 'Sunday'
                break;
            case 1:
                day = 'Monday'
                break;
            case 2:
                day = 'Tuesday'
                break;
            case 3:
                day = 'Wednsday'
                break;
            case 4:
                day = 'Thursday'
                break;
            case 5:
                day = 'Friday'
                break;
            case 6:
                day = 'Saturday'
                break;
        }

        if (new Date(forecastData.forecast.forecastday[i].date).getDay() == new Date().getDay()) {
            day = 'Today'
        }

        forecastDailyDataDisplay.innerHTML += `
                                             <div class="card-day">
                                                   <span class="day fw-semibold">${day}</span>
                                                <div class="img">
                                                    <img src="http:${forecastData.forecast.forecastday[i].day.condition.icon}" alt="sunny"><br>
                                                </div>
                                                <h4 class="fw-bold mt-2">${forecastData.forecast.forecastday[i].day.avgtemp_c} °C</h4>
                                                <span class="fw-semibold condition text-center mb-2">${forecastData.forecast.forecastday[i].day.condition.text}</span>
                                            </div>`
        i++;
    });

    // get hours seperatly
    let data = [];
    let hour = String(new Date(forecastData.location.localtime).getHours()).padStart(2, '0');
    let j = 0;

    for (let index = 0; index < 6; index++) {
        data.push(forecastData.forecast.forecastday[j].hour.filter(obj => obj.time.split(' ')[1].split(':')[0].includes(hour)));
        if (hour == '23') {
            hour = '00';
            j++;
        } else if (hour.startsWith('0')) {
            let end = Number(hour.charAt(1));
            end++;
            hour = String(end).padStart(2, '0');
        } else {
            let int = Number(hour);
            int++;
            hour = String(int);
        }
    }
    console.log(data);

    data.forEach(el => {

        forecastHourlyDataDisplay.innerHTML += `
                                <div class="card-hourly">
                                    <span class="day fw-semibold">${el[0].time.split(' ')[1]}</span>
                                    <div class="img">
                                        <img src="http:${el[0].condition.icon}" alt="sunny"><br>
                                    </div>
                                    <h4 class="fw-bold">${el[0].temp_c} °C</h4>
                                    <span class="fw-semibold condition text-center mb-2">${el[0].condition.text}</span>
                                </div>`
    })
}

//add clock

function displayClock() {
    let display = new Date().toLocaleTimeString();
    document.getElementById('time').innerHTML = display;
    setTimeout(displayClock, 1000);
}

//set date

function displayDate(){
    let display = new Date().toLocaleDateString();
    document.getElementById('date').innerHTML = display;
    setTimeout(displayDate, 10000)
}

//greetings 

function setGreetings(){
    if (new Date().getHours() < 12 & new Date().getHours() >= 5) {
        greetingDisplay.innerText = 'Good Morning !';
    }else if (new Date().getHours() < 17 & new Date().getHours() >= 12) {
        greetingDisplay.innerText = 'Good Afternoon !'
    }else{
        greetingDisplay.innerText = 'Good Evening !'
    }
    setTimeout(setGreetings, 10000)
}