var util = require('./util.js');

exports.display = function(commands) {

    console.log(util.styles.header('\
========================================\n\
          Zap SDK Toolkit\n\
========================================'
    ));

    console.log('The Zap SDK Toolkit handles component / entity generation, file syncing and lots more.');
    console.log('See below for usage information.\n');

    console.log(util.styles.header('usage:'));
    for( var key in commands ) {
        if( commands.hasOwnProperty(key) ) {
            var command = commands[key];
            console.log(util.styles.syntax('\t-'+command.alias+' , --'+command.name));
            console.log('\t'+command.description);
            console.log(util.styles.header('\tOptions:'));

            var options = command.options;
            for( var name in options ) {
                if( options.hasOwnProperty(name) ) {
                    console.log('\t\t'+util.styles.syntax('['+name+']')+' - '+options[name].description);
                    if(options[name].options) {
                        console.log((
                                    '\t\t\tArguments: '+util.styles.syntax(options[name].options)
                                ));
                    }
                }
            }
            console.log('');
        }
    }
}

exports.invalidOption = function(command, option) {
    console.log(util.styles.warning('Invalid option "'+option+'" for command: -'+command));
    console.log(util.styles.warning('See --help for more information'));
}
