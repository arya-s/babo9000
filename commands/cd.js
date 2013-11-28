var util = require('util')
  , participants = []
  , numParticipants = 0
  , isWaiting = false

var countDownCommands = {
  ready: function(irc) {
    if (participants.indexOf(irc.nick) < 0) {
      participants.push(irc.nick)
    } else {
      irc.client.say(irc.to, util.format('You are already in the queue %s.', irc.nick))
    }
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
    irc.client.say(irc.to, util.format('Starting without all participants being ready.'))
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

function isViableSubCommand(subcommand) {
  return commands.indexOf(subcommand) >= 0
}

function isViableCountdownNumber(number) {
  return !isNaN(number)
}

function setParticipants(input) {
  setNumParticipants(input[1])
}

function isBegin(input) {
  return input[0] == 'begin'
}

function setNumParticipants(n) {
  n = parseInt(n, 10)
  numParticipants = n
}

function countdown(irc) {
  var i = 3

  if (participants.length > 0) {
    irc.client.say(irc.to, util.format('%s, starting countdown', participants.join(', ')))
  }
  //buffer of 2 seconds before countdown
  global.setTimeout(function() {
    start(i)
  }, 2000)

  function start(i) {
    irc.client.say(irc.to, i.toString())
    if (i>0) {
      global.setTimeout(function() {
        start(--i)
      }, 1000)
    }
  }
}

function commandController(subcommand, irc) {
  //if subcommand in commands array, then get its index and run it
  var commandIndex = commands.indexOf(subcommand)

  //fn is a string, so use brackets to access
  var fn = commands[commandIndex]
  countDownCommands[fn](irc)
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

//make an array of commands in countdowncommands
var commands = Object.keys(countDownCommands)

module.exports = function(irc) {
  var input = irc.text.split(' ')

  //we need to process the second input only if subcommand is begin,
  //and we should only set the new number if we are not currently 
  //in the middle of a countdown wait
  if (isBegin(input)) {
    if (!isWaiting) {
      if ( !(isViableSubCommand(input[0]) && isViableCountdownNumber(input[1])) ) {
        validCommands(irc)
        return
      }
      setParticipants(input, irc)
    } else {
      irc.client.say(irc.to, 'A countdown is already in progress.')
      return
    }
  //if subcommand is anything else, don't check for number
  //only begin requires a non wait. every other subcommand applies to a waiting state
  } else {
    if (!isViableSubCommand(input[0])) {
      validCommands(irc)
      return
    }
    if (!isWaiting) {
      irc.client.say(irc.to, 'Countdown not in progress.')
      return
    }
  }

  commandController(input[0], irc)
}