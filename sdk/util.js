var chalk = require('chalk');

var DEBUG = true;

exports.repeat = function(s, n) {
    var a = [];
    while(a.length < n) {
        a.push(s);
    }
    return a.join('');
}

exports.foreach = function(obj, callback) {
    for( var key in obj ) {
        if( obj.hasOwnProperty(key)) {
            if(callback(key, obj[key]) === false)
                return;
        }
    }
}

exports.getProperty = function(obj, property) {
    var arr = property.split('.');
    while(arr.length && ( obj = obj[arr.shift()]));
    return obj;
}

exports.guessType = function(value) {
    if( value.match(new RegExp("^true$", 'i')) )
        return true;
    else if( value.match(new RegExp("^false$", 'i')))
        return false;
    else if( value.match(/^[0-9]$/) )
        return parseInt(value);
    else
        return value;
}

exports.styles = {
    syntax: chalk.green,
    header: chalk.green.bold,
    prompt: chalk.green,
    warning: chalk.red
}

exports.compareArrays = function(arr1, arr2) {
    if(arr1.sort().join(',') === arr2.sort().join(',')) {
        return true;
    }
    return false;
}

exports.log = function(message, pre){
    var pre = pre ? exports.styles.syntax(pre+': ') : '';
    console.log('['+exports.styles.syntax('ZAP')+'] '+pre+message);
}

exports.debug = function(message) {
    if(DEBUG)
        exports.log(message, 'DEBUG');
}

exports.created = function(filename) {
    var message = exports.styles.syntax('Created: ')+filename;
    exports.log(message);
}

exports.updated = function(filename) {
    var message = exports.styles.syntax('Updated: ')+filename;
    exports.log(message);
}
