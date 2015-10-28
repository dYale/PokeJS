'use strict';

angular.module('pokeApp')
.controller('PokeCtrl', ['$scope','$http' , '$timeout','$q', 'pokemonActions', function($scope, $http, $timeout,$q, pokemonActions) {



  $scope.message = "Welcome to the Stadium!!"

  var getDeets = function(arr){
    var deets = [];
    arr.forEach(function(value, i){
     pokemonActions.getMoveDeets(value,function(x){ deets.push(x)})
    })
    return deets;
  };

  var init = function(player){
    $scope[player] = {};
    $scope[player].wins = 0;
    $scope[player].turn = true;
  }
  
  //bad practice to have the $http request in the Controller. TODO: Abstract to factory.
  var render = function(player){
    var pokemon = Math.floor(Math.random(0,1)*200)
    $http.get('http://pokeapi.co/api/v1/pokemon/' + pokemon)
    .success(function(data, status, headers, config) {
      $scope[player].max = data.hp;
      $scope[player].dynamic = data.hp;
      $scope[player].name   = data.name;
      $scope[player].isCollapsed = true;
      $scope[player].type = data.types;
      $scope[player].attack = data.attack;
      $scope[player].defense = data.defense;
      $scope[player].descriptions = data.abilities;
      $scope[player].moves = getDeets(pokemonActions.grabFour(data.moves))
      $http.get('http://pokeapi.co/' + data.sprites[0].resource_uri)
    .success(function(data, status, headers, config) {
      $scope[player].pokemon = 'http://pokeapi.co/' + data.image;
      $http.get('http://pokeapi.co/' + $scope[player].type[0].resource_uri)
        .success(function(data){
          $scope[player].ineffective = data.ineffective.map(function(x){return x.name});
          $scope[player].superEffective = data.super_effective.map(function(x){return x.name});
          $scope[player].weakness = data.weakness.map(function(x){return x.name});
          $scope[player].noEffect = data.no_effect.map(function(x){return x.name});
        })
    })})
    .error(function(data, status, headers, config) {
      $scope.pokemon = 'No pokemon here!';
    });


      $scope.homeAttack = function(player, attack){
        var cond = '';
        var attackValue = Math.floor(Math.random(0.5,1) * attack.power)
        if(attackValue <= 0) console.log('This is a secondary move');
        if(attackValue > $scope.away.max - 10) cond = 'CRITICAL HIT!'
        $scope.message = player.name + " has done " + attackValue + ' Damage!!! ' + cond
        $scope.away.dynamic -= attackValue;
        $scope.home.turn = false;
        $scope.away.turn = true;
        if($scope.away.dynamic <= 0){
          $scope.home.wins++; 
          render('home'); 
          render('away');
        }

      }

      $scope.awayAttack = function(player, attack){
         var attackValue = Math.floor(Math.random(0.8,1) * attack.power) - (Math.floor(Math.random(0.8,1) * $scope.home.defense / 10));
         if (attackValue < 0) attackValue = 5;
         $scope.message = player.name + " has done " + attackValue + ' Damage!!!'
         $scope.home.dynamic  -= attackValue;
         $scope.away.turn = false;
         $scope.home.turn = true;
         if($scope.home.dynamic <= 0){
          $scope.away.wins++; 
          render('home'); 
          render('away');
        }
      }
  };

  render('away');
  render('home');
  init('away');
  init('home')
}])


.factory('pokemonActions', function($http, $q){

  return { 

    grabFour: function(array){
      var arr = [];
      for(var i = 0; i < 4; i++){
        var index = Math.floor(Math.random(0,1) * array.length);
          arr.push(array[index])
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

