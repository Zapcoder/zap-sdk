/// <reference path="../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../sdk/definitions/zapcoder.d.ts"/>

module Demo {

    export class PlayerCollision extends Zapcoder.Entities.Components.Component {

        

        constructor(config) {
            super(config);
            
        }

        init(entity) {

            super.init(entity);

            entity.events.listen('collision.ground', function(e) {
                Zap.engine.lose();
            });

            entity.events.listen('collision.gate', function(e) {
                Zap.engine.lose();
            });

            entity.events.listen('collision.goal', function(e) {
                Zap.engine.session.score += 10;  
                e.kill();
            });
        }

        update() {
            
        }
    }

    Zap.components.register('Demo.PlayerCollision', Demo.PlayerCollision);
}
