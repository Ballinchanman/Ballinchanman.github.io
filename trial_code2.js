$(document).ready(function(){
    $("button").click(function(){
		$.getJSON('https://api-v3.mbta.com/routes', function(data) {
	 		console.log("This is mbtainfo", data);
	 		document.write(JSON.stringify(data.data[0]));
	 		//document.write(data.object);
	 		//mbtainfo = data;
	 	});
	 });


$("h1").click(function() {
    document.write(mbtainfo);
  });
  
});


//https://api-v3.mbta.com/routes
//curl -X GET "https://api-v3.mbta.com/trips?sort=block_id&filter%5Bdirection_id%5D=0" -H "accept: application/vnd.api+json"