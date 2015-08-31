app.factory('Voyages', function ($resource) {
  return $resource('data/voyages.json', {}, {
    get: {method: 'GET', isArray: true, cache: true}
  });
});
  
