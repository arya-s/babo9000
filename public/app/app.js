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

babo9000App.config(['$routeProvider', '$locationProvider', '$httpProvider',
  function ($routeProvider, $locationProvider, $httpProvider) {
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
      when('/auth', {
        templateUrl: 'partials/auth',
        controller: 'AuthCtrl'
      }).
      otherwise({
        redirectTo: '/'
      })
    $locationProvider.html5Mode(true)

    var notAuthRedirect = ['$q', '$location', function ($q, $location) {
      var success = function (response) {
        return response
      }

      var error = function (response) {
        if (response.status === 403) {
          //redirect to auth
          $location.path('/auth')

          return $q.reject(response)
        } 
        else {
          return $q.reject(response)
        }
      }

      return function (promise) {
        return promise.then(success, error)
      }
    }]
    $httpProvider.responseInterceptors.push(notAuthRedirect)
  }
])

