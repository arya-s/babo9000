var babo9000App = angular.module('babo9000App', [
  'ngRoute',
  'babo9000Controllers'
])

babo9000App.factory('socket', function ($rootScope) {
  var socket = io.connect()
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments
        $rootScope.$apply(function () {
          callback.apply(socket, args)
        })
      })
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args)
          }
        })
      })
    }
  }
})

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
      when('/webchat', {
        templateUrl: 'partials/webchat',
        controller: 'WebChatCtrl'
      }).
      otherwise({
        redirectTo: '/'
      })
    $locationProvider.html5Mode(true)
  }
])

