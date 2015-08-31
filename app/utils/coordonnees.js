app.factory('Coordonnees', function ($resource) {
  return $resource('data/coordonnees.json', {}, {
    get: {method: 'GET', isArray: false, cache: true}
  });
});
  
