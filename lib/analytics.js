module.exports = function(messageMap, db) {
  var hosts = Object.keys(messageMap)
  hosts.forEach(function(host) {
    db.updateAnalytics(host, messageMap[host], function(err) {
      if (err) {
        console.log('error updating analytics')
      }
    })
  })
}