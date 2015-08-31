(function () {
  
  'use strict';
  
  // controller
  app.controller('MapCtrl', function($scope, Voyages, Coordonnees, Month, BackgroundMaps, JourneysLayer, CitiesLayer) {
    $scope.Month = Month;    
  
    // map
    var map = new ol.Map({
      target: 'map',
      layers: [],
      view: new ol.View({
        center: ol.proj.fromLonLat([5.38107, 43.29695]),
        zoom: 3
      })
    });
       
    // data
    $scope.voyages = Voyages.get();

    // background
    $scope.backgroundMaps = BackgroundMaps.get($scope.voyages);
    $scope.backgroundIndex = 0;

    map.addLayer($scope.backgroundMaps[0].layer);
    
    $scope.setBackgroundMap = function (index) {
      map.removeLayer($scope.backgroundMaps[$scope.backgroundIndex].layer);
      $scope.backgroundIndex = index;
      map.getLayers().insertAt(0, $scope.backgroundMaps[index].layer);
    };
    
    // masks
    $scope.masks = [
      {name: 'Trajets', show: true, layer: JourneysLayer.get()},
      {name: 'Villes', show: true, layer: CitiesLayer.get()}
    ];
    
    $scope.masks.forEach(function (mask) {
      if (mask.show) {
        map.addLayer(mask.layer);
      }
    });
        
    $scope.toggleMask = function (index) {
      var mask = $scope.masks[index];
      mask.show = !mask.show;
      if (mask.show) {
        map.getLayers().insertAt(index+1, mask.layer); // +1 for background
      } else {
        map.removeLayer(mask.layer);
      }      
    };

    
    // info
    $scope.info = {
      trajets: {show: true, type: 'layer', list: []},
      cityMarkers: {show: true, type: 'layer', list: []},
      cityNames: {show: false, type: 'overlay', list: []},
    };
    
    /*computeInfo();
    initInfo();*/
    
    $scope.toggleInfo = function (layer) {
      $scope.info[layer].show = !$scope.info[layer].show;
      var action = ($scope.info[layer].show ? 'add' : 'remove') + ($scope.info[layer].type === 'layer' ? 'Layer' : 'Overlay');
      $scope.info[layer].list.forEach(function (item) {
        map[action](item);
      });
    };
    

    
    // map

    
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
      var trajets = [];
      var cities = [];
      
      $scope.voyages.forEach(function (voyage, index) {
        var color = '#f00'; //colors[index%colors.length];
        var points = [];
        
        voyage.villes.forEach(function (ville) {
          var coordCity = Coordonnees.get(ville);
          if (coordCity) {
            points.push(coordCity);
            
            //addCity(coordCity, ville, color);
            cities.push({name: ville, coord: coordCity});
          }
        });
        
        //addTrajet(points, color);
        trajets.push({points: points, color: color});
      });
      
      addCities(cities);
    }
    
    // city
    var alreadyRenderedCities = [];
    
    
    function addCities(cities) {
      var sourceVector = new ol.source.Vector({});
      
      /*cities.forEach(function (city) {
        var feature = new ol.Feature({
          geometry: new ol.geom.Circle(city.coord, 50000),
          cityName: city.name
        });
        sourceVector.addFeature(feature);
      });*/
      
      var layer = new ol.layer.Vector({
        source: sourceVector,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({color: '#f00', width: 5}),
          fill: new ol.style.Fill({color: '#f00'})
        })
      });
      
      $scope.info.cityMarkers.list.push(layer);
    }
     
    function addCity(coord, name, color) {
    
      if (alreadyRenderedCities.indexOf(name) === -1) {
        // marker
        /*var markerElement = document.createElement("div");
        markerElement.classList.add('city-marker');
        markerElement.style.backgroundColor = color;

        var markerOverlay = new ol.Overlay({
          position: coord,
          positioning: 'center-center',
          element: markerElement
        });
        $scope.info.cityMarkers.list.push(markerOverlay);*/

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
    
    var tooltip = $('#tooltip');
    tooltip.tooltip({
      animation: false,
      trigger: 'manual'
    });
    
    function displayFeatureInfo (pixel) {
      tooltip.css({
        left: pixel[0] + 'px',
        top: (pixel[1] - 15) + 'px'
      });
      var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        return feature;
      });
      
      var label = feature ? (feature.get('cityName') || feature.get('journeyName')) : null;
      
      if (label) {
        tooltip.tooltip('hide')
            .attr('data-original-title', label)
            .tooltip('fixTitle')
            .tooltip('show');
            
            console.log(tooltip);
      } else {
        tooltip.tooltip('hide');
      }
    };
    
    $(map.getViewport()).on('mousemove', function(evt) {
      displayFeatureInfo(map.getEventPixel(evt.originalEvent));
    });
    
  });
  
}) ();