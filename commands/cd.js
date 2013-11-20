var util = require('util')
  , participants = []
  , numParticipants = 0
  , commands = ['ready', 'cancel', 'go', 'begin']
  , isWaiting = false

module.exports = function countdown(irc) {
  function isViableSubCommand(subcommand) {
    return commands.indexOf(subcommand) >= 0
  }

  function isViableCountdownNumber(number) {
    return !isNaN(number)
  }

  function isViableInput(input) {
    //begin requires 2 subcommands, others require only 1
    //only set numParticipants on begin
    if (input[0] == 'begin') {
      setNumParticipants(input[1])
      return isViableSubCommand(input[0]) && isViableCountdownNumber(input[1])
    }
    else {
      return isViableSubCommand(input[0])
    }
  }

  function setNumParticipants(n) {
    numParticipants = n
  }

  function countdown(irc) {
    var i = 3
    irc.client.say(irc.to, util.format('%s, starting countdown', participants.join(', ')))
    
    ;(function start(i) {
      irc.client.say(irc.to, i.toString())
      i--
      if (i>=0) {
        global.setTimeout(function() {
          start(i)
        }, 1000)
      }
    }(i))
  }

  function commandController(subcommand, irc) {
    //if subcommand in commands array, then get its index and run it
    var commandIndex = commands.indexOf(subcommand)

    //fn is a string, so use brackets to access
    var fn = commands[commandIndex]
    requiresWait(fn, irc)
  }

  function validCommands(irc) {
    irc.client.say(irc.to, util.format('Valid commands: .cd %s', commands.join(' .cd ')))
    irc.client.say(irc.to, 'Make sure you enter a number after begin for number of participants.')
  }

  function doneWaiting() {
    participants = []
    numParticipants = 0
    isWaiting = false
  }

  function requiresWait(fn, irc) {
    //allow begin to run if not waiting
    //inverse for every other function
    if (fn == 'begin' && !isWaiting) {
      countDownCommands[fn](irc)
    }
    else if (isWaiting) {
      countDownCommands[fn](irc)
    }
  }

  var countDownCommands = {
    ready: function(irc) {
      participants.push(irc.nick)
      if (participants.length == numParticipants) {
        countdown(irc)
        doneWaiting()
      } else {
        irc.client.say(irc.to, util.format('Waiting on %d more participants to ready', 
          numParticipants - participants.length)
        )
      }
    }

  , cancel: function(irc) {
      irc.client.say(irc.to, 'Cancelling wait')
      doneWaiting()
    }

  , go: function(irc) {
      countdown(irc)
      doneWaiting()
    }

  , begin: function(irc) {
      isWaiting = true
      irc.client.say(irc.to, util.format('Commands: .cd %s', commands.join(' .cd ')))
      irc.client.say(irc.to, util.format('%s participants. Waiting on everyone to type .cd ready.',
        numParticipants)
      )
    }
  }


  var input = irc.text.split(' ')
  input[1] = parseInt(input[1], 10)

  if (!isViableInput(input)) {
    validCommands(irc)
    return
  }

  commandController(input[0], irc)
}