app.service('Coordonnees', function ($http) {
  
  var coordonnees = null;
  
  this.init = $http.get('data/coordonnees.json')
  .success(function (data, status, headers, config) {
    coordonnees = data;
  });
  
  this.get = function (city) {
    var coordCity = coordonnees[city];
    if (!coordCity) {
      console.error('Coordonnées manquantes pour ' + city);
      return null;
    }
    return ol.proj.fromLonLat([coordCity.lng, coordCity.lat]);
  };

});
  
