const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        position => {
            const { latitude, longitude } = position.coords;
            console.log(`Sending location: ${latitude}, ${longitude}`); 
            socket.emit('sendLocation', { latitude, longitude });
        },
        error => {
            console.log(`Geolocation error: ${error.message}`);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
} else {
    console.log('Geolocation is not supported by this browser.');
}

const map = L.map('map').setView([0, 0], 2); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const personIcon = L.divIcon({
    html: '👤',
    className: 'custom-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const markers = {};

socket.on('receiveLocation', function(data) {
    const { latitude, longitude, socketId } = data;
    console.log(`Received location: ${latitude}, ${longitude} from ${socketId}`); 
    map.setView([latitude, longitude], 13); 
    if (markers[socketId]) {
        markers[socketId].setLatLng([latitude, longitude]);
    } else {
        markers[socketId] = L.marker([latitude, longitude], { icon: personIcon }).addTo(map);
    }
});

const circle = L.circle([0, 0], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.4,
    radius: 500
}).addTo(map);

socket.on('receiveLocation', function(data) {
    const { latitude, longitude } = data;
    circle.setLatLng([latitude, longitude]);
});