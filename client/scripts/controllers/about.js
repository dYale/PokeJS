'use strict';

angular.module('pokeApp')
.controller('PokeCtrl', ['$scope','$http' , '$timeout','$q', 'pokemonActions', function($scope, $http, $timeout,$q, pokemonActions) {



  $scope.event = "alert alert-warning alert-dismissible";

  var getDeets = function(arr){
    var deets = [];
    arr.forEach(function(value, i){
     pokemonActions.getMoveDeets(value,function(x){ deets.push(x)})
    })
    return deets;
  };

  var render = function(player){
    var pokemon = Math.floor(Math.random(0,1)*200)
    $scope[player] = {};
    $http.get('http://pokeapi.co/api/v1/pokemon/' + pokemon)
    .success(function(data, status, headers, config) {
      $scope[player].max = data.hp;
      $scope[player].dynamic = data.hp;
      $scope[player].name   = data.name;
      $scope[player].isCollapsed = true;
      $scope[player].type = data.types[1];
      $scope[player].attack = 'Attack: ' + data.attack;
      $scope[player].defense = 'Defense: ' + data.defense;
      $scope[player].descriptions = data.abilities;
      $scope[player].moves = getDeets(pokemonActions.grabFour(data.moves))
      $scope[player].moves.forEach(function(x){ x.descriptions = '<br>' + x.descriptions})
      $http.get('http://pokeapi.co/' + data.sprites[0].resource_uri)
    .success(function(data, status, headers, config) {
      $scope[player].pokemon = 'http://pokeapi.co/' + data.image;
    })})
    .error(function(data, status, headers, config) {
      $scope.pokemon = 'No pokemon here!';
    });
  };

  render('away')
  render('home')
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
        callback(data);
      })}

  }
})

