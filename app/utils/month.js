app.service('Month', function() {

  var months = ['janv', 'f�vr', 'mars', 'avr', 'mai', 'juin', 'juil', 'ao�t', 'sept', 'oct', 'nov', 'd�c'];
  
  this.getLabel = function (index) {
    return months[index-1];
  };

});