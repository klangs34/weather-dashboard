//set variables
var APIKEY = '9455772c4a40c5c2b46591c2634c0244'
var cityURL = `http://api.openweathermap.org/data/2.5/weather?APPID=${APIKEY}&q=`
var cityUV = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}`
var fiveDayURL = `http://api.openweathermap.org/data/2.5/forecast?APPID=${APIKEY}&q=`
//get current date
var current_datetime = new Date();
//format date
var formatted_date = current_datetime.getMonth() + 1 + "/" + current_datetime.getDate() + "/" + current_datetime.getFullYear()
var searchedArr = [];
var city, temparature, humidity, wind, index, icon;
var dateEl = $('#date');

$(document).ready(function () {

    function displaySearchedList() {
        console.log('nothing yet')
    }

    function displayFiveDay() {
        $.ajax({
            url: fiveDayURL + city + ',us&units=imperial',
            method: "GET"
        }).then(function (response) {
            //console.log(response.list.length)
            for (var i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    console.log(response.list[i]);
                    var forcast = $('#forcast');
                    var fiveDayIcon = `http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png`;
                    var temp = response.list[i].main.temp;
                    var humidity = response.list[i].main.humidity;
                    var div = $('<div class="card p-2 bg-primary text-white" style="width: 20%;">');
                    var dateP = $('<p>');
                    //add data p
                    dateP.text(response.list[i].dt_txt);
                    div.append(dateP);
                    //create img
                    var img = $('<img>');
                    //add attr to image
                    img.attr('src', fiveDayIcon);
                    //append image to div element
                    div.append(img);
                    //create temp element
                    var tempP = $('<p>');
                    tempP.text('Temp: ' + temp + String.fromCharCode(176) + ' F');
                    //add temp el to the div
                    div.append(tempP);
                    //add div to forcast div
                    $('#forcast').append(div);
                    var humidityP = $('<p>');
                    humidityP.text('Humidity: ' + humidity + '%');
                    div.append(humidityP);
                }
            }
        })
    }

    $('button').on('click', function (e) {
        e.preventDefault();
        var searchedCity = $('#city').val();
        console.log(searchedCity)
        $.ajax({
            url: cityURL + searchedCity + ',us&units=imperial',
            method: "GET"
        }).then(function (response) {
            console.log(response);
            //get lattitue and longitude for searched UV index
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            $.ajax({
                url: cityUV + `&lat=${lat}&lon=${lon}`,
                method: "GET"
            }).then(function (data) {
                //set a value for the current UV index.
                index = data.value;
                displayDashbord();
            })
            console.log(index)
            //if search returns a result, store the searched value in search array.
            searchedArr.push(searchedCity);
            localStorage.setItem('searchedItems', JSON.stringify(searchedCity));
            city = searchedCity;
            console.log(city)
            temparature = response.main.temp;
            humidity = response.main.humidity;
            wind = response.wind.speed;
            icon = `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
        }).catch(function (error) {
            //set default text in summary section i.e. No results shown...
        })
    })



    function displayDashbord() {
        //put city in city field
        $('#showCity').text(city);
        //put date in date field
        dateEl.text('(' + formatted_date + ')');
        //set image to represent the weather conditions
        $('#image').attr('src', icon);
        $('#temperature').text(temparature + String.fromCharCode(176) + ' F');
        $('#humidity').text(humidity + '%');
        $('#wind').text(wind + ' MPH');
        console.log(index)
        $('#index').text(index);
        displayFiveDay();
    }

    displaySearchedList();
})
