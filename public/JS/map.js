if(coordinates.length==0){
    coordinates=[77.2088,28.6139];
}

var map = L.map('map');
        map.setView(coordinates, 13);
        console.log(coordinates)
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        navigator.geolocation.watchPosition(success,error);

        let marker,circle,zoomed;

        function success(pos){

            const lat = coordinates[1];
            const lng = coordinates[0];
            const accuracy = pos.coords.accuracy;

            if(marker){
                map.removeLayer(marker);
                map.removeLayer(circle);
            }

            marker = L.marker([lat,lng]).addTo(map);
            circle = L.circle([lat,lng], {radius:accuracy} ).addTo(map);

            if(!zoomed){
                zoomed = map.fitBounds(circle.getBounds());
            }

        }

        function error(err){
            if(err.code === 1){
                alert("Please allow your geolocation access");
            }else{
                alert("cannot get current location");
            }
        }