'use strict';

angular.module('pokeApp')
.controller('PokeCtrl', ['$scope','$http' , function($scope,$http) {
	var pokemon = Math.floor(Math.random(0,1)*200)
	console.log(pokemon)
	$http.get('http://pokeapi.co/api/v1/pokemon/' + pokemon).
  success(function(data, status, headers, config) {
  	$http.get('http://pokeapi.co/' + data.sprites[0].resource_uri).
  success(function(data, status, headers, config) {
  	$scope.pokemon = 'http://pokeapi.co/' + data.image;
  })})
  .error(function(data, status, headers, config) {
  	$scope.pokemon = 'No pokemon here!';
  });
}]);