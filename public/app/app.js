var babo9000App = angular.module('babo9000App', [
  'ngRoute',
  'babo9000Controllers'
])

babo9000App.config(['$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: 'IndexCtrl'
      }).
      when('/help', {
        templateUrl: 'partials/help',
        controller: 'HelpCtrl'
      }).
      when('/analytics', {
        templateUrl:'partials/analytics',
        controller: 'AnalyticsCtrl'
      }).
      otherwise({
        redirectTo: '/'
      })
    $locationProvider.html5Mode(true)
  }])