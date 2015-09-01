app.service('JourneysLayer', function (Coordonnees) {

  this.get = function (journeys, overlayColor) {
  
    // compute journeys
    var journeysWithPoints = [];
    
    journeys.forEach(function (journey) {
      var points = [];
      journey.villes.forEach(function (city) {
        var point = Coordonnees.get(city);
        if (point) {
          points.push(point);
        }
      });
      journeysWithPoints.push({name: journey.nom, points: points});
    });
    
    // compute layer
    var source = new ol.source.Vector({});
    
    journeysWithPoints.forEach(function (journey) {
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
