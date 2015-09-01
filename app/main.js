var app = angular.module('itineraires', ['ngResource', 'ngRoute', 'ngSanitize', 'ui.bootstrap']);

// routing
app.config(['$routeProvider', function ($routeProvider) {

  var dependencies = {
    'coordonnees': function (Coordonnees) {
      return Coordonnees.init;
    },
    'voyages': function (Voyages) {
      return Voyages.init;
    }
  };

  $routeProvider
  .when('/', {templateUrl: 'app/modules/map.html', controller: 'MapCtrl', resolve: dependencies})
  .otherwise({redirectTo: '/'});
}]);

// controller
app.controller('MainCtrl', function ($scope) {

});

// filter
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
