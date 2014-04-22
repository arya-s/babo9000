//requires all files in the commands dir
//returns an object with each command's name as key,
//and the command itself as value
//each command must module.exports a functionon to which an irc object
//with all necessary objects to interact with irc

var fs = require('fs')
, path = require('path')

module.exports = function(cb) {
    var cmds = {}

    fs.readdir(path.join(__dirname, '..', 'commands'), function(err, files) {
        if(err) {
            console.log('error loading command', err)
        } else {
            for (var i=0;i<files.length;i++) {
                var command = files[i]

                if(command.indexOf('.js') == command.length-3) {
                    cmds[command.substring(0, command.length-3)] = require(path.join(__dirname, '..', 'commands', command))
                } else { 
                    console.log('error loading file with unkown extension', commnd)
                }
            }
        }

        //Done
        cb(cmds)
    })
}
