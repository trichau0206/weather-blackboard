var current = $('#current');
var city = $('#City');
var icon =$('#icon');
var temp = $('#temp');
var wind = $('#wind');
var humidity = $('#humidity');
var uv = $('#uv');
var sunrise =$('#sunrise');
var sunset =$('#sunset');
var fiveDay =$('#fiveDay');
var search = $('#searchBtn');
let inputEl = $('#userInput');
var longitude ='';
var latitude =''

inputEl.keypress(function(event) {
    if (event.keyCode === 13) {
        currentData(inputEl.val())
        addToRecentSearches(inputEl.val());
    }
});

search.on("click", function(event) {
    event.preventDefault();;
    var input = inputEl.val()
    if (input == "") {
      return;
    } else {
      currentData(input);
      addToRecentSearches(input);
    }
  });



  getRecentSearches();



var citiesData = [];

function addToRecentSearches(input) {
$("#recent-searches").show();

var newCity = $("<li>");
newCity.addClass("list-group-item");
newCity.text(input);

$("#recent-searches-list").prepend(newCity);

var cityObj = {
input: input
};

citiesData.push(cityObj);

localStorage.setItem("searches", JSON.stringify(citiesData));
}
  
$("#recent-searches-list").on("click", "li.list-group-item", function() {
var history = $(this).text();
  
  weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ history +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
  console.log(weatherURL);
  fetch(weatherURL)
  .then(response => response.json())
  .then(data => {
      longitude = data.coord.lon;
      latitude = data.coord.lat;
      var iconCode=data.weather[0].icon;
      var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
  fetch(iconurl)
      .then(data => {
          icon.attr('src', data.url)
      });
      city.text(`${data.name} (${getDate(data.dt)})`);
      currentWeather();
  });
}); 
          

	function getRecentSearches() {
	  var searches = JSON.parse(localStorage.getItem("searches"));
	  if (searches != null) {
		for (var i = 0; i < searches.length; i++) {

		  var newCity = $("<li>");
		  newCity.addClass("list-group-item");
		  newCity.text(searches[i].input);

		  $("#recent-searches-list").prepend(newCity);
		}
		$("#recent-searches").show();
	  } else {
		$("#recent-searches").hide();
	  }
	}
    
    $("#clearBtn").on("click", function() {
        localStorage.clear();
        $("#recent-searches-list").empty();
    });

function currentData() {
    var city_name = inputEl.val();
    weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ city_name +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
    console.log(weatherURL);
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
        longitude = data.coord.lon;
        latitude = data.coord.lat;
        var iconCode=data.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
    fetch(iconurl)
        .then(data => {
            icon.attr('src', data.url)
        });
        city.text(`${data.name} (${getDate(data.dt)})`);
        currentWeather();
    });
};

function currentWeather(){
    urlWeather ="https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude +"&lon=" + longitude + "&units=imperial&appid=35d94501369d43748d1a83d5811f76e7";
    console.log(urlWeather);
    fetch(urlWeather)
    .then(response => response.json())
    .then(data => {

        console.log(data);
        temp.text(`Current Temperature: ${data.current.temp}\xB0F`);
        wind.text(`Wind: ${data.current.wind_speed} MPH ${data.current.wind_deg}`);
        humidity.text(`Humidity: ${data.current.humidity}%`);
        uv.text(`UV Index: ${data.current.uvi}`);
        sunrise.text(`Sunrise: ${getTime(data.current.sunrise)}AM  `);
        sunset.text(`Sunset: ${getTime(data.current.sunset)}PM`);

        fiveDay.empty();
        console.log(data.daily)
        var dailyArray =data.daily
        for (var i =0; i<5;i++){
            var iconCode=dailyArray[i].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
            fetch(iconurl)
            .then(data => {
                $('#fiveDayIcon').attr('src', data.url);

            });

            fiverCards(getDate(dailyArray[i].dt),iconurl, dailyArray[i].temp.max, dailyArray[i].temp.min,
                  dailyArray[i].wind_speed,dailyArray[i].wind_deg, dailyArray[i].humidity, getTime(dailyArray[i].sunrise),getTime(dailyArray[i].sunset));

        }
    });
};

function fiverCards (date,icon,tempH,tempL,windSpeed,windDir,humidity,sunrise,sunset){
    
    fiveDay.append(`<div class="card d-inline-flex mx-3" style="width: 13rem;border-radius: 20px;background-color:black;">
    <div class="card-body text-center" id='fiverCards'>
    <h5 class="card-title" id='card-title'>${date}</h5>
    <img id ='fiveDayIcon'src=${icon}>
    <h6 class="card-subtitle mb-2 text-muted" id ='temps'>High: ${tempH}\xB0F</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='temps'>Low: ${tempL}\xB0F</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='cardinfo'>Wind: ${windSpeed} MPH ${windDir}</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='cardinfo'>Humidity: ${humidity}%</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='cardinfo'>Sunrise: ${sunrise} AM</h6>
    <h6 class="card-subtitle mb-2 text-muted" id ='cardinfo'>Sunset: ${sunset}PM</h6>
    
    
    </div>
    </div>`);
};

function getTime(unix_time){
    var date = new Date(unix_time*1000);
    var hours = date.getHours();
    if(hours>12){
        hours-=12;``
    }
    var minutes = date.getMinutes()
    
    if(minutes<10){
        minutes ='0'+minutes;
        
    }
    return `${hours}:${minutes}`;
};

function getDate(unix_time){
    var date = new Date(unix_time*1000);
    var month =date.getMonth()+1;
    var day = date.getDate();
    var year = date.getFullYear();
    return`${month}/${day}/${year}`;
}

var names = ['Austin', 'Chicago', 'new york', 'Orlando', 'san francisco', 'Seattle', 'Denver', 'Atlanta']
var cities = [$('#Austin'), $('#Chicago'), $('#New'), $('#Orlando'), $('#San'), $('#Seattle'), $('#Denver'), $('#Atlanta')]
for (let i = 0; i < cities.length && names.length; i++) {
cities[i].on('click',()=>{
   weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q='+ names[i] +'&units=imperial&appid=35d94501369d43748d1a83d5811f76e7';
    fetch(weatherURL)
    .then(response => response.json())
    .then(data => {

        longitude = data.coord.lon;
        latitude = data.coord.lat;

        var iconCode=data.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + iconCode + ".png";

        fetch(iconurl)
        .then(data => {
            icon.attr('src', data.url)

        });
        city.text(`${data.name} (${getDate(data.dt)})`);
        currentWeather();
        });
})}