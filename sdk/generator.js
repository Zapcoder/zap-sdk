var component = require('./generators/component.js')
  , object = require('./generators/object.js')
  , game   = require('./generators/game.js');

exports.name = 'generate';
exports.alias = 'g';
exports.description = 'Generate different items';
exports.options = {
    component: {
        description: 'Generate a new component typescript file',
        options: '[name:{name} [module:{module}] [{property1}:{type}[:{default}] [{property2}:{type}[:{default}]]...]]',
        call: component.generate
    },
    entity: {
        description: 'Generate a new entity in the game.json file',
        options: '{name} [{component_name1} [{component_name2}[...]]]',
        call: object.generate
    },
    game: {
        description: 'Generate a new game (This removes any existing game.json file)',
        call: game.generate
    }
};
