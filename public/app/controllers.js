var babo9000Controllers = angular.module('babo9000Controllers', [])

babo9000Controllers.controller('IndexCtrl', ['$scope',
  function ($scope) {
  
  }
])

babo9000Controllers.controller('AuthCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $scope.submitSecret = function() {
      $http.post('auth', {secret: $scope.secret}).success(function(data) {
        $location.path('/index')
      })
    }
  }
])

babo9000Controllers.controller('HelpCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('commands.json').success(function (data) {
      $scope.trigger = data.trigger
    })
  }
])

babo9000Controllers.controller('AnalyticsCtrl', ['$scope', '$http',
  function ($scope, $http) {
    function formatData(data) {
      var result = []
      data.hosts.forEach(function(doc) {
        result.push([doc.nick, doc.activity/data.total])
      })
      return result
    }

    function makeChart(data) {
      $('#chart').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Activity'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Activity',
          data: formatData(data)
        }]
      });
    }

    $(function() {
      $.ajax({
        url: '/analytics.json'
      , success: function(data) {
          makeChart(data)
        }
      })
    })
  }
])

babo9000Controllers.controller('WebChatCtrl', ['$scope', 'socket',
  function($scope, socket) {
    $scope.messages = []
    socket.on('message', function(data) {
      $scope.messages.push(data)
    })
  }
])