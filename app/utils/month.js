app.service('Month', function() {

  var months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
  
  this.getLabel = function (index) {
    return months[index-1];
  };

});