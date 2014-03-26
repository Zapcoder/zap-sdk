var prompt = require('prompt')
  , util   = require('../util.js')
  , dir    = require('node-dir')
  , game   = require('../../src/game.json')
  , fs     = require('fs');

prompt.message = prompt.delimiter = '';

var schema = {
    properties: {
        name: {
            pattern: /^\w+$/,
            type: 'string',
            description: util.styles.prompt('Name'),
            message: util.styles.warning('Name must be letters and numbers only'),
            required: true
        }
    }
};

var name = null;
var object = {components:[]};
var schemas = [];

exports.generate = function(data) {

    schemas = [];
    name = data.shift();

    dir.readFiles('./schemas', {recursive: true}, function(err, content, filename, next) {
        if( err ){
            console.log(err);
            return;
        }
        var schema = content;
        module = filename.replace(/^schemas\//, '').replace(/\//g, '.').replace(/\.\w+\.json$/, '');
        content = JSON.parse(content);
        if(module !== '')
            content.module = module;
        schemas.push(content);
        next();
    }, function() {
        addComponents(data);
    });
}

function addComponents(components, i) {
    if( typeof i === 'undefined' ) {
        i = 0;
    }

    if(i >= components.length) {
        return createObject();boolean
    }

    var schema = null;
    if( (schema = getSchema(components[i]) ) ) {
        if( schema.length == 1 ) {
            generateFromSchema(components, schema[0], i);
        }
        else
        {
            util.log(components[i] + ' found in multiple modules');
            var options = [];
            for( j = 0; j < schema.length; j++ ) {
                options.push(j); 
                util.log(util.styles.header('['+j+'] ') + schema[j].module);
            }
            var pattern = new RegExp("^("+options.join('|')+")$");
            var options = {properties: {
                module: {
                    pattern: pattern,
                    description: util.styles.prompt('Select a module'),
                    message: util.styles.warning('Please select one of the available modules'),
                    required: true
                }
            }};

            prompt.get(options, function(err, result) {
                if( err ) {
                    console.log(err);
                    return;
                }
                generateFromSchema(components, schema[result.module], i);
            });
        }
    }
    else
    {
        object.components.push({
            type: components[i]
        });
        addComponents(components, ++i);
    }
}

function generateFromSchema(components, schema, i) {

    var component = components[i];
    var name = null;

    if(schema.module)
        name = schema.module+'.'+component;
    else
        name = component;

    if(!schema.properties) {
        object.components.push({
            type: name
        });
        addComponents(components, ++i);
    }
    else {
        util.log(util.styles.header('Options for: ')+ name);
        var props = {properties: {}};
        var properties = schema.properties;
        for( var j = 0; j < properties.length; j++ ) {
            props.properties[properties[j].name] = {
                description: util.styles.prompt(properties[j].name),
                before: function(value) {
                    return util.guessType(value);
                }
            };
            if(properties[j].value)
                props.properties[properties[j].name].default = properties[j].value;
        }
        prompt.start();

        prompt.get(props, function(err, result) {
            if( err ) {
                console.log(err);
                return;
            }
            result.type = name;
            
            util.foreach(result, function(key, val) {
                if(val === 'null' || val === '')
                    result[key] = null;
            });


            object.components.push(result);
            addComponents(components, ++i);
        });
    }
}

function createObject() {
    var file = './src/game.json';
    game.objects[name] = object;
    fs.writeFile(file, JSON.stringify(game, null, 4), function(err) {
        if(err) {
            console.log(err);
            return;
        }
        console.log(util.styles.header('Updated: ') + file);
    });
}

function getSchema(component) {
    var schema = [];
    for( var i = 0; i < schemas.length; i++ ) {
        if(component == schemas[i].name)
            schema.push(schemas[i]);
    }
    return schema.length != 0 ? schema : null;
}
