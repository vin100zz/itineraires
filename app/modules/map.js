(function () {
  
  'use strict';
  
  // controller
  app.controller('MapCtrl', function($scope, Voyages, Coordonnees) {
  
    $scope.mois = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
  
    // map
    var map = null;
    drawMap();
    
    // info
    $scope.info = {
      trajets: {show: true, type: 'layer', list: []},
      cityMarkers: {show: true, type: 'overlay', list: []},
      cityNames: {show: false, type: 'overlay', list: []},
    };
    
    $scope.toggleInfo = function (layer) {
      $scope.info[layer].show = !$scope.info[layer].show;
      var action = ($scope.info[layer].show ? 'add' : 'remove') + ($scope.info[layer].type === 'layer' ? 'Layer' : 'Overlay');
      $scope.info[layer].list.forEach(function (item) {
        map[action](item);
      });
    };
    
    // map type
    function initMapType() {
    
      var countriesSource = new ol.source.Vector({
        url: 'data/countries.geojson',
        format: new ol.format.GeoJSON()
      });
      
      var initialized = false;
      
      var key = countriesSource.on('change', function (event) {
        if (!initialized && event.target.getState() === 'ready') {
          initialized = true; // avoid infinite loops
          
          var visitedCountries = [];
          $scope.voyages.forEach(function (voyage) {
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
      
      $scope.mapType = {
        satellite: {
          show: false,
          layer: new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'})
          })
        },
        administrative: {
          show: false,
          layer: new ol.layer.Tile({
            source: new ol.source.TileJSON({
              url: 'http://api.tiles.mapbox.com/v3/mapbox.geography-class.jsonp',
              crossOrigin: ''
            })
          })
        },
        visited : {
          show: true,
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
      };      
    
      for (var key in $scope.mapType) {
        if ($scope.mapType.hasOwnProperty(key) && $scope.mapType[key].show) {
          map.addLayer($scope.mapType[key].layer);
        }
      }
    }
    
    $scope.setMapType = function (newType) {
      for (var key in $scope.mapType) {
        if ($scope.mapType.hasOwnProperty(key)) {
          var type = $scope.mapType[key];
          if ($scope.mapType[key].show) {
            type.show = false;
            map.removeLayer(type.layer);
          }
          if (key === newType) {
            type.show = true;
            map.getLayers().insertAt(0, type.layer);
          }
        }
      }
    }    
    
    // data
    $scope.voyages = null;
    var coordonnees = Coordonnees.get(null, function () {
      Voyages.get(null, function (voyages) {
        $scope.voyages = voyages.reverse();
        initMapType();
        computeInfo();
        initInfo();
      });
    });
    
    // map
    function drawMap () {    
      map = new ol.Map({
        target: 'map',
        layers: [],
        view: new ol.View({
          center: ol.proj.fromLonLat([5.38107, 43.29695]),
          zoom: 3
        })
      });
    }
    
    function initInfo() {
      for (var key in $scope.info) {
        if ($scope.info.hasOwnProperty(key) && $scope.info[key].show) {
          var info = $scope.info[key];
          var action = info.type == 'layer' ? 'addLayer' : 'addOverlay';
          info.list.forEach(function (item) {
            map[action](item);
          });
        }
      }
    }
    
    // layers
    var colors = [
      'rgba(255, 0, 0, 0.75)',
      'rgba(0, 255, 0, 0.75)',
      'rgba(0, 0, 255, 0.75)',
      'rgba(255, 255, 0, 0.75)',
      'rgba(0, 255, 255, 0.75)',
      'rgba(255, 0, 255, 0.75)',
      'rgba(180, 180, 180, 0.75)',
      'rgba(255, 110, 0, 0.75)',
      'rgba(255, 0, 110, 0.75)',
      'rgba(178, 0, 255, 0.75)',
      'rgba(0, 74, 127, 0.75)',
      'rgba(0, 127, 127, 0.75)',
      'rgba(0, 127, 70, 0.75)',
      'rgba(0, 127, 106, 0.75)',
      'rgba(127, 51, 0, 0.75)',
      'rgba(127, 0, 0, 0.75)',
      'rgba(100, 100, 100, 0.75)'
    ];
    
    function computeInfo() {
      $scope.voyages.forEach(function (voyage, index) {
        var color = colors[index%colors.length];
        var points = [];
        
        voyage.villes.forEach(function (ville) {
          var coordCity = coordonnees[ville];
          if (!coordCity) {
            console.error('Coordonnées manquantes pour ' + ville);
          } else {
            coordCity = ol.proj.fromLonLat([coordCity.lng, coordCity.lat]);
            points.push(coordCity);
            
            addCity(coordCity, ville, color);
          }
        });
        
        addTrajet(points, color);
      });
    }
    
    // trajet   
    function addTrajet(points, color) {
      var featureLine = new ol.Feature({
        geometry: new ol.geom.LineString(points)
      });
        
      var vectorLine = new ol.source.Vector({});
      vectorLine.addFeature(featureLine);
      
      var layer = new ol.layer.Vector({
        source: vectorLine,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({color: color, width: 5})
        })
      });
      
      $scope.info.trajets.list.push(layer);
    }
    
    // city
    var alreadyRenderedCities = [];
     
    function addCity(coord, name, color) {
    
      if (alreadyRenderedCities.indexOf(name) === -1) {
        // marker
        var markerElement = document.createElement("div");
        markerElement.classList.add('city-marker');
        markerElement.style.backgroundColor = color;

        var markerOverlay = new ol.Overlay({
          position: coord,
          positioning: 'center-center',
          element: markerElement
        });
        $scope.info.cityMarkers.list.push(markerOverlay);

        // name
        var nameElement = document.createElement("div");
        nameElement.classList.add('city-name');
        nameElement.innerHTML = name;
        
        var nameOverlay = new ol.Overlay({
          position: coord,
          positioning: 'center-left',
          element: nameElement
        });
        $scope.info.cityNames.list.push(nameOverlay);
        
        alreadyRenderedCities.push(name);
      }
    }
    
  });
  
}) ();