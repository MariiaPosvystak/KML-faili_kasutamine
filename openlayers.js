var kmlSource = new ol.source.Vector({
    url: 'Map.kml',
    format: new ol.format.KML({ extractStyles: false })
});

var pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({ color: '#e53935' }),
        stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
    })
});

var lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: '#1976d2', width: 4 })
});

var polygonStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({ color: '#fbc02d', width: 2 }),
    fill: new ol.style.Fill({ color: 'rgba(251, 192, 45, 0.3)' })
});

var kmlLayer = new ol.layer.Vector({
    source: kmlSource,
    style: function (feature) {
        var type = feature.getGeometry().getType();
        if (type === 'Point' || type === 'MultiPoint') return pointStyle;
        if (type === 'LineString' || type === 'MultiLineString') return lineStyle;
        if (type === 'Polygon' || type === 'MultiPolygon') return polygonStyle;
        return null;
    }
});

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({ source: new ol.source.OSM() }),
        kmlLayer
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([24.7536, 59.437]),
        zoom: 12
    })
});

kmlSource.once('featuresloadend', function () {
    var extent = kmlSource.getExtent();
    if (!ol.extent.isEmpty(extent)) {
        map.getView().fit(extent, { padding: [50, 50, 50, 50] });
    }
});