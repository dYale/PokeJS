angular.module('PokeApp', ['PokeCtrl',
  'ngRoute'
])
.config(function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/index.html',
        controller: 'PokeCtrl'
      })
      .otherwise({
        redirectTo: '/components/Poke.html',
      })
});



