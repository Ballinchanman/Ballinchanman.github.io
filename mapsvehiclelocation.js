
function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
  });


// var stoponelocation = {lat: 42.3522, lng: -71.0552};

  var locationinfo = [];
  var buspos = {lat:0, lng:0};
  var busid = 0;

  $.getJSON('https://api-v3.mbta.com/routes?filter[type]=3', function(routedata) {
      var triproutes = [];
      var routeid = routedata.data[0].id;

      $.getJSON(`https://api-v3.mbta.com/schedules?filter[route]=${routeid}`, function(routeschedule) {
          tripid = routeschedule.data[0].relationships.trip.data.id;

          // $.getJSON(`https://api-v3.mbta.com/schedules?filter[trip]=${tripid}`, function(tripschedule) {
          // for getting active bus stops (change trip id)
          $.getJSON(`https://api-v3.mbta.com/schedules?filter[trip]=36686311`, function(tripschedule) {
              tripschedule.data.forEach(function(element, index, arr) {
                  triproutes.push(element.relationships.stop.data.id);
              });
              var triproutesstring = "";
              triproutes.forEach(function(element, index, arr) {
                  triproutesstring += element + ",";
              })
              console.log(tripschedule);
              console.log(triproutesstring);

              $.getJSON(`https://api-v3.mbta.com/stops?filter[id]=${triproutesstring}`, function(tripstops) {


                  for (var i = 0; i < tripstops.data.length; i++) {
                      locationinfo.push(
                        {
                          name: tripstops.data[i].attributes.name,
                          pos:
                          {
                            lat: Number(tripstops.data[i].attributes.latitude),
                            lng: Number(tripstops.data[i].attributes.longitude)
                          }
                        }
                      )
                  }
              });

              // for getting active bus location (change trip id)

              $.getJSON(`https://api-v3.mbta.com/vehicles?filter[trip]=36686311`, function(vehicleinfo) {
                // document.write(vehicleinfo.data[0].attributes.latitude + '</br>');
                // document.write(vehicleinfo.data[0].attributes.longitude + '</br>');
                buspos = {
                  lat: vehicleinfo.data[0].attributes.latitude,
                  lng: vehicleinfo.data[0].attributes.longitude
                };
                busid = vehicleinfo.data[0].id;
                // console.log(buspos);



              });



          });
      });
  });
  console.log(locationinfo);
  setTimeout(function() {
    console.log(buspos);
  },3000);


  var iconBase = 'GoogleMapsMarkers/Google Maps Markers/';
  var icons = [
    iconBase + 'paleblue_MarkerA.png',
    iconBase + 'blue_MarkerB.png',
    iconBase + 'green_MarkerC.png',
    iconBase + 'darkgreen_MarkerD.png',
    iconBase + 'purple_MarkerE.png',
    iconBase + 'paleblue_MarkerF.png',
    iconBase + 'blue_MarkerG.png',
    iconBase + 'green_MarkerH.png',
    iconBase + 'darkgreen_MarkerI.png',
    iconBase + 'purple_MarkerJ.png',
    iconBase + 'paleblue_MarkerK.png',
    iconBase + 'blue_MarkerL.png',
    iconBase + 'green_MarkerM.png',
    iconBase + 'darkgreen_MarkerN.png',
    iconBase + 'purple_MarkerO.png',
    iconBase + 'paleblue_MarkerP.png',
    iconBase + 'blue_MarkerQ.png',
    iconBase + 'green_MarkerR.png',
    iconBase + 'darkgreen_MarkerS.png',
    iconBase + 'purple_MarkerT.png',
    iconBase + 'paleblue_MarkerU.png',
    iconBase + 'blue_MarkerV.png',
    iconBase + 'green_MarkerW.png',
    iconBase + 'darkgreen_MarkerX.png',
    iconBase + 'purple_MarkerY.png',
    iconBase + 'paleblue_MarkerZ.png'
  ];

  setTimeout(function() {
  var markers = []
  for (var i = 0; i < locationinfo.length; i++) {
    var marker = new google.maps.Marker({
        position: locationinfo[i].pos,
        map: map,
        title: locationinfo[i].name,
        icon: icons[i]
    });
    var infoWindow = new google.maps.InfoWindow({

      // content: `<h1>Help</h1>`
    });
    google.maps.event.addListener(marker,'click', (function(marker,i) {
      return function() {
        var content= `<h2>${locationinfo[i].name}</h2>`
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      }
    })(marker, i));
    markers.push(marker);
  }
  // for (var i = 0; i < markers.length; i++) {
  //   var infoWindow = new google.maps.InfoWindow({
  //     content: `<h1>${locationinfo[i].name}</h1>`
  //   });
  //   markers[i].addListener('click', function() {
  //     infoWindow.open(map, markers[i]);
  //   });
  // }


  var marker = new google.maps.Marker({
      position: buspos,
      map: map,
      title: 'Bus',
      icon: iconBase + 'yellow_MarkerB.png'
  });
  var infoWindow = new google.maps.InfoWindow({
  });
  google.maps.event.addListener(marker,'click', (function(marker) {
    return function() {
      var content= `<h2>The bus is here</h2>`
      infoWindow.setContent(content);
      infoWindow.open(map, marker);
    }
  })(marker));
  markers.push(marker);



  }, 3000);





  var infoWindow = new google.maps.InfoWindow({
    content: "First Stop"
  });
  var marker = new google.maps.Marker({
    map: map,
    title: 'Hello World!',
    label: 'Me'
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      marker.setPosition(pos);
      //nextMarker.setPosition(nextBus);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  setTimeout(function() {
    var legendicons = [];
    for (var i = 0; i < locationinfo.length; i++) {
      legendicons.push({
        name: locationinfo[i].name,
        icon: icons[i]
      })
    }

    var legend = document.getElementById('legend');
    for (var i = 0; i < legendicons.length; i++) {
      var name = legendicons[i].name;
      var icon = legendicons[i].icon;
      var div = document.createElement('div');
      console.log(name, icon);
      div.innerHTML = '<img src="' + icon + '"> ' + name;
      legend.appendChild(div);
    }
    var name = 'Bus ' + busid;
    var icon = iconBase + 'yellow_MarkerB.png';
    var div = document.createElement('div');
    console.log(name, icon);
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  }, 3000);

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
                      var infoWindow = new google.maps.InfoWindow({
                        content: `<h1>${tripstops.data[i].attributes.name}</h1>`
                      });
                      marker.addListener('click', function() {
                        infoWindow.open(map, marker);
                      });
                });
            });
        });
    });
}
