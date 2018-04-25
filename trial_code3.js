function getbusinfo() {
    var triproutes = [];
    $.getJSON('https://api-v3.mbta.com/routes?filter[type]=3', function(routedata) {
        console.log("This is mbtainfo", routedata);
        var routeid = routedata.data[0].id;

        $.getJSON(`https://api-v3.mbta.com/schedules?filter[route]=${routeid}`, function(routeschedule) {
            tripid = routeschedule.data[0].relationships.trip.data.id;

            $.getJSON(`https://api-v3.mbta.com/schedules?filter[trip]=${tripid}`, function(tripschedule) {
                tripschedule.data.forEach(function(element, index, arr) {
                    triproutes.push(element.relationships.stop.data.id);
                    //document.write(element.relationships.stop.data.id + "<br>");
                });
                var triproutesstring = "";
                triproutes.forEach(function(element, index, arr) {
                    triproutesstring += element + ",";
                })

                $.getJSON(`https://api-v3.mbta.com/stops?filter[id]=${triproutesstring}`, function(tripstops) {
                  tripinfo = [tripstops, tripschedule];
                  //document.write(JSON.stringify(tripinfo[1]));
                  return tripinfo;

                });

            });
        });
    });
}

var tripinfo = getbusinfo();
setTimeout(function() {
  document.write(JSON.stringify(tripinfo[0]));
}, 3000);
// document.write(JSON.stringify(tripinfo));

function addMarker(tripinfo) {
  for (var i = 0; i < tripinfo.tripstops.data.length; i++) {
    var marker = new google.maps.Marker({
      lat: tripinfo.tripstops.data[i].attributes.latitude,
      lng: tripinfo.tripstops.data[i].attributes.longitude,
      map: map
    });
  }

  var infoWindow = new google.maps.InfoWindow({
    content: `<h1>${tripinfo.tripstops.data[i].attributes.name}</h1>`
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });
}



//https://api-v3.mbta.com/routes
//curl -X GET "https://api-v3.mbta.com/trips?sort=block_id&filter%5Bdirection_id%5D=0" -H "accept: application/vnd.api+json"
