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
	 		$.getJSON(`https://api-v3.mbta.com/schedule?filter[route]=${routeid}`, function(routeschedule) {
	 			document.write(JSON.stringify(routedata));
	 		});
	 	});
	 });
});



//https://api-v3.mbta.com/routes
//curl -X GET "https://api-v3.mbta.com/trips?sort=block_id&filter%5Bdirection_id%5D=0" -H "accept: application/vnd.api+json"