const socket=io();


if(navigator.geolocation){
    navigator.geolocation.watchPosition(position=>{
        const {latitude,longitude}=position.coords;
        socket.emit('sendLocation',{latitude,longitude});
    },
           (error)=>{ 
            console.log(error);
              },
              {
                enableHighAccuracy:true,
                timeout:5000,
                maximumAge:0
                }
)
}

const map = L.map('map').setView([0, 0], 13);

// Add a tile layer to the map (OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker to the map
const marker={};

socket.on('receiveLocation',function(data){
    const {latitude,longitude,socketId}=data;
   map.setView([latitude,longitude]);
    if(marker[socketId]){
        marker[socketId].setLatLng([latitude,longitude]);
    }else{
        marker[socketId]=L.marker([latitude,longitude]).addTo(map);
    }
})

// Add a circle to the map
 const circle = L.circle([0, 0], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 50
    }).addTo(map);

    socket.on('receiveLocation', function(data) {
        const { latitude, longitude } = data;
        circle.setLatLng([latitude, longitude]);
    });
      socket.on('user-disconnect',function(data){
        const {socketId}=data;
        if(marker[socketId]){
            map.removeLayer(marker[socketId]);
            delete marker[socketId];
        }

    }
    )