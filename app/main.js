var app = angular.module('itineraires', ['ngResource', 'ngRoute', 'ngSanitize', 'ui.bootstrap']);

// routing
app.config(['$routeProvider', function ($routeProvider) {

  $routeProvider
  .when('/', {templateUrl: 'app/modules/map.html', controller: 'MapCtrl'})
  .otherwise({redirectTo: '/'});
}]);

// controller
app.controller('MainCtrl', function ($scope) {

});
