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
        zoom: 2.8
      })
    });

    // travellers
    $scope.travellers = ['PM', 'V'];
    $scope.travellerIndex = 0;

    $scope.getTraveller = function () {
      return $scope.travellers[$scope.travellerIndex];
    }

    $scope.setTraveller = function (index) {
      $scope.travellerIndex = index;
      $scope.journeys = getFilteredVoyages();
      refreshLayers();
      $scope.setBackgroundMap($scope.backgroundIndex);
    };

    // journeys
    $scope.journeyIndex = -1;
    $scope.journeys = getFilteredVoyages();
    
    $scope.setJourney = function (index) {
      $scope.journeyIndex = index === -1 ? -1 : $scope.journeys.length-index-1;
      refreshLayers();
    };

    // background
    $scope.backgroundMaps = BackgroundMaps.get();
    $scope.backgroundIndex = 0;

    map.addLayer($scope.backgroundMaps[0].all);
    
    $scope.setBackgroundMap = function (index) {
      map.getLayers().clear();
      $scope.backgroundIndex = index;
      var newLayer = $scope.backgroundMaps[index][$scope.getTraveller()] || $scope.backgroundMaps[index].all;
      if (newLayer) {map.getLayers().push(newLayer);
      refreshLayers();
    }
    };
    
    // masks
    $scope.masks = [
      {name: 'Trajets', show: true, layerManager: JourneysLayer, layer: null},
      {name: 'Villes', show: true, layerManager: CitiesLayer, layer: null}
    ];
    
    function refreshLayers () {
      $scope.masks.forEach(function (mask) {
        map.removeLayer(mask.layer);
        var journeys = getFilteredVoyages();
        var overlayColor = $scope.backgroundMaps[$scope.backgroundIndex].overlayColor;
        mask.layer = mask.layerManager.get(journeys, overlayColor);
        if (mask.show) {
          map.addLayer(mask.layer);
        }
      });
    }
    
    refreshLayers();
        
    $scope.toggleMask = function (index) {
      var mask = $scope.masks[index];
      mask.show = !mask.show;
      if (mask.show) {
        map.getLayers().insertAt(index+1, mask.layer); // +1 for background
      } else {
        map.removeLayer(mask.layer);
      }
    };

    function getFilteredVoyages () {
      return Voyages.getWithFilters($scope.journeyIndex, $scope.getTraveller());
    }
    
    // tooltip
    var tooltip = $('#tooltip');
    tooltip.tooltip({
      animation: false,
      trigger: 'manual'
    });
    
    function displayFeatureInfo (pixel) {    
      tooltip.css({
        left: pixel[0] + 'px',
        top: (pixel[1] - 5) + 'px'
      });
      
      var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        return feature;
      });
      
      var tooltipContent = feature ? feature.get('tooltip') : null;
      
      if (tooltipContent) {      
        tooltip.tooltip('hide')
          .attr('data-original-title', tooltipContent)
          .tooltip('fixTitle')
          .tooltip('show'); 
      } else {
        tooltip.tooltip('hide');
      }
    };
    
    $(map.getViewport()).on('mousemove', function(evt) {
      displayFeatureInfo(map.getEventPixel(evt.originalEvent));
    });
    
  });
  
}) ();