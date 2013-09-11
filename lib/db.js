var url = require('../db.config.js')
  , MongoClient = require('mongodb')

module.exports = function(cb) {
  new MongoClient(url, function(err, db) {
    if (err) {
      throw err
    } else {
      Database.db = db
      cb(new Database())
    }
  })
}

function Database() {
}

Database.prototype.filters = function(cb) {
  Database.db.collection('filters', function(err, filters) {
    if (err) {
      cb(err)
    } else {
      filters.find().toArray(function(err, items) {
        if (err) {
          cb(err)
        } else {
          cb(null, items)
        }
      })
    }
  })
}

Database.prototype.addFilter = function(filter, cb) {
  Database.db.collection('filters', function(err, filters) {
    if (err) {
      cb(err)
    } else {
      filters.insert(filter, {w:1}, function(err, result) {
        if (err) {
          cb(err)
        } else {
          cb(null)
        }
      })
    }
  })
}

Database.prototype.deleteFilter = function(filter, cb) {
  Database.db.collection('filters', function(err, filters) {
    if (err) {
      cb(err)
    } else {
      filters.remove(filter, {w:1}, function(err, numOfRemoved) {
        if (err) {
          cb(err)
        } else {
          cb(err, numOfRemoved)
        }
      })
    }
  })
}

Database.prototype.parsedShows = function(show, cb) {
  Database.db.collection('parsed', function(err, shows) {
    if (err) {
      cb(err)
    } else {
      shows.findOne(show, function(err, item) {
        if (err) {
          cb(err)
        } else {
          cb(null, item)
        }
      })
    }
  })
}

Database.prototype.addParsedShow = function(show, cb) {
  Database.db.collection('parsed', function(err, shows) {
    if (err) {
      cb(err)
    } else {
      shows.insert(show, {w:1}, function(err, result) {
        if (err) {
          cb(err)
        } else {
          cb(null)
        }
      })
    }
  })
}

Database.prototype.recentParsed = function(cb) {
  Database.db.collection('parsed', function(err, shows) {
    if (err) {
      cb(err)
    } else {
      shows.find().sort({_id:-1}).limit(4).toArray(function(err, items) {
        if (err) {
          cb(err)
        } else {
          cb(null, items)
        }
      })
    }
  })
}

Database.prototype.updateAnalytics = function(host, activity, cb) {
  Database.db.collection('analytics', function(err, users) {
    if (err) {
      cb(err)
    } else {
      //updates activity after finding host, if not found, creates new with activity
      users.update({host: host}, {$inc: {activity: activity}}, {upsert:true}, function(err, result) {
        if (err) {
          cb(err)
        } else {
          cb(null)
        }
      })
    }
  })
}