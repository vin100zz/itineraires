app.service('BackgroundMaps', function (Voyages) {

  this.get = function () {
  
    var maps = [];
        
    // aquarelle
    maps.push({
      name: 'Aquarelle',
      overlayColor: '#f00',
      all: new ol.layer.Tile({
        source: new ol.source.Stamen({
          layer: 'watercolor'
        })
      })
    });
    
    // visited countries
    var countriesSource = new ol.source.Vector({
      url: 'data/countries.geojson?ts=' + Date.now(),
      format: new ol.format.GeoJSON()
    });

    var visitedCountriesMap = {
      name: 'Pays visités',
      overlayColor: '#FF0000',
      PM: getVisitedCountriesLayer('PM'),
      V: getVisitedCountriesLayer('V')
    };



    var initialized = false;
    countriesSource.on('change', function (event) {
      if (!initialized && event.target.getState() === 'ready') {
        initialized = true; // avoid infinite loops
        visitedCountriesMap.V = getVisitedCountriesLayer('V');
        visitedCountriesMap.PM = getVisitedCountriesLayer('PM');
      }    
    });

    function getVisitedCountriesLayer (traveller) {
      var visitedCountries = [];        
      Voyages.getWithFilters(-1, traveller).forEach(function (voyage) {
        voyage.pays.forEach(function (pays) {
          if (!visitedCountries.includes(pays)) {
            visitedCountries.push(pays);
          }
        });
      });      

      return new ol.layer.Vector({
        source: countriesSource,
        style: function (feature, resolution) {
          var fillColor = (feature.get('name') === 'France' ? '#4285F4' : (visitedCountries.includes(feature.get('name')) ? '#E8827A' : '#FFDA96'));
          return [new ol.style.Style({
            fill: new ol.style.Fill({color: fillColor}),
            stroke: new ol.style.Stroke({color: '#ccc', width: 1}),
          })];
        }
      });
    }
    
    maps.push(visitedCountriesMap);
    
    // satellite
    /*maps.push({
      name: 'Satellite',
      overlayColor: '#FFD800',
      layer: new ol.layer.Tile({
        source:  new ol.source.OSM()
      })
    });*/

    // geopolitical
    maps.push({
      name: 'Géopolitique',
      overlayColor: '#333',
      all: new ol.layer.Tile({
        source: new ol.source.TileJSON({
          url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp',
          crossOrigin: ''
        })
      })
    });
    
    return maps;
    
  };

});