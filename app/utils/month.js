app.service('Month', function() {

  var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  
  this.getLabel = function (index) {
    return months[index-1];
  };

});