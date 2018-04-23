// $(document).ready(function(){
//     $("button").click(function(){
// 		$.getJSON('https://api-v3.mbta.com/routes?filter[type]=3', function(data) {
// 	 		console.log("This is mbtainfo", data);
// 	 		document.write(JSON.stringify(data.data[0].attributes.color));
// 	 		//document.write(data.object);
// 	 		//mbtainfo = data;
// 	 	});
// 	 });
// });



$(document).ready(function(){
    $("button").click(function(){
		$.getJSON('https://api-v3.mbta.com/routes?filter[type]=3', function(routedata) {
	 		console.log("This is mbtainfo", routedata);
	 		var routeid = routedata.data[0].id;
	 		var tripid;
	 		$.getJSON(`https://api-v3.mbta.com/schedules?filter[route]=${routeid}`, function(routeschedule) {
	 			//document.write(JSON.stringify(routeschedule));
	 			//document.write(JSON.stringify(routeschedule.data[0].relationships));
	 			tripid = routeschedule.data[0].relationships.trip.data.id;
	 			//document.write(JSON.stringify(tripid));
	 		});
	 		document.write(JSON.stringify(tripid));
	 		// $.getJSON(`https://api-v3.mbta.com/schedules?filter[route]=${routeid}`, function(routeschedule) {
	 		// 	//document.write(JSON.stringify(routeschedule));
	 		// 	//document.write(JSON.stringify(routeschedule.data[0].relationships));
	 		// 	scheduleid = routeschedule.data[0].relationships.trip.data.id;
	 		// 	document.write(JSON.stringify(scheduleid));
	 		// });
	 	});
	 });
});



//https://api-v3.mbta.com/routes
//curl -X GET "https://api-v3.mbta.com/trips?sort=block_id&filter%5Bdirection_id%5D=0" -H "accept: application/vnd.api+json"