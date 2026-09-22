import Map from 'https://cdn.jsdelivr.net/npm/ol@10.10.0/Map.js';
import View from 'https://cdn.jsdelivr.net/npm/ol@10.10.0/View.js';

import KML from 'https://cdn.jsdelivr.net/npm/ol@10.10.0/format/KML.js';

import TileLayer from 'https://cdn.jsdelivr.net/npm/ol@10.10.0/layer/Tile.js';
import VectorLayer from 'https://cdn.jsdelivr.net/npm/ol@10.10.0/layer/Vector.js';

import OSM from 'https://cdn.jsdelivr.net/npm/ol@10.10.0/source/OSM.js';
import VectorSource from 'https://cdn.jsdelivr.net/npm/ol@10.10.0/source/Vector.js';


// Aluskaart
const raster = new TileLayer({
    source: new OSM()
});


// KML-andmed
const vector = new VectorLayer({
    source: new VectorSource({
        url: 'Map.kml',
        format: new KML()
    })
});


// Kaart
const map = new Map({
    target: 'map',

    layers: [
        raster,
        vector
    ],

    view: new View({
        center: [0, 0],
        zoom: 2
    })
});


// Objekti info
function displayFeatureInfo(pixel) {

    const features = [];

    map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
    });

    const info = document.getElementById('info');

    if (features.length > 0) {

        const names = [];

        features.forEach(function (feature) {

            const name = feature.get('name');

            if (name) {
                names.push(name);
            }

        });

        info.innerHTML = names.join(', ') || '(unknown)';

        map.getTargetElement().style.cursor = 'pointer';

    } else {

        info.innerHTML = 'Vali kaardil objekt';

        map.getTargetElement().style.cursor = '';
    }
}


// Hiire liikumine
map.on('pointermove', function (event) {

    if (event.dragging) {
        return;
    }

    displayFeatureInfo(event.pixel);
});


// Klikk
map.on('click', function (event) {

    displayFeatureInfo(event.pixel);
});
