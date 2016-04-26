$(function() {
	navigator.geolocation.getCurrentPosition(getUserPosition);
});

function getUserPosition(pos) {
	var latitude = pos.coords.latitude;
	var longitude = pos.coords.longitude;

	$.ajax({
		url: "http://maps.googleapis.com/maps/api/geocode/json?sensor=false&language=en&latlng="+ latitude +"," + longitude,
		method: 'GET',
		success: parseAddressComponents,
		dataType: 'json'
	});
}

function parseAddressComponents(response) {

	console.log(response);
	
	var locationTypeArray = ["locality", "political"];
	var searchedLocations = [];
	
	if(response.results && response.results.length > 0) {

		var addressComponentsArray = response.results[0].address_components;

		for(var i = 0; i < addressComponentsArray.length; i++) {

			var locationName = addressComponentsArray[i].long_name;

			if(addressComponentsArray[i].types.indexOf("political") > 0 && searchedLocations.indexOf(locationName) < 0) {

				searchedLocations.push(locationName);

				fetchNEWSResults(locationName, i);
			}
		}
	}
}

function fetchNEWSResults(locationName, index) {
	$.ajax({
		url: 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&q=' + locationName,
		method: 'GET',
		dataType: 'jsonp',
		success: function(data) {
			renderNEWSArticles(data, locationName, index);
		}
	});
}

function renderNEWSArticles(response, searchCriteria, index) {
	
	//console.log(response);

	var newsArray = response.responseData.results;

	var searchCriteriaPreviousIndex = getPreviousIndex(index);

	if(searchCriteriaPreviousIndex >= 0){
		$("#_container_location_" + searchCriteriaPreviousIndex).after	("<div id='_container_location_" + index + "'></div>");
	}
	else{
		$("#_news_container").append("<div id='_container_location_" + index + "'></div>");
	}

	

	$("#_container_location_" + index).append("<h3>" + searchCriteria + "</h3>");
	
	for(var i = 0; i < newsArray.length; i++) {
		$("#_container_location_" + index).append("<h4><a href='" + newsArray[i].signedRedirectUrl + "'>"  + newsArray[i].title + "</a></h4>");
		$("#_container_location_" + index).append("<p>" + newsArray[i].content + "</p>");
	}

	$("#_news_container").append("")
}

function getPreviousIndex(index) {
	for( var i = index - 1; i >= 0; i--) {
		if($("#_container_location_" + i).length > 0)
			return i;
	}

	return -1;
}
