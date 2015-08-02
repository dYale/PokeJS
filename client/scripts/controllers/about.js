'use strict';

angular.module('pokeApp')
.controller('PokeCtrl', ['$scope','$http' , '$timeout','$q', 'pokemonActions', function($scope, $http, $timeout,$q, pokemonActions) {
  var pokemon = Math.floor(Math.random(0,1)*200)




  var getDeets = function(arr){
    var deets = [];
    arr.forEach(function(value, i){
     pokemonActions.getMoveDeets(value,function(x){ deets.push(x)})
    })
    return deets;
  };



  $http.get('http://pokeapi.co/api/v1/pokemon/' + pokemon)
  .success(function(data, status, headers, config) {
    $scope.name   = data.name;

    $scope.health = 'Health: ' + data.hp;
    $scope.attack = 'Attack: ' + data.attack;
    $scope.defense = 'Defense: ' + data.defense;
    $scope.descriptions = data.abilities;
    $scope.moves = getDeets(pokemonActions.grabFour(data.moves))
    $http.get('http://pokeapi.co/' + data.sprites[0].resource_uri)
  .success(function(data, status, headers, config) {
    $scope.pokemon = 'http://pokeapi.co/' + data.image;
  })})
  .error(function(data, status, headers, config) {
    $scope.pokemon = 'No pokemon here!';
  });
}])


.factory('pokemonActions', function($http, $q){

  return { 

    grabFour: function(array){
      var arr = [];
      for(var i = 0; i < 4; i++){
        var index = Math.random(0,1) * array.length;
          arr.push(array[i])
      }
      return arr;
    },

    getMoveDeets: function(value,callback){
      $http.get('http://pokeapi.co/' + value.resource_uri)
      .success(function(data) {
        console.log(data)
        callback(data);
      })}

  }
})

