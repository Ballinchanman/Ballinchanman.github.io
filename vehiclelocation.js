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
    $("#getroutes").click(function(){
        var triproutes = [];
        document.write("<h1>Current Route</h1></br>");
        $.getJSON('https://api-v3.mbta.com/routes?filter[type]=3', function(routedata) {
            console.log("This is mbtainfo", routedata);
            var routeid = routedata.data[0].id;
            $.getJSON(`https://api-v3.mbta.com/schedules?filter[route]=${routeid}`, function(routeschedule) {
                //document.write(JSON.stringify(routeschedule));
                //document.write(JSON.stringify(routeschedule.data[0].relationships));
                tripid = routeschedule.data[0].relationships.trip.data.id;
                // document.write(JSON.stringify(tripid));
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
                        for(let i = 0; i < triproutes.length; i++) {
                            document.write("Stop " + tripschedule.data[i].attributes.stop_sequence + ", "
                                + tripstops.data[i].attributes.name
                                + ", has coordinates " + tripstops.data[i].attributes.latitude + " and " + tripstops.data[i].attributes.longitude +
                                ", headed " + "INBOUND OR OUTBOUND" + " direction. It is scheduled to arrive at " + tripschedule.data[i].attributes.arrival_time + ".<br><br>");
                        }

                        var tablestring = "<div><table id='' style=" + "width:100%" + ">" +
                          "<tr><th>Name</th><th>Stop Number</th> <th>Arrival Time</th><th>Longitude</th><th>Latitude</th></tr>";
                        for(let i = 0; i < triproutes.length; i++) {
                            tablestring += "<tr><td>" + tripstops.data[i].attributes.name + "</td><td>" + tripschedule.data[i].attributes.stop_sequence + "</td>" +
                            "<td>" + tripschedule.data[i].attributes.arrival_time + "</td><td>" + tripstops.data[i].attributes.longitude + "</td>" +
                            "<td>" + tripstops.data[i].attributes.latitude + "</td></tr>";
                        }
                        tablestring += "</table></div>";
                        document.write(tablestring);
                        document.write('<a href="maps2.html">Go to the maps</a></br>');


                        $.getJSON(`https://api-v3.mbta.com/vehicles?filter[trip]=36686311`, function(vehicleinfo) {
                          document.write(vehicleinfo.data[0].attributes.latitude + '</br>');
                          document.write(vehicleinfo.data[0].attributes.longitude + '</br>');



                        });






                        36686311
                        // document.write('<a href="maps.html">Go to the maps</a></br>')
                        //document.write(JSON.stringify(triproutesstring));
                        // document.write("<h1>Upcoming Routes</h1></br>");
                        // $("body").css({"background": "skyblue", "font-family": "verdana", "color": "#fff", "padding": "30px"});
                        // $("a").css("color", "black");
                        // $("table").css({"border-collapse": "collapse", "border": "1px solid black"});
                        // $("table th").css({"border": "3px solid black", "border-color": "#3498DB"});
                        // $("table td").css({"border": "3px solid black", "border-color": "#3498DB"});
                        //
                        //
                        // $.getJSON(`https://api-v3.mbta.com/trips?filter[id]=${tripid}`, function(alltripinfo) {
                        //   var block_id = alltripinfo.data[0].attributes.block_id;
                        //   var lines = [];
                        //   var lineswoheaders = [];
                        //
                        //   $.ajax({
                        //       type: "GET",
                        //       url: "trips.txt",
                        //       dataType: "text",
                        //       success: function(data) {
                        //         processData(data);
                        //
                        //       }
                        //    });
                        //   function processData(allText) {
                        //       allText = allText.replace(/['"]+/g, '');
                        //       var allTextLines = allText.split(/\r\n|\n/);
                        //       //allTextLines = allTextLines.replace(/['"]+/g, '');
                        //       var headers = allTextLines[0].split(',');
                        //
                        //       for (var i=1; i<allTextLines.length; i++) {
                        //           var data = allTextLines[i].split(',');
                        //           if (data.length == headers.length) {
                        //
                        //               var tarr = [];
                        //               var tarr2 = [];
                        //               for (var j=0; j<headers.length; j++) {
                        //                   tarr.push(headers[j]+":"+data[j]);
                        //                   tarr2.push(data[j]);
                        //               }
                        //               lines.push(tarr);
                        //               lineswoheaders.push(tarr2);
                        //           }
                        //       }
                        //       // document.write(lines[256]);
                        //       // document.write(lineswoheaders[256]);
                        //       // alert(lines);
                        //   }
                        //
                        //   var tripblock = []
                        //   setTimeout(function() {
                        //     for(var i = 0; i <lines.length; i++) {
                        //       if (lineswoheaders[i][6] === block_id) {
                        //         tripblock.push(lineswoheaders[i]);
                        //       }
                        //     }
                        //     //document.write(tripblock);
                        //   }, 3000);
                        //
                        //   var temptablestring = "<div><table style=" + "width:100%" + ">" +
                        //     "<tr><th>Name</th><th>Stop Number</th> <th>Arrival Time</th><th>Longitude</th><th>Latitude</th></tr>";
                        //   setTimeout(function() {
                        //     for(var i = 0; i < tripblock.length; i++) {
                        //       var temptripid = tripblock[i][2];
                        //       var temptriproutes = [];
                        //       $.getJSON(`https://api-v3.mbta.com/schedules?filter[trip]=${temptripid}`, function(temptripschedule) {
                        //           temptripschedule.data.forEach(function(element, index, arr) {
                        //               temptriproutes.push(element.relationships.stop.data.id);
                        //               //document.write(element.relationships.stop.data.id + "<br>");
                        //           });
                        //           var temptriproutesstring = "";
                        //           temptriproutes.forEach(function(element, index, arr) {
                        //               temptriproutesstring += element + ",";
                        //           })
                        //
                        //           $.getJSON(`https://api-v3.mbta.com/stops?filter[id]=${temptriproutesstring}`, function(temptripstops) {
                        //               for(let k = 0; k < temptriproutes.length; k++) {
                        //                   console.log(k);
                        //                   document.write("Stop " + temptripschedule.data[k].attributes.stop_sequence + ", "
                        //                       + temptripstops.data[k].attributes.name
                        //                       + ", has coordinates " + temptripstops.data[k].attributes.latitude + " and " + temptripstops.data[k].attributes.longitude +
                        //                       ", headed " + "INBOUND OR OUTBOUND" + " direction. It is scheduled to arrive at " + temptripschedule.data[k].attributes.arrival_time + ".<br>");
                        //               }
                        //
                        //               for(let j = 0; j < 2; j++) {
                        //                 // document.write(JSON.stringify(temptripstops));
                        //                   temptablestring += "<tr><td>" + temptripstops.data[j].attributes.name + "</td><td>" + temptripschedule.data[j].attributes.stop_sequence + "</td>" +
                        //                   "<td>" + temptripschedule.data[j].attributes.arrival_time + "</td><td>" + temptripstops.data[j].attributes.longitude + "</td>" +
                        //                   "<td>" + temptripstops.data[j].attributes.latitude + "</td></tr>";
                        //               }
                        //               // document.write(JSON.stringify(temptripstops));
                        //               // console.log(temptripstops);
                        //               // console.log(temptablestring);
                        //               document.write(temptablestring);
                        //           });
                        //       });
                        //
                        //     }
                        //   }, 3000);

                          // setTimeout(function() {
                          //   //tablestring += "</table></div>";
                          //   //console.log(tablestring);
                          //   //document.write(tablestring);
                          //   document.write('<a href="maps.html">Go to the maps</a></br>')
                          // }, 3000);


                          // setTimeout(function() {
                          //   // tablestring += "</table></div>";
                          //   //console.log(tablestring);
                          //   //document.write(tablestring);
                          //   // document.write('<a href="maps.html">Go to the maps</a></br>')
                          // }, 10000);

                          // tablestring += "</table></div>";
                          // document.write(tablestring);
                          // document.write('<a href="maps.html">Go to the maps</a></br>')

                          //document.write('"block_id":"'+block_id+'"');

                          // var someStr = 'He said "Hello, my name is Foo"';
                          // console.log(someStr.replace(/['"]+/g, ''));
                          // console.log(someStr);
                          // document.write(String(lines[256]).replace(/['"]+/g, ''));
                          // document.write(typeof String(lines[256]));





                        });




                        // var tablestring = "<div><table style=" + "width:100%" + ">" +
                        //   "<tr><th>Name</th><th>Stop Number</th> <th>Arrival Time</th><th>Longitude</th><th>Latitude</th></tr>";
                        // for(let i = 0; i < triproutes.length; i++) {
                        //     tablestring += "<tr><td>" + tripstops.data[i].attributes.name + "</td><td>" + tripschedule.data[i].attributes.stop_sequence + "</td>" +
                        //     "<td>" + tripschedule.data[i].attributes.arrival_time + "</td><td>" + tripstops.data[i].attributes.longitude + "</td>" +
                        //     "<td>" + tripstops.data[i].attributes.latitude + "</td></tr>";
                        // }
                        // tablestring += "</table></div>";
                        // document.write(tablestring);
                        // document.write('<a href="maps.html">Go to the maps</a></br>')
                        // document.write(JSON.stringify(triproutesstring));


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
// });



//https://api-v3.mbta.com/routes
//curl -X GET "https://api-v3.mbta.com/trips?sort=block_id&filter%5Bdirection_id%5D=0" -H "accept: application/vnd.api+json"
