// $(document).ready(function(){
//     $("button").click(function(){
//      $.getJSON('https://api-v3.mbta.com/routes?filter[type]=3', function(data) {
//          console.log("This is mbtainfo", data);
//          document.write(JSON.stringify(data.data[0].attributes.color));
//          //document.write(data.object);
//          //mbtainfo = data;
//      });
//   });
// });



$(document).ready(function(){
    $("button").click(function(){
        var triproutes = [];
        $.getJSON('https://api-v3.mbta.com/routes?filter[type]=3', function(routedata) {
            console.log("This is mbtainfo", routedata);
            var routeid = routedata.data[0].id;
            $.getJSON(`https://api-v3.mbta.com/schedules?filter[route]=${routeid}`, function(routeschedule) {
                //document.write(JSON.stringify(routeschedule));
                //document.write(JSON.stringify(routeschedule.data[0].relationships));
                tripid = routeschedule.data[0].relationships.trip.data.id;
                document.write(JSON.stringify(tripid));
                $.getJSON(`https://api-v3.mbta.com/schedules?filter[trip]=${tripid}`, function(tripschedule) {
                    tripschedule.data.forEach(function(element, index, arr) {
                        triproutes.push(element.relationships.stop.data.id);
                        document.write(element.relationships.stop.data.id + "<br>");
                    });
                    var triproutesstring = "";
                    triproutes.forEach(function(element, index, arr) {
                        triproutesstring += element + ",";
                    })



                    // $.getJSON('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyD_T_-YzFPgc7SN_u54aQVInF2GsWlW0cY&callback=?', function(distancedata) {
                    //   // console.log(distancedata);
                    //   // document.write(JSON.stringify(distancedata));
                    // });

                    $.ajax({
                       type:  'GET',
                       url:   'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyD_T_-YzFPgc7SN_u54aQVInF2GsWlW0cY',
                       dataType: 'json',
                       success: function(distancedata){
                           console.log(distancedata);
                       }
                    });




                    $.getJSON(`https://api-v3.mbta.com/stops?filter[id]=${triproutesstring}`, function(tripstops) {
                        for(let i = 0; i < triproutes.length; i++) {
                            document.write("Stop " + tripschedule.data[i].attributes.stop_sequence + ", "
                                + tripstops.data[i].attributes.name
                                + ", has coordinates " + tripstops.data[i].attributes.latitude + " and " + tripstops.data[i].attributes.longitude +
                                ", headed " + "INBOUND OR OUTBOUND" + " direction. It is scheduled to arrive at " + tripschedule.data[i].attributes.arrival_time + ".<br>");
                        }

                        $.getJSON(`https://api-v3.mbta.com/trips?filter[id]=${tripid}`, function(alltripinfo) {
                          var block_id = alltripinfo.data[0].attributes.block_id;
                          var lines = [];
                          var lineswoheaders = [];

                          $.ajax({
                              type: "GET",
                              url: "trips.txt",
                              dataType: "text",
                              success: function(data) {
                                processData(data);

                              }
                           });
                          function processData(allText) {
                              allText = allText.replace(/['"]+/g, '');
                              var allTextLines = allText.split(/\r\n|\n/);
                              //allTextLines = allTextLines.replace(/['"]+/g, '');
                              var headers = allTextLines[0].split(',');

                              for (var i=1; i<allTextLines.length; i++) {
                                  var data = allTextLines[i].split(',');
                                  if (data.length == headers.length) {

                                      var tarr = [];
                                      var tarr2 = [];
                                      for (var j=0; j<headers.length; j++) {
                                          tarr.push(headers[j]+":"+data[j]);
                                          tarr2.push(data[j]);
                                      }
                                      lines.push(tarr);
                                      lineswoheaders.push(tarr2);
                                  }
                              }
                              // document.write(lines[256]);
                              // document.write(lineswoheaders[256]);
                              // alert(lines);
                          }

                          var tripblock = []
                          setTimeout(function() {
                            for(var i = 0; i <lines.length; i++) {
                              if (lineswoheaders[i][6] === block_id) {
                                tripblock.push(lineswoheaders[i]);
                              }
                            }
                            document.write(tripblock);
                          }, 3000);

                          //document.write('"block_id":"'+block_id+'"');

                          // var someStr = 'He said "Hello, my name is Foo"';
                          // console.log(someStr.replace(/['"]+/g, ''));
                          // console.log(someStr);
                          // document.write(String(lines[256]).replace(/['"]+/g, ''));
                          // document.write(typeof String(lines[256]));





                        });




                        var tablestring = "<div><table style=" + "width:100%" + ">" +
                          "<tr><th>Name</th><th>Stop Number</th> <th>Arrival Time</th><th>Longitude</th><th>Latitude</th></tr>";
                        for(let i = 0; i < triproutes.length; i++) {
                            tablestring += "<tr><td>" + tripstops.data[i].attributes.name + "</td><td>" + tripschedule.data[i].attributes.stop_sequence + "</td>" +
                            "<td>" + tripschedule.data[i].attributes.arrival_time + "</td><td>" + tripstops.data[i].attributes.longitude + "</td>" +
                            "<td>" + tripstops.data[i].attributes.latitude + "</td></tr>";
                        }
                        tablestring += "</table></div>";
                        document.write(tablestring);
                        document.write('<a href="maps.html">Go to the maps</a></br>')
                        document.write(JSON.stringify(triproutesstring));


                        // var tablestring = "<div><table style=" + "width:100%" + ">" +
                        //   "<tr><th>Name</th><th>Stop Number</th> <th>Arrival Time</th><th>Longitude</th><th>Latitude</th></tr><tr>" +
                        //     "<tr><td>" + tripstops.data[0].attributes.name + "</td><td>" + tripschedule.data[0].attributes.stop_sequence + "</td>" +
                        //     "<td>" + tripschedule.data[0].attributes.arrival_time + "</td><td>" + tripstops.data[0].attributes.longitude + "</td>" +
                        //     "<td>" + tripstops.data[0].attributes.latitude + "</td></tr></tr></table></div>"
                        // var tablestring = "<div><table style=" + "width:100%" + ">" +
                        //   "<tr><th>Name</th><th>Stop Number</th> <th>Arrival Time</th><th>Longitude</th><th>Latitude</th></tr>" +
                        //     "<tr><td>" + tripstops.data[0].attributes.name + "</td><td>" + tripschedule.data[0].attributes.stop_sequence + "</td>" +
                        //     "<td>" + tripschedule.data[0].attributes.arrival_time + "</td><td>" + tripstops.data[0].attributes.longitude + "</td>" +
                        //     "<td>" + tripstops.data[0].attributes.latitude + "</td></tr></table></div>"
                        // document.write(tablestring);
                          // <tr>
                          //   {% for dict in table %}
                          //       <tr>
                          //           <td>{{ dict.symbol }}</td>
                          //           <td>{{ dict.name }}</td>
                          //           <td>{{ dict.shares }}</td>
                          //           <td>${{ dict.price }}</td>
                          //           <td>${{ dict.total }}</td>
                          //       </tr>
                          //   {% endfor %}
                          // </tr>
                          // <tr>
                          //     <td>CASH</td>
                          //     <td></td>
                          //     <td></td>
                          //     <td></td>
                          //     <td>${{ cash }}</td>
                          // </tr>
                          // <tr>
                          //     <td></td>
                          //     <td></td>
                          //     <td></td>
                          //     <td></td>
                          //     <th>${{ earnings }}</th>
                          // </tr>
                        //</table>
                        //document.write(JSON.stringify(tripstops));
                    });

                });
            });
            // document.write(JSON.stringify(tripid));
            // $.getJSON(`https://api-v3.mbta.com/schedules?filter[route]=${routeid}`, function(routeschedule) {
            //  //document.write(JSON.stringify(routeschedule));
            //  //document.write(JSON.stringify(routeschedule.data[0].relationships));
            //  scheduleid = routeschedule.data[0].relationships.trip.data.id;
            //  document.write(JSON.stringify(scheduleid));
            // });
        });
        //document.write(triproutes);
     });
});



//https://api-v3.mbta.com/routes
//curl -X GET "https://api-v3.mbta.com/trips?sort=block_id&filter%5Bdirection_id%5D=0" -H "accept: application/vnd.api+json"
