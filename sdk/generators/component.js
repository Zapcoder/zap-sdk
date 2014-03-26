var fs     = require('fs')
  , prompt = require('prompt')
  , mkdirp = require('mkdirp')
  , util   = require('../util.js');

prompt.message = prompt.delimiter = '';

exports.generate = function(data){

    var name = null;
    var module = null;
    if(data[0] && data[0].indexOf('name') !== -1) {
        name = data.shift();
        name = name.replace('name:','');

        if(data[0] && data[0].indexOf('module') !== -1) {
            module = data.shift();
            module = module.replace('module:', '');            
        }
        createComponent(module, name, data);
    }
    else {
        var properties = {
            name: {
                validator: '^[A-Z]+[a-zA-Z0-9]+$',
                warning: util.styles.warning('Name must start with a capital letter and can only contain letters and numbers'),
                required: true,
                message: util.styles.prompt("Name")
            },
            module: {
                validator: /(^[A-Z]+[a-zA-Z0-9]+|\.|[A-Z]+[a-zA-Z0-9]+)/,
                warning: 'Modules must start with a capital letter and can only contain letters and numbers (Use "." for nested models)',
                message: util.styles.prompt("Module")
            }
        };

        prompt.start();

        prompt.get({properties: properties}, function(err, result) {
            if(err) { return console.log(err); }
            createComponent(result.module, result.name, data)
        });
    }
}

function createComponent(module, name, data) {
    
    var properties = getProperties(data);

    var file = null;
    if( module )
        file = './sdk/templates/component.module.template';
    else 
        file = './sdk/templates/component.template';
        

    fs.readFile(file, 'utf8', function( err, data ) {
        if( err ) {
            return console.log(err);
        }
        var base = './typescript/';
        var dirs = null;
        var template = data;
        var back = null;

        if(module) {
            dirs = module.split('.');
            back = dirs.length + 1;
        }
        else {
            back = 1;
            dirs = [];
        }

        template = template.replace(/{name}/g, name).replace(/{module}/g, module).replace(/{back}/g, util.repeat('../', dirs.length + 1));

        var propertyString = '';
        var initString = '';
        var tabs = null;
        if( module )
            tabs = 2;
        else
            tabs = 1;

        if(properties){
            for( var i = 0; i < properties.length; i++ ) {
                propertyString += 'public '+properties[i].name+': '+
                    properties[i].type+';\n'+util.repeat('\t', tabs);

                initString += 'this.'+properties[i].name+' = '+(properties[i].type == 'number' ? '+' : '')+'config.'+properties[i].name+
                    ' || '+(properties[i].type == 'string' ? "\'" : '') +properties[i].value+(properties[i].type == 'string' ? "\'" : '')+';\n'+util.repeat('\t', tabs+1);
            }
        }

        template = template.replace(/{properties}/g, propertyString)
            .replace(/{set_properties}/g, initString);;

        var dir = base + dirs.join('/');
        var file = dir + '/' + name +'.ts';

        mkdirp(dir, function(err) {
            if( err ) {
                console.log(err);
                return;
            }

            fs.writeFile(file, template, function(err) {
                util.created(file);
                createSchema(name, module, properties);
            });
        });
    });
}

function createSchema(name, module, properties) {
    var schema = {
        name: name,
        module: module,
        properties: properties
    };
    var dir = !!module ? module.split('.') : [];
    dir.unshift('schemas');
    dir = './' + dir.join('/');
    var file = dir+'/'+name+'.json';

    mkdirp(dir, function(err) {
        if( err ) {
            console.log(err);
            return;
        }
        fs.writeFile(file, JSON.stringify(schema, null, 4), function(err) {
            util.created(file);
        });
    });
}

function getProperties(data) {
    if(data.length == 0) return null;

    var properties = [];

    for(var i = 0; i < data.length; i++ )
    {
        var property = data[i].split(':');
        var name = property[0];
        var type = property[1];
        var value = 'null';

        if(property.length > 2) {
            if(type == 'string')
                value = property[2];
            else
                value = property[2];
        }

        properties.push({
            name: name,
            type: type,
            value: value
        });
    }
    return properties;
}
