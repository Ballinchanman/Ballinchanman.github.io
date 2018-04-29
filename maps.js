// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
function initMap() {
   var boston = {lat: 42.3601, lng: -71.05};
   var nextBus= {lat:42.3759, lng:-71.1149};
  map = new google.maps.Map(document.getElementById('map'), {
    center: boston,
    zoom: 13
  });
  infoWindow = new google.maps.InfoWindow;
  var marker = new google.maps.Marker({
    map: map
  });
  var nextMarker = new google.maps.Marker({
    map: map
  });
 mymarkers = loadbusinfo();
 console.log(mymarkers);
  for (var i = 0; i < mymarkers.length; i++) {
    mymarkers[i].setMap(map);
  }
  // Try HTML5 geolocation.
  var stoponelocation = {lat: 42.352, lng: -71.055};
  var stopone = new google.maps.Marker({
    position: stoponelocation,
    map: map,
    title: 'Hello World!'
  });
  // var stop2 = new google.maps.Marker({
  //   lat: Number(tripstops.data[i].attributes.latitude),
  //   lng: Number(tripstops.data[i].attributes.longitude),
  //   map: map
  // });
  // var stop3 = new google.maps.Marker({
  //   lat: Number(tripstops.data[i].attributes.latitude),
  //   lng: Number(tripstops.data[i].attributes.longitude),
  //   map: map
  // });
  // var stop4 = new google.maps.Marker({
  //   lat: Number(tripstops.data[i].attributes.latitude),
  //   lng: Number(tripstops.data[i].attributes.longitude),
  //   map: map
  // });
  // var stop5 = new google.maps.Marker({
  //   lat: Number(tripstops.data[i].attributes.latitude),
  //   lng: Number(tripstops.data[i].attributes.longitude),
  //   map: map
  // });


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      marker.setPosition(pos);
      nextMarker.setPosition(nextBus);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}



function loadbusinfo() {
    var triproutes = [];
    $.getJSON('https://api-v3.mbta.com/routes?filter[type]=3', function(routedata) {
        console.log("This is mbtainfo", routedata);
        var routeid = routedata.data[0].id;

        $.getJSON(`https://api-v3.mbta.com/schedules?filter[route]=${routeid}`, function(routeschedule) {
            tripid = routeschedule.data[0].relationships.trip.data.id;

            $.getJSON(`https://api-v3.mbta.com/schedules?filter[trip]=${tripid}`, function(tripschedule) {
                tripschedule.data.forEach(function(element, index, arr) {
                    triproutes.push(element.relationships.stop.data.id);
                });
                var triproutesstring = "";
                triproutes.forEach(function(element, index, arr) {
                    triproutesstring += element + ",";
                })

                $.getJSON(`https://api-v3.mbta.com/stops?filter[id]=${triproutesstring}`, function(tripstops) {
                  //document.write(JSON.stringify({tripschedule:tripschedule, tripstops:tripstops}));
                  //return [tripstops, tripschedule];
                  var markers = []
                    for (var i = 0; i < tripstops.data.length; i++) {
                      var marker = new google.maps.Marker({
                        lat: Number(tripstops.data[i].attributes.latitude),
                        lng: Number(tripstops.data[i].attributes.longitude),
                        map: map
                      });
                      console.log(typeof(tripstops.data[i].attributes.latitude),typeof(tripstops.data[i].attributes.longitude));
                      console.log(tripstops.data[i].attributes.latitude,tripstops.data[i].attributes.longitude);
                      // console.log("The current marker", marker);

                      var infoWindow = new google.maps.InfoWindow({
                        content: `<h1>${tripstops.data[i].attributes.name}</h1>`
                      });
                      marker.addListener('click', function() {
                        infoWindow.open(map, marker);
                      });
                      markers.push(marker);
                    }
                    // document.write(markers);
                    console.log(markers);
                    console.log(map);

                    // return markers;


                });

            });
        });
        return markers;
    });
}

// function getbusinfo() {
//     var triproutes = [];
//     $.getJSON('https://api-v3.mbta.com/routes?filter[type]=3', function(routedata) {
//         console.log("This is mbtainfo", routedata);
//         var routeid = routedata.data[0].id;
//
//         $.getJSON(`https://api-v3.mbta.com/schedules?filter[route]=${routeid}`, function(routeschedule) {
//             tripid = routeschedule.data[0].relationships.trip.data.id;
//
//             $.getJSON(`https://api-v3.mbta.com/schedules?filter[trip]=${tripid}`, function(tripschedule) {
//                 tripschedule.data.forEach(function(element, index, arr) {
//                     triproutes.push(element.relationships.stop.data.id);
//                 });
//                 var triproutesstring = "";
//                 triproutes.forEach(function(element, index, arr) {
//                     triproutesstring += element + ",";
//                 })
//
//                 $.getJSON(`https://api-v3.mbta.com/stops?filter[id]=${triproutesstring}`, function(tripstops) {
//                   //document.write(JSON.stringify({tripschedule:tripschedule, tripstops:tripstops}));
//                   return [tripstops, tripschedule];
//
//                 });
//
//             });
//         });
//     });
// }
