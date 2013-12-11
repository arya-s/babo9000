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

Database.prototype.updateAnalytics = function(host, user, cb) {
  Database.db.collection('analytics', function(err, users) {
    if (err) {
      cb(err)
    } else {
      //updates activity after finding host, if not found, creates new with activity
      users.update({host: host}, {$inc: {activity: user.activity}, $set: {nick: user.nick}}, {upsert:true}, function(err, result) {
        if (err) {
          cb(err)
        } else {
          cb(null)
        }
      })
    }
  })
}

//get total # of activity and every doc host for pie chart
Database.prototype.getAnalytics = function(cb) {
  Database.db.collection('analytics', function(err, users) {
    if (err) {
      cb(err)
    } else {
      var stream = users.find().stream()
      cb(null, stream)
    }
  })
}

Database.prototype.setReminder = function(reminder, cb) {
  Database.db.collection('reminders', function(err, reminders) {
    if (err) {
      cb(err)
    } else {
      reminders.insert(reminder, function(err) {
        if (err) {
          cb(err)
        } else {
          cb(null)
        }
      })
    }
  })
}

//incase bot discs, we use this to init all reminders
Database.prototype.getReminder = function(cb) {
  Database.db.collection('reminders', function(err, reminders) {
    if (err) {
      cb(err)
    } else {
      reminders.find().toArray(function(err, docs) {
        if (err) {
          cb(err)
        } else {
          cb(null, docs)
        }
      })
    }
  })
}

Database.prototype.delReminder = function(reminder, cb) {
  Database.db.collection('reminders', function(err, reminders) {
    if (err) {
      cb(err)
    } else {
      reminders.remove(reminder, {w:1}, function(err) {
        if (err) {
          cb(err)
        }
      })
    }
  })
}