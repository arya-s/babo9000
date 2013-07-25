var sqlite3 = require('sqlite3').verbose()
  , db = new sqlite3.Database('dict.sqlite', 'sqlite3.OPEN_READONLY', function() {
    console.log('database opened')
    db.run("CREATE TABLE dict (kanji TEXT, kana TEXT, entry TEXT)")
  })

module.exports = function(irc) {
  var word = irc.text.split(' ')[1]

  db.get("SELECT * FROM dict WHERE kanji=$word OR kana=$word", word, function(err, row) {
    if (err) irc.client.say('error')
    else {
      if (row && row.entry) {
        irc.client.say(irc.to, row.entry)
      } else {
        irc.client.say(irc.to, "I don't know that word")
      }
    }
  })
}