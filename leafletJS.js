var map = L.map('map').setView([59.437, 24.7536], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

omnivore.kml('Map.kml')
    .on('ready', function() {
        map.fitBounds(this.getBounds());
    })
    .eachLayer(function(layer) {
        layer.bindPopup(layer.feature.properties.name || '');
    })
    .addTo(map);