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
                //document.write(JSON.stringify(tripid));
                $.getJSON(`https://api-v3.mbta.com/schedules?filter[trip]=${tripid}`, function(tripschedule) {
                    tripschedule.data.forEach(function(element, index, arr) {
                        triproutes.push(JSON.stringify(element.relationships.stop.data.id))
                    });
                    //document.write(triproutes);
                    var triproutesstring = "";
                    triproutes.forEach(function(element, index, arr) {
                        triproutesstring += element + ",";
                    })

                    


                    $.getJSON(`https://api-v3.mbta.com/stops?filter[id]=${triproutesstring}`, function(tripstops) {
                        for(let i = 0; i < triproutes.length; i++) {
                            document.write("Stop " + tripschedule.data[i].attributes.stop_sequence + ", " 
                                + tripstops.data[i].attributes.name
                                + ", has coordinates " + tripstops[i].attributes.latitude + " and " + tripstops[i].attributes.longitude +
                                ", headed " + "INBOUND OR OUTBOUND" + " direction. It is scheduled to arrive at " + tripschedule[i].attributes.arrivaltime + ".<br>");
                        }
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