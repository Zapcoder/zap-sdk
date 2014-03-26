#! /usr/bin/env node
var commands = {
    generator: require('./sdk/generator.js'),
    task: require('./sdk/task.js'),
    sync: require('./sdk/sync.js')
};

var alias = {};
for( var key in commands ) {
    alias[commands[key].alias] = commands[key].name;
}

var help = require('./sdk/help.js')
  , util = require('./sdk/util.js')
  , argv = require('minimist')(process.argv.slice(2), {
        alias: alias
    });

if( 'help' in argv || process.argv.length <= 2) {
    help.display(commands);
    return;
}

util.foreach(argv, function(c, o) {
    if(c == '_')
        return;
    util.foreach(commands, function(key, command) {
        if(command.alias == c){
            if( o in command.options ) {
                command.options[o].call(argv._);
                return false;
            }
            else {
                help.invalidOption(c, o);
                return false;
            }
        }
    });
});
