const BLUE = '#1976d2';
const AMBER = '#f9a825';
const styles = {
    point: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({ color: BLUE }),
            stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 })
        })
    }),
    bus: new ol.style.Style({
        stroke: new ol.style.Stroke({ color: BLUE, width: 5 })
    }),
    walk: new ol.style.Style({
        stroke: new ol.style.Stroke({ color: '#37474f', width: 4, lineDash: [2, 10], lineCap: 'round' })
    }),
    area: new ol.style.Style({
        stroke: new ol.style.Stroke({ color: AMBER, width: 3 }),
        fill: new ol.style.Fill({ color: 'rgba(249, 168, 37, 0.3)' })
    })
};

function styleFor(feature) {
    const type = feature.getGeometry().getType();
    if (type === 'Point') return styles.point;
    if (type === 'Polygon') return styles.area;
    return feature.get('name') === 'jalgsi' ? styles.walk : styles.bus;
}

const kmlSource = new ol.source.Vector({
    url: 'Map.kml',
    format: new ol.format.KML({ extractStyles: false })
});

const popupEl = document.getElementById('popup');
const popup = new ol.Overlay({ element: popupEl, positioning: 'bottom-left', autoPan: true });
popupEl.hidden = false;

const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({ source: new ol.source.OSM() }),
        new ol.layer.Vector({ source: kmlSource, style: styleFor })
    ],
    overlays: [popup],
    controls: ol.control.defaults.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.FullScreen()
    ]),
    view: new ol.View({ center: ol.proj.fromLonLat([24.79, 59.437]), zoom: 12 })
});

map.on('singleclick', function (event) {
    const feature = map.forEachFeatureAtPixel(event.pixel, function (f) { return f; });
    if (feature) {
        document.getElementById('popup-name').textContent = feature.get('name') || '';
        popup.setPosition(event.coordinate);
    } else {
        popup.setPosition(undefined);
    }
});

document.getElementById('popup-close').addEventListener('click', function () {
    popup.setPosition(undefined);
});

kmlSource.once('featuresloadend', function () {
    map.getView().fit(kmlSource.getExtent(), { padding: [60, 60, 60, 60] });
});
