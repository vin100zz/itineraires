app.service('JourneysLayer', function (Voyages, Coordonnees) {

  this.get = function (overlayColor) {
  
    // compute journeys
    var journeys = [];
    
    Voyages.get().forEach(function (journey, index) {
      var points = [];
      journey.villes.forEach(function (city) {
        var point = Coordonnees.get(city);
        if (point) {
          points.push(point);
        }
      });
      journeys.push({name: journey.nom, points: points});
    });
    
    // compute layer
    var source = new ol.source.Vector({});
    
    journeys.forEach(function (journey) {
      var feature = new ol.Feature({
        geometry: new ol.geom.LineString(journey.points),
        journeyName: journey.name
      });
      source.addFeature(feature);
    });

    var layer = new ol.layer.Vector({
      source: source,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({color: overlayColor, width: 5})
      })
    });
    
    return layer;
  }
  
});
