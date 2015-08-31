app.service('CitiesLayer', function (Voyages, Coordonnees) {

  this.get = function () {
  
    // compute cities
    var cities = [];
    
    Voyages.get().forEach(function (voyage, index) {
      voyage.villes.forEach(function (city) {
        if (cities.indexOf(city) === -1) {
          cities.push(city);
        }
      });
    });
    
    // compute layer
    var source = new ol.source.Vector({});
    
    cities.forEach(function (city) {
      var coordonnees = Coordonnees.get(city);
      if (coordonnees) {
        var feature = new ol.Feature({
          geometry: new ol.geom.Circle(coordonnees, 50000),
          cityName: city
        });
        source.addFeature(feature);
      }
    });

    var layer = new ol.layer.Vector({
      source: source,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({color: '#000', width: 1}),
        fill: new ol.style.Fill({color: '#f00'})
      })
    });
    
    return layer;
  }
  
});
