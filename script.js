//set variables
var APIKEY = '9455772c4a40c5c2b46591c2634c0244'
var cityURL = `http://api.openweathermap.org/data/2.5/weather?APPID=${APIKEY}&q=`
var cityUV = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}`
var fiveDayURL = `http://api.openweathermap.org/data/2.5/forecast?APPID=${APIKEY}&q=`
//get current date
var current_datetime = new Date();
//format date
var formatted_date = current_datetime.getMonth() + 1 + "/" + current_datetime.getDate() + "/" + current_datetime.getFullYear()
var searchedArr = JSON.parse(localStorage.getItem('searchedItems')) || [];
var city, temparature, humidity, wind, index, icon;
var dateEl = $('#date');

$(document).ready(function () {

    function displaySearchedList() {
        $('#searchedList').empty();
        //create list item based on searched array if it exists
        if (searchedArr.length > 0) {
            searchedArr.forEach(function (val) {
                console.log(val)
                var li = $('<li>').attr('class', 'list-group-item');
                li.text(val);
                $('#searchedList').append(li)
            })
        }
    }

    function displayFiveDay() {
        $.ajax({
            url: fiveDayURL + city + ',us&units=imperial',
            method: "GET"
        }).then(function (response) {
            //console.log(response.list.length)
            for (var i = 0; i < response.list.length; i++) {
                if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    var forcast = $('#forcast');
                    var fiveDayIcon = `http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png`;
                    var temp = response.list[i].main.temp;
                    var humidity = response.list[i].main.humidity;
                    var div = $('<div class="card p-2 bg-primary text-white mx-1 px-1" style="width: 18%;">');
                    var dateP = $('<p>');
                    //add data p
                    var formattedDate = response.list[i].dt_txt.slice(0, response.list[i].dt_txt.indexOf(" "));
                    var newFormatDate = new Date(formattedDate);
                    var lastFormatDate = newFormatDate.getMonth() + 1 + "/" + newFormatDate.getDate() + "/" + newFormatDate.getFullYear();
                    dateP.text(lastFormatDate);
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
                    forcast.append(div);
                    var humidityP = $('<p>');
                    humidityP.text('Humidity: ' + humidity + '%');
                    div.append(humidityP);
                }
            }
        })
    }

    function getResults(searchedCity) {
        if (!searchedCity) {
            var searchedCity = $('#city').val();
        }
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
                //clear search field
                $('#city').val(" ");
                //display results
                displayDashbord();
                displaySearchedList();
            })
            //if search returns a result, store the searched value in search array.
            //if a new search then push
            console.log(searchedArr.length)
            if (searchedArr.length > 0) {
                if (searchedArr.indexOf(searchedCity) === -1) {
                    searchedArr.push(searchedCity.toUpperCase());
                }
            } else {
                searchedArr.push(searchedCity.toUpperCase());
            }
            localStorage.setItem('searchedItems', JSON.stringify(searchedArr));
            city = searchedCity;
            console.log(city)
            temparature = response.main.temp;
            humidity = response.main.humidity;
            wind = response.wind.speed;
            icon = `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
        }).catch(function (error) {
            //set default text in summary section i.e. No results shown...
        })
    }

    $('button').on('click', function (e) {
        e.preventDefault();
        $('#forcast').empty();
        getResults();
    })



    function displayDashbord() {
        $('#forcast').empty();
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

    $(document).on('click', 'li', function (e) {
        e.preventDefault();
        var searchedCity = $(this).text();
        getResults(searchedCity);
    })

    displaySearchedList();
})
