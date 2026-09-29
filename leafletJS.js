const map = L.map('map').setView([59.437, 24.79], 12);

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri'
});
osm.addTo(map);

L.control.layers({ 'Kaart': osm, 'Satelliit': satellite }).addTo(map);

L.control.scale({ imperial: false }).addTo(map);

omnivore.kml('Map.kml')
    .on('ready', function () {
        this.eachLayer(function (layer) {
            const type = layer.feature.geometry.type;
            const name = layer.feature.properties.name || '';

            if (type === 'Polygon') {
                layer.setStyle({ color: '#f9a825', fillOpacity: 0.3 });
            }

            if (type === 'LineString') {
                layer.setStyle(name === 'jalgsi'
                    ? { color: '#37474f', weight: 4, dashArray: '2 9' }
                    : { color: '#1976d2', weight: 5 });
            }

            layer.bindPopup(name);
        });

        map.fitBounds(this.getBounds(), { padding: [40, 40] });
    })
    .addTo(map);
