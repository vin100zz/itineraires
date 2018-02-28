app.service('Voyages', function ($http) {
  
  var voyages = [];
  
  this.init = $http.get('data/voyages.json')
  .success(function (data, status, headers, config) {
    voyages = data;
  });

  this.get = function () {
    return voyages;
  };

  this.getWithFilters = function (index, traveller) {
    var filteredVoyages = index === -1 ? voyages : [voyages[index]];
    return filteredVoyages.filter(voyage => voyage.voyageurs.includes(traveller));
  };

});
  

