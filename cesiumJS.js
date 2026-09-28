const viewer = new Cesium.Viewer('map', {
    baseLayerPicker: false,
    geocoder: false,
    timeline: false,
    animation: false,
    imageryProvider: false,
    terrainProvider: new Cesium.EllipsoidTerrainProvider()
});

// Cesiumi enda kaasasolev pinnakate - laetakse samast CDN-paketist (mitte
// välisest serverist), seega töötab alati ega vaja ion-tokenit.
Cesium.TileMapServiceImageryProvider.fromUrl(
    Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
).then(function (imageryProvider) {
    viewer.imageryLayers.addImageryProvider(imageryProvider);
});

// CARTO tänavakaart selle peale - tasuta, tokenit pole vaja, toetab CORS-i.
viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        maximumLevel: 20,
        credit: '© OpenStreetMap contributors © CARTO'
    })
);

Cesium.KmlDataSource.load('Map.kml', {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas
}).then(function (dataSource) {
    viewer.dataSources.add(dataSource);
    viewer.flyTo(dataSource);
});
