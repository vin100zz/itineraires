app.service('BackgroundMaps', function() {

  this.get = function (voyages) {
  
    var maps = [];
    
    // visited countries
    var countriesSource = new ol.source.Vector({
      url: 'data/countries.geojson',
      format: new ol.format.GeoJSON()
    });
    
    var initialized = false;
    
    countriesSource.on('change', function (event) {
      if (!initialized && event.target.getState() === 'ready') {
        initialized = true; // avoid infinite loops
        var visitedCountries = [];
        
        voyages.forEach(function (voyage) {
          voyage.pays.forEach(function (pays) {
            if (visitedCountries.indexOf(pays) === -1) {
              visitedCountries.push(pays);
            }
          });
        });
        
        countriesSource.forEachFeature(function (feature) {
          if (visitedCountries.indexOf(feature.get('name')) !== -1) {
            feature.set('visited', true);
          }
        }); 
      }    
    });
    
    maps.push({
        name: 'Pays visités',
        layer: new ol.layer.Vector({
          source: countriesSource,
          style: function (feature, resolution) {
            var fillColor = (feature.get('name') === 'France' ? '#ddd' : (feature.get('visited') ? '#fff0bb' : '#f3f3f3'));
            return [new ol.style.Style({
              fill: new ol.style.Fill({color: fillColor}),
              stroke: new ol.style.Stroke({color: '#ccc', width: 1}),
            })];
          }
        })
      }
    );
    
    // satellite
    maps.push({
      name: 'Satellite',
      layer: new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'sat'})
      })
    });

    // geopolitical
    maps.push({
      name: 'Géopolitique',
      layer: new ol.layer.Tile({
        source: new ol.source.TileJSON({
          url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp',
          crossOrigin: ''
        })
      })
    });
    
    return maps;
    
  };

});