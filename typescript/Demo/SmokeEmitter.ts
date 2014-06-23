/// <reference path="../../sdk/definitions/phaser.d.ts"/>
/// <reference path="../../sdk/definitions/zapcoder.d.ts"/>

module Demo {

    export class SmokeEmitter extends Zapcoder.Entities.Components.Component {

        private emitter;

        constructor(config) {
            super(config);

        }

        init(entity) {
            super.init(entity);
            this.emitter = Zap.engine.game.add.emitter(entity.sprite.x, entity.sprite.y, 100);
            this.emitter.makeParticles(['megusta']);
            this.emitter.gravity = 10;
            this.emitter.start(false, 3000, 2);
        }

        update() {
            this.emitter.emitX = this.entity.sprite.x;
            this.emitter.emitY = this.entity.sprite.y;
            // Add update code here
        }
    }

    Zap.components.register('Demo.SmokeEmitter', Demo.SmokeEmitter);
}
