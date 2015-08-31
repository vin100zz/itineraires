app.service('Voyages', function ($http) {
  
  var voyages = null;
  
  this.init = $http.get('data/voyages.json')
  .success(function (data, status, headers, config) {
    voyages = data.reverse();
  });
  
  this.get = function () {
    return voyages;
  };

});
  

