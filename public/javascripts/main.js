function formatData(data) {
  var result = []
  data.hosts.forEach(function(doc) {
    result.push([doc.host, doc.activity/data.total])
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

$(function () {
  $.ajax({
    url: '/analytics_api'
  , success: function(data) {
      makeChart(data)
    }
  })
    
});
    
