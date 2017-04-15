app.service('CitiesLayer', function (Coordonnees, Month) {

  this.get = function (journeys, overlayColor) {
  
    // compute cities
    var citiesWithJourneys = [];
    
    journeys.forEach(function (voyage, index) {
      voyage.villes.forEach(function (city) {
        var cityWithJourneys = citiesWithJourneys.find(function (cityWithJourneys) {
          return cityWithJourneys.city === city;
        });
        if (!cityWithJourneys) {
          citiesWithJourneys.push({city: city, journeys: [voyage]});
        } else if (cityWithJourneys.journeys.indexOf(voyage) === -1) {
          cityWithJourneys.journeys.push(voyage);
        }
      });
    });
    
    // compute layer
    var source = new ol.source.Vector({});
    
    citiesWithJourneys.forEach(function (cityWithJourneys) {
      var coordonnees = Coordonnees.get(cityWithJourneys.city);
      if (coordonnees) {
      
        var tooltipContent = '<div class="tooltip-title">' + cityWithJourneys.city + '</div>';
        var tooltipJourneys = cityWithJourneys.journeys.map(function (journey) {
          return Month.getLabel(journey.mois) + ' ' + journey.annee;
        });
        tooltipContent += '<ul class="tooltip-list"><li>' + tooltipJourneys.join('</li><li>') + '</li></ul>';
      
        var feature = new ol.Feature({
          geometry: new ol.geom.Circle(coordonnees, 80000),
          tooltip: tooltipContent
        });
        source.addFeature(feature);
      }
    });

    var layer = new ol.layer.Vector({
      source: source,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({color: '#000', width: 1}),
        fill: new ol.style.Fill({color: overlayColor})
      })
    });
    
    return layer;
  }
  
});
